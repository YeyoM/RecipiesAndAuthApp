const { Router }        = require('express');
const router            = Router();
const {
    renderSignUpForm,
    signUp,
    confirmPost,
    renderSignInForm,
    signIn,
    renderSignInFormForSubscription,
    signInForSubscription,
    logOut,
    updateUser,
    updateName,
    manageSubscriptionForm,
    postCustomerPortal,
    deleteUserForm,
    deleteUser,
    changePasswordLanding,
    createEmailCHangePassword,
    changePasswordForm,
    updatePassword,
    renderForgotPassword,
    forgotPassword,
    changeForgotPasswordForm,
    changeForgotPassword,
    renderSubs,
    createCheckoutSession,
    costumerPortalPost,
    webhookPost,
    webhookGet,
    config,
    page404
}                   = require('../controllers/users.controllers');
const {
    isAuthenticated
}                   = require('../helpers/auth');

//Users signup
router.get('/users/signup', renderSignUpForm);
router.post('/users/signup', signUp);

//Confirm email
router.get('/users/confirmation/:token', confirmPost);

//Users Signin
router.get('/users/signin', renderSignInForm);
router.post('/users/signin', signIn);

//Users Signin for Subscription
router.get('/users/signin/subscription', renderSignInFormForSubscription);
router.post('/users/signin/subscription', signInForSubscription);

//Users logout
router.get('/users/logout', logOut);

//Update Name
router.get('/users/updateName', isAuthenticated, updateUser);
router.put('/users/updateName/:id', isAuthenticated, updateName);

//Delete User
router.get('/users/deleteUser', isAuthenticated, deleteUserForm);
router.delete('/users/deleteUser/:id', isAuthenticated, deleteUser);

//Manage Subscription
router.get('/users/manageSubscription', isAuthenticated, manageSubscriptionForm);
router.post('/users/customerPortal', isAuthenticated, postCustomerPortal);

//Change user´s password
router.get('/users/changePasswordLanding', isAuthenticated, changePasswordLanding);
router.get('/users/changePasswordLink/:token', isAuthenticated, createEmailCHangePassword);
router.get('/users/changePassword/:id', isAuthenticated, changePasswordForm);
router.put('/users/changePassword/:id', isAuthenticated, updatePassword);

//Payment
router.get('/users/select-subscription/:id', renderSubs);
router.post('/create-checkout-session/:id', createCheckoutSession);
router.post("/webhook", webhookPost);
router.get("/checkout-session", webhookGet);
router.get("/config", config);

//Forgot password
router.get('/forgotPassword', renderForgotPassword);
router.post('/forgotPassword', forgotPassword);
router.get('/changeForgotPassword/:s', changeForgotPasswordForm);
router.post('/changeForgotPassword/:s', changeForgotPassword);

//404
router.use(page404);


module.exports = router;