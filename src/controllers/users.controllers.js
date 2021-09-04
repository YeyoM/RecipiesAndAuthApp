const usersCtrl = {};
const User = require('../models/User');
const Confirm = require('../models/Confirms');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// config nodemailer rapidooooo
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

//Users signup
usersCtrl.renderSignUpForm = async (req, res) => {
    res.render('users/signup');
    const sessions = await stripe.checkout.sessions.list();
    const data = sessions.data
    console.log(data[0].customer);
};
usersCtrl.signUp = async (req, res) => {
    const errors = [];
    const { name, email, password, confirm_password } = req.body;
    if (password != confirm_password) {
        errors.push({ text: 'Passwords do not match' });
    } if (password.length < 5) {
        errors.push({ text: 'Password must be at least 5 characters long' });
    } if (errors.length > 0) {
        res.render('users/signup', { errors, name, email });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'Email already in use');
            res.redirect('/users/signup');
        } else {
            const customer = await stripe.customers.create({
                name: name, 
                email: email,
            });
            stripeId = customer.id;
            stripeInvoicePrefix = customer.invoice_prefix;
            const newUser = new User({ name, email, password, stripeId, stripeInvoicePrefix });
            newUser.password = await newUser.encryptPassword(password);
            newUser.active = false;
            await newUser.save();
            const id = newUser.id;
            jwt.sign({ id }, process.env.TOKEN_SECRETO, { expiresIn: '1d', },
                async (err, emailToken) => {
                    const newConfirm = new Confirm({})
                    newConfirm.content = emailToken;
                    newConfirm.user = newUser.id;
                    await newConfirm.save();
                    const url = `http://localhost:4000/users/confirmation/${emailToken}`;
                    transporter.sendMail({
                        to: newUser.email,
                        subject: 'Confirm Email',
                        html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
                    })
                }
            )
            const user = await User.findOne({ email: email });
            const idForSubscription = user.id
            req.flash('success_msg', 'You are now registered, please confirm your email and proceed with payment')
            res.redirect(`/users/select-subscription/${idForSubscription}`);
        }
    }
};

//Confirm email
usersCtrl.confirmPost = async (req, res) => {
    token = req.originalUrl.slice(20)
    const { user, content } = await Confirm.findOne({ content: token }).lean();
    try {
        jwt.verify(token, process.env.TOKEN_SECRETO);
        console.log(jwt.verify(token, process.env.TOKEN_SECRETO));
        await User.findByIdAndUpdate(user, { confirmed: true });
        await Confirm.findOneAndDelete({ user: user.id });
        req.flash('success_msg', 'Now you can login with your new account');
        res.redirect("/users/signin");
    } catch (err) {
        console.log(err);
    };
};

//Users Signin
usersCtrl.renderSignInForm = (req, res) => {
    res.render('users/signin');
};
usersCtrl.signIn = passport.authenticate('login-normal', {
    failureRedirect: '/users/signin',
    successRedirect: '/ingredients',
    failureFlash: true
});

//Users Signin for Subscription
usersCtrl.renderSignInFormForSubscription = (req, res) => {
    res.render('users/signinSubs');
};
usersCtrl.signInForSubscription = async(req, res, next) => { 
    const checkUser = await User.findOne({ email: req.body.email})
    if(checkUser.suscribed == true) {
        req.flash('success_msg', 'You are already suscribed, just log in into your account');
        res.redirect('/users/signin');
    }else {
        passport.authenticate('login-subs', function(err, user, info) {
            if (err) { 
                return next(err); 
            } if (!user) {
                return res.redirect('/login'); 
            } req.logIn(user, function(err) {
                if (err) { 
                    return next(err); 
                }
                const id = user.id
                console.log(id)
                return res.redirect(`/users/select-subscription/${id}`);
            });
        })(req, res, next);
    }
};

//Users logout
usersCtrl.logOut = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged out successfully');
    res.redirect('/users/signin');
};

//Change user´s name
usersCtrl.updateUser = async (req, res) => {
    const user = await User.findById(req.user.id).lean();
    res.render('users/changeName', { user });
};
usersCtrl.updateName = async (req, res) => {
    const { name } = req.body;
    try {
        await User.findByIdAndUpdate(req.user.id, { name: name }).lean();
        req.flash('success_msg', 'Name Updated Successfully');
        res.redirect('/');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Please fill in the form correctly');
        res.redirect('/');
    };
};

//Delete User
usersCtrl.deleteUserForm = async (req, res) => {
    const user = await User.findById(req.user.id).lean();
    res.render('users/deleteUser', { user })
}
usersCtrl.deleteUser = passport.authenticate('delete-user', { 
    failureRedirect: '/users/deleteUser',
    successRedirect: '/',
    failureFlash: true
});
/*usersCtrl.deleteUser = async (req, res) => {
    const userId = req.user.id;
    const password = req.body.password;
    console.log(password);
    console.log(userId)
    const user = await User.findById(userId);
    const subscriptionId = user.stripeSubscriptionId;
    const customer = user.stripeId
    if(subscriptionId != '') {
        await stripe.subscriptions.del(subscriptionId);
        await stripe.customers.del(customer);
    }
    await User.findByIdAndDelete(userId);
    res.redirect('/');
    req.flash('success', 'User deleted successfully');

}*/

//Cancel and Manage subscription
usersCtrl.cancelSubscription = async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const subscriptionId = user.stripeSubscriptionId;
    await stripe.subscriptions.del(subscriptionId);
    await User.findByIdAndUpdate(req.user.id, {stripeSubscriptionId: '', suscribed: false})
    req.logout();
    req.flash('success_msg', 'Subscription cancelled successfully');
    res.redirect('/');
}
usersCtrl.manageSubscriptionForm = async (req, res) => {
    const user = await User.findById(req.user.id).lean();
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    const unix_timestamp = subscription.billing_cycle_anchor;
    const userSubscription = {};
    userSubscription.planId = subscription.plan.id
    userSubscription.amount = subscription.plan.amount / 100
    userSubscription.interval = subscription.plan.interval
    userSubscription.product = subscription.plan.product
    const date = new Date(unix_timestamp * 1000);
    userSubscription.day = date.getDate();
    userSubscription.month = date.getMonth();
    console.log(userSubscription);
    res.render('users/manageSub', { user, userSubscription });
}
usersCtrl.postCustomerPortal = async (req, res) => {
    const returnUrl = process.env.DOMAIN;
    const user = await User.findById(req.user.id).lean();
    const customer = user.stripeId

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customer,
        return_url: returnUrl,
    });

    res.redirect(303, portalSession.url);

    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    // customer portal, solo falta un boton con un form con peticion post a esta func
};

//Change user´s password
usersCtrl.changePasswordForm = async (req, res) => {
    const user = await User.findById(req.user.id).lean();
    res.render('users/changePassword', { user })
};
usersCtrl.changePasswordLanding = async (req, res) => {
    const user = await User.findById(req.user.id).lean();
    res.render('users/changePasswordLanding', { user })
};
usersCtrl.createEmailCHangePassword = async (req, res) => {
    const id = req.user.id;
    const user = await User.findById(id).lean();
    const email = user.email
    jwt.sign({ id }, process.env.TOKEN_SECRETO, { expiresIn: 1200, },
        async (err, emailToken) => {
            const url = `http://localhost:4000/users/changePassword/${emailToken}`;
            transporter.sendMail({
                to: email,
                subject: 'Change Password',
                html: `Please click this link to change and set your new Password: <a href="${url}">${url}</a>`
            })
        }
    )
    req.flash('success_msg', 'Please check your Email inbox and click the link to change your password')
    res.redirect('/');
};
usersCtrl.updatePassword = async (req, res) => {
    const errors = [];
    const {
        password, confirm_password
    } = req.body;
    if (password != confirm_password) {
        errors.push({ text: 'Passwords do not match' });
    } if (password.length < 5) {
        errors.push({ text: 'Password must be at least 5 characters long' });
    } if (errors.length > 0) {
        res.render('users/signup', { errors });
    } else {
        const newPassword = new User({ password });
        newPassword.password = await newPassword.encryptPassword(password)
        try {
            await User.findByIdAndUpdate(req.user.id, { password: newPassword.password }).lean();
            req.flash('success_msg', 'Password updated Successfully');
            res.redirect('/')
        } catch (err) {
            console.log(err);
            req.flash('error_msg', 'Please fill in the form correctly');
            res.redirect('/ingredients/add');
        }
    }
};

//Paymentssssssssssssss
usersCtrl.renderSubs = (req, res) => {
    const id = req.originalUrl.slice(27)
    res.render('users/selectSubs', { id })
};
usersCtrl.createCheckoutSession = async (req, res) => {
    const domainURL = process.env.DOMAIN;
    const price = process.env.BASIC_PRICE_ID;
    const id = req.originalUrl.slice(25);
    const user = await User.findById(id).lean();
    const customerId = user.stripeId
    

    // Create new Checkout Session for the order
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: customerId,
            payment_method_types: ["card"],
            line_items: [
                {
                    price: price,
                    quantity: 1,
                },
            ],
            // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
            success_url: `${domainURL}/`,
            cancel_url: `${domainURL}/`,
        })
        req.flash('success_msg', 'Payment recieved successfully, now just confirm email if you have not');
        return res.redirect(303, session.url);  
    } catch (e) {
        res.status(400);
        return res.send({
            error: {
                message: e.message,
            }
        });
    }
};
usersCtrl.webhookPost = async (req, res) => {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];

        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err);
            return res.sendStatus(400);
        }
        // Extract the object from the event.
        data = event.data;
        eventType = event.type;

        if (eventType === "invoice.paid") {
            console.log('hola')
            const customerId = event.data.object.customer;
            const subscriptionId = event.data.object.subscription;
            console.log(event)
            console.log(customerId, event.data.object.subscription);
            const customer = await stripe.customers.retrieve(customerId);
            const email = customer.email;
            const user = await User.findOne({ email: email});
            const userId = user.id;
            await User.findByIdAndUpdate(userId, { suscribed: true, stripeSubscriptionId: subscriptionId})
        }

    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    }

    if (eventType === "checkout.session.completed") {
        console.log(`🔔  Payment received!`);
    }
    res.sendStatus(200);
};
usersCtrl.webhookGet = async (req, res) => {
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.send(session);
};
usersCtrl.config = (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        basicPrice: process.env.BASIC_PRICE_ID,
        proPrice: process.env.PRO_PRICE_ID,
    });
};


//Forgot Password
usersCtrl.renderForgotPassword = (req, res) => {
    res.render('users/forgotPassword')
}
usersCtrl.forgotPassword = async (req, res) => {
    const email = req.body.email;
    console.log(email);
    const user = await User.findOne({ email: email }).lean();
    const id = user._id;
    console.log(id)
    try {
        jwt.sign({ id }, process.env.TOKEN_SECRETO, { expiresIn: '1d', },
            async (err, emailToken) => {
                console.log("aaaaa")
                console.log(emailToken)
                console.log("aaaa")
                await User.findByIdAndUpdate(id, {forgotPassword: emailToken}).lean();
                const url = `http://localhost:4000/changeForgotPassword/${emailToken}`;
                transporter.sendMail({
                    to: email,
                    subject: 'Change Password',
                    html: `Please click this link to change and set your new Password: <a href="${url}">${url}</a>`
                })
            }
        )
        req.flash('success_msg', 'Please check your Email inbox and click the link to set a new password')
        res.render('users/signin');
    } catch (err) {
        req.flash('error_msg', 'We could not find the email address, type a valid email address');
        res.render('users/signin')
    }
}
const findUser = function findUser(param, callback){
    User.findOne({forgotPassword: param}, function(err, userObj){
        if(err){
            return callback(err);
        } else if (userObj){
            return callback(null,userObj);
        } else {
            return callback();
        }
    });
}
usersCtrl.changeForgotPassword = async(req, res) => {
    console.log(req.body)
    const forgotPassword = req.body.forgotPassword;
    console.log(forgotPassword)
    try {
        findUser(forgotPassword, async function(error, user) {
            console.log(user);
            const id = user.id;
            console.log(id)
            const errors = [];
            const {
                password, confirm_password
            } = req.body;
            console.log(password, confirm_password)
            if (password != confirm_password) {
                errors.push({ text: 'Passwords do not match' });
            } if (password.length < 5) {
                errors.push({ text: 'Password must be at least 5 characters long' });
            } if (errors.length > 0) {
                res.render('users/signup', { errors });
            } else {
                const newPassword = new User({ password });
                newPassword.password = await newPassword.encryptPassword(password)
                try {
                    await User.findByIdAndUpdate(id, { password: newPassword.password }).lean();
                    await User.findByIdAndUpdate(id, { forgotPassword: ""}).lean();
                    req.flash('success_msg', 'Password Updated Succesfully');
                    res.redirect('/');
                } catch (err) {
                    console.log(err);
                    req.flash('error_msg', 'We found an error trying to change your password, please try again');
                    res.redirect('/');
                }
            }
        });
    } catch (err) {
        req.flash('error_msg', 'We found an error trying to change your password, please try again');
        res.redirect('/');
    }
    
}
usersCtrl.changeForgotPasswordForm = async(req, res) => {
    const token = req.originalUrl.slice(22);
    console.log(token);
    try {
        findUser(token, function(error, user) {
            console.log(user);
            const token = user.forgotPassword;
            res.render('users/forgotPasswordForm', { token });
        });
    } catch (err) {
        req.flash('error_msg', 'We found an error trying to change your password, please try again later');
        res.redirect('/');
    }
}

usersCtrl.page404 = (req, res) => {
    res.status(404);
    res.render('404');
}

module.exports = usersCtrl;