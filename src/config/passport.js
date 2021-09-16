const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const Confirm       = require('../models/Confirms');
const stripe        = require('stripe')(process.env.STRIPE_SECRET_KEY);


passport.use('login-normal', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    // Match user's email
    const user = await User.findOne({ email });
    console.log(user)
    const id = user._id;
    const subs = user.stripeSubscriptionId;
    if ( subs != 'not_subscribed' ){
        try {
            const subscription = await stripe.subscriptions.retrieve(subs);
            const status = subscription.status;
            console.log(status)
            if(status != "active"){
                try {
                    await user.findOneAndUpdate(email, {suscribed: false});
                } catch(err) {
                    console.log(err);
                    res.redirect('/');  
                }
            }
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    }
    if (!user) {
        return done(null, false, { message: 'User Not Found'}); //error
    } else if (!user.suscribed) {
        return done(null, false, { message: 'You need to be suscribed to login' });
    } else if (!user.confirmed) {
        return done(null, false, { message: 'Please confirm your account to login' });
    } else {
        // Match user's password
        const match = await user.matchPassword(password);
        if (match) {
            await Confirm.findOneAndDelete({user: user._id});
            console.log(user.id);
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect Password'});
        }
    } 
}));

passport.use('login-subs', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    // Match user's email
    const user = await User.findOne({ email });
    if (!user) {
        return done(null, false, { message: 'User Not Found'}); //error
    } else if (!user.confirmed) {
        return done(null, false, { message: 'Please confirm your account to login' });
    } else {
        // Match user's password
        const match = await user.matchPassword(password);
        if (match) {
            await Confirm.findOneAndDelete({user: user._id});
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect Password'});
        }
    } 
}));

passport.use('delete-user', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    // Match user's email
    const user = await User.findOne({ email });
    const userId = user.id;
    if (!user) {
        return done(null, false, { message: 'User Not Found'}); //error
    } else if (!user.confirmed) {
        return done(null, false, { message: 'Please confirm your account to login' });
    } else {
        // Match user's password
        const match = await user.matchPassword(password);
        if (match) {
            const subscriptionId = user.stripeSubscriptionId;
            const customer = user.stripeId;
            if(subscriptionId != '') {
                try {
                    await stripe.subscriptions.del(subscriptionId);
                    await stripe.customers.del(customer);
                } catch (err) {
                    console.log(err);
                }
            }
            await User.findByIdAndDelete(userId);
            req.flash('success_msg', 'Account deleted succesfully');
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect Password'});
        }
    } 
}));

passport.use('cancel-subscription', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    // Match user's email
    const user = await User.findOne({ email });
    const userId = user.id;
    if (!user) {
        return done(null, false, { message: 'User Not Found'}); //error
    } else if (!user.confirmed) {
        return done(null, false, { message: 'Please confirm your account to login' });
    } else {
        // Match user's password
        const match = await user.matchPassword(password);
        if (match) {
            const subscriptionId = user.stripeSubscriptionId;
            if(subscriptionId != '') {
                const subscriptionId = user.stripeSubscriptionId;
                try {
                    await stripe.subscriptions.del(subscriptionId);
                    await User.findByIdAndUpdate(req.user.id, {stripeSubscriptionId: '', suscribed: false});
                    req.logout();
                    req.flash('success_msg', 'Sucription cancelled succesfully');
                } catch (err) {
                    console.log(err);
                    req.flash('error_msg', 'Sucription wasn´t cancelled, try again later');
                }
            }
            req.logout();
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect Password'});
        }
    } 
}));



passport.serializeUser(( user, done ) => {
    done(null, user.id);
});

passport.deserializeUser(( id, done ) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});