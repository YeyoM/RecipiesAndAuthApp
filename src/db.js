const mongoose          = require('mongoose');

const { AUTH_APP_MONGODB_HOST, AUTH_APP_MONGODB_DATABASE} = process.env;
const MONGODB_URIS_LOCAL = `mongodb://${AUTH_APP_MONGODB_HOST}/${ AUTH_APP_MONGODB_DATABASE}`;
const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD

mongoose.connect(MONGODB_URI_PROD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
    .then(db => console.log('DB conected succesfully'))
    .catch(err => console.log(err));