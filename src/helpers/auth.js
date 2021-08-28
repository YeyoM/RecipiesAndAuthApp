const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Oops! you are not authorized to access here')
        res.redirect('/users/signin');
    }
}

module.exports = helpers;