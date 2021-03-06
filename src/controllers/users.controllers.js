const usersCtrl         = {};
const User              = require('../models/User');
const Confirm           = require('../models/Confirms');
const passport          = require('passport');
const jwt               = require('jsonwebtoken');
const nodemailer        = require('nodemailer');
const stripe            = require('stripe')(process.env.STRIPE_SECRET_KEY);

// config nodemailer rapidooooo
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 456,
    secure: true,
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

//Users signup
usersCtrl.renderSignUpForm = async (req, res) => {
    res.render('users/signup');
    try {
        const sessions = await stripe.checkout.sessions.list();
        const data = sessions.data;
        console.log(data[0].customer);
    } catch (err) {
        console.log(err);
    }
};
usersCtrl.signUp = async (req, res) => {
    const errors = [];
    const { name, email, password, confirm_password, phone, ocupation, species } = req.body;
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    } if (password.length < 7) {
        errors.push({ text: 'La contraseña debe de ser al menos 7 caracteres de longitud' });
    } if (errors.length > 0) {
        res.render('users/signup', { errors, name, email });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'Este email ya está en uso');
            res.redirect('/users/signup');
        } else { 
            try {
                const customer = await stripe.customers.create({
                    name: name, 
                    email: email,
                });
                stripeId = customer.id;
                stripeInvoicePrefix = customer.invoice_prefix;
                const newUser = new User({name, email, password, stripeId, stripeInvoicePrefix, phone, ocupation, species });
                newUser.password = await newUser.encryptPassword(password);
                newUser.active = false;
                await newUser.save();
                const id = newUser.id;
                jwt.sign({ id }, process.env.TOKEN_SECRETO, { expiresIn: '1d', },
                    async (err, emailToken) => {
                        const newConfirm = new Confirm({});
                        newConfirm.content = emailToken;
                        newConfirm.user = newUser.id;
                        await newConfirm.save();
                        const url = `https://animals-recipies-app.herokuapp.com/users/confirmation/${emailToken}`;
                        transporter.sendMail({
                            to: newUser.email,
                            subject: 'Confirm Email',
                            html: `Por favor, ingrese al link siguiente para verificar su correo: <a href="${url}">${url}</a>`
                        });
                    }
                )
                const user = await User.findOne({ email: email });
                const idForSubscription = user.id;
                req.flash('success_msg', 'Ya estás registrado, continua con el pago para acceder a tu cuenta');
                res.redirect(`/users/select-subscription/${idForSubscription}`);
            } catch (err) {
                console.log(err);
                req.flash('error_msg', 'Oops! Something went wrong, try again later');
                res.redirect('/');
            }
        }
    }
};

//Confirm email
usersCtrl.confirmPost = async (req, res) => {
    token = req.originalUrl.slice(20);
    const { user, content } = await Confirm.findOne({ content: token }).lean();
    try {
        jwt.verify(token, process.env.TOKEN_SECRETO);
        console.log(jwt.verify(token, process.env.TOKEN_SECRETO));
        await User.findByIdAndUpdate(user, { confirmed: true });
        await Confirm.findOneAndDelete({ user: user.id });
        req.flash('success_msg', 'Ahora puedes acceder a tu nueva cuenta');
        res.redirect("/users/signin");
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    };
};

//Users Signin
usersCtrl.renderSignInForm = (req, res) => {
    res.render('users/signin');
};
usersCtrl.signIn = passport.authenticate('login-normal', {
    failureRedirect: '/users/signin',
    successRedirect: '/',
    failureFlash: true
});

//Users Signin for Subscription
usersCtrl.renderSignInFormForSubscription = (req, res) => {
    res.render('users/signinSubs');
};
usersCtrl.signInForSubscription = async(req, res, next) => { 
    try {
        const checkUser = await User.findOne({ email: req.body.email});
    if(checkUser.suscribed == true) {
        req.flash('success_msg', 'Ya estás suscrito, solo ingresa a tu cuenta');
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
                const id = user.id;
                console.log(id);
                return res.redirect(`/users/select-subscription/${id}`);
            });
        })(req, res, next);
    }
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
};

//Users logout
usersCtrl.logOut = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Haz salido de sesión correctamente');
    res.redirect('/users/signin');
};

//Change user´s name
usersCtrl.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        res.render('users/changeName', { user });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops, having trouble on that page, try again later');
        res.redirect('/');
    }
};
usersCtrl.updateName = async (req, res) => {
    const { name } = req.body;
    try {
        await User.findByIdAndUpdate(req.user.id, { name: name }).lean();
        req.flash('success_msg', 'Nombre actualizado correctamentey');
        res.redirect('/');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Por favor, llene correctamente');
        res.redirect('/');
    };
};

//Delete User
usersCtrl.deleteUserForm = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).lean();
        res.render('users/deleteUser', { user });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops, having trouble on that page, try again later');
        res.redirect('/');
    }
};
usersCtrl.deleteUser = passport.authenticate('delete-user', { 
    failureRedirect: '/users/deleteUser',
    successRedirect: '/',
    failureFlash: true
});

usersCtrl.manageSubscriptionForm = async (req, res) => {
    const user = await User.findById(req.user.id).lean();
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    const unix_timestamp = subscription.billing_cycle_anchor;
    const userSubscription = {};
    userSubscription.planId = subscription.plan.id;
    userSubscription.amount = subscription.plan.amount / 100;
    userSubscription.interval = subscription.plan.interval;
    userSubscription.product = subscription.plan.product;
    const date = new Date(unix_timestamp * 1000);
    userSubscription.day = date.getDate();
    userSubscription.month = date.getMonth();
    console.log(userSubscription);
    res.render('users/manageSub', { user, userSubscription });
};
usersCtrl.postCustomerPortal = async (req, res) => {
    try {
        const returnUrl = 'https://animals-recipies-app.herokuapp.com/users/updateName?session_id{CHECKOUT_SESSION_ID}';
        const user = await User.findById(req.user.id).lean();
        const customer = user.stripeId;
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customer,
            return_url: returnUrl,
        });
        res.redirect(303, portalSession.url);
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops, having trouble on that page, try again later');
        res.redirect('/');
    }
};

//Change user´s password
usersCtrl.changePasswordForm = async (req, res) => {
    const user = await User.findById(req.user.id).lean();
    res.render('users/changePassword', { user });
};
usersCtrl.changePasswordLanding = async (req, res) => {
    const user = await User.findById(req.user.id).lean();
    res.render('users/changePasswordLanding', { user });
};
usersCtrl.createEmailCHangePassword = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).lean();
        const email = user.email;
        jwt.sign({ id }, process.env.TOKEN_SECRETO, { expiresIn: 1200, },
            async (err, emailToken) => {
                const url = `http://animals-recipies-app.herokuapp.com/users/changePassword/${emailToken}`;
                transporter.sendMail({
                    to: email,
                    subject: 'Change Password',
                    html: `Por favor ingrese en el siguiente link para cambiar la contraseña: <a href="${url}">${url}</a>`
                });
            }
        )
        req.flash('success_msg', 'Ingresa a tu correo para cambiar tu contraseña');
        res.redirect('/');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops, algo salió mal, intenta nuevamente más tarde');
        res.redirect('/');
    }
    
};
usersCtrl.updatePassword = async (req, res) => {
    const errors = [];
    const {
        password, confirm_password
    } = req.body;
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    } if (password.length < 7) {
        errors.push({ text: 'La contraseña debe de ser al menos 7 caracteres de longitud' });
    } if (errors.length > 0) {
        res.render('users/signup', { errors });
    } else {
        const newPassword = new User({ password });
        newPassword.password = await newPassword.encryptPassword(password);
        try {
            await User.findByIdAndUpdate(req.user.id, { password: newPassword.password }).lean();
            req.flash('success_msg', 'La contraseña se actualizó correctamente');
            res.redirect('/');
        } catch (err) {
            console.log(err);
            req.flash('error_msg', 'Ingrese los datos correctamente');
            res.redirect('/');
        }
    }
};

//Paymentssssssssssssss
usersCtrl.renderSubs = (req, res) => {
    const id = req.originalUrl.slice(27);
    res.render('users/selectSubs', { id });
};
usersCtrl.createCheckoutSession = async (req, res) => {
    const domainURL = process.env.DOMAIN;
    const price = process.env.BASIC_PRICE_ID;
    const id = req.originalUrl.slice(25);
    const user = await User.findById(id).lean();
    const customerId = user.stripeId;
    

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
            //success_url: `${domainURL}/users/signin`,
            //cancel_url: `${domainURL}/`,
            success_url: 'https://animals-recipies-app.herokuapp.com/users/signin?session_id{CHECKOUT_SESSION_ID}', 
            cancel_url: 'https://animals-recipies-app.herokuapp.com/users/signin?session_id{CHECKOUT_SESSION_ID}',
        })
        req.flash('success_msg', 'Pago recibido correctamente, solo verifique su correo si no lo ha hecho');
        console.log(session.url);
        return res.redirect(303, session.url);  
    } catch (e) {
        res.status(400);
        req.flash('error_msg', 'Oops, algo ha salido mal, intente nuevamente más tarde');
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
    res.render('users/forgotPassword');
};
usersCtrl.forgotPassword = async (req, res) => {
    const email = req.body.email;
    console.log(email);
    const user = await User.findOne({ email: email }).lean();
    const id = user._id;
    console.log(id);
    try {
        jwt.sign({ id }, process.env.TOKEN_SECRETO, { expiresIn: '1d', },
            async (err, emailToken) => {
                console.log("aaaaa");
                console.log(emailToken);
                console.log("aaaa");
                await User.findByIdAndUpdate(id, {forgotPassword: emailToken}).lean();
                const url = `http://animals-recipies-app.herokuapp.com/changeForgotPassword/${emailToken}`;
                transporter.sendMail({
                    to: email,
                    subject: 'Cambio de contraseña',
                    html: `Por favor ingrese en el siguiente link para actualizar su contraseña: <a href="${url}">${url}</a>`
                })
            }
        )
        req.flash('success_msg', 'Ingrese a su correo para actualizar si contraseña');
        res.render('users/signin');
    } catch (err) {
        req.flash('error_msg', 'Oops! no encontramos su correo, ingrese nuevamente');
        res.render('users/signin');
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
};
usersCtrl.changeForgotPassword = async(req, res) => {
    console.log(req.body);
    const forgotPassword = req.body.forgotPassword;
    console.log(forgotPassword);
    try {
        findUser(forgotPassword, async function(error, user) {
            console.log(user);
            const id = user.id;
            console.log(id);
            const errors = [];
            const {
                password, confirm_password
            } = req.body;
            console.log(password, confirm_password);
            if (password != confirm_password) {
                errors.push({ text: 'Las contraseñas no coinciden' });
            } if (password.length < 7) {
                errors.push({ text: 'La contraseña debe de ser al menos 7 caracteres de longitud' });
            } if (errors.length > 0) {
                res.render('users/signup', { errors });
            } else {
                const newPassword = new User({ password });
                newPassword.password = await newPassword.encryptPassword(password);
                try {
                    await User.findByIdAndUpdate(id, { password: newPassword.password }).lean();
                    await User.findByIdAndUpdate(id, { forgotPassword: ""}).lean();
                    req.flash('success_msg', 'Contraseña actualizada correctamente');
                    res.redirect('/');
                } catch (err) {
                    console.log(err);
                    req.flash('error_msg', 'Oops, nos enctontramos con un error al cambiar su contraseña, intente más tarde');
                    res.redirect('/');
                }
            }
        });
    } catch (err) {
        req.flash('error_msg', 'Oops, nos enctontramos con un error al cambiar su contraseña, intente más tard');
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
        req.flash('Oops, nos enctontramos con un error al cambiar su contraseña, intente más tard');
        res.redirect('/');
    }
}

usersCtrl.page404 = (req, res) => {
    res.status(404);
    res.render('404');
}

module.exports = usersCtrl;