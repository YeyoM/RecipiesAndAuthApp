const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


//////////////////////////////// INITIALIZER
const app = express();
require('./config/passport')

//////////////////////////////// SETTINGS
app.set('port', process.env.PORT || 4000);
app.set('host', process.env.HOST || '0.0.0.0')
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
app.set('trust proxy', 1);

//////////////////////////////// MIDDLEWARES
//app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    cookie:{
        secure: true,
        maxAge:60000
    },
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(
    express.json({
        // We need the raw body to verify webhook signatures.
        // Let's compute it only when hitting the Stripe webhook endpoint.
        verify: function (req, res, buf) {
            if (req.originalUrl.startsWith("/webhook")) {
                req.rawBody = buf.toString();
            }
        },
    })
);


//////////////////////////////// GLOBAL VABS
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//////////////////////////////// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

//////////////////////////////// ROUTES
app.use(require('./routes/index.routes'));
app.use(require('./routes/ingredients.routes'));
app.use(require('./routes/recipes.routes'))
app.use(require('./routes/users.routes'));


module.exports = app;