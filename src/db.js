const mongoose          = require('mongoose');

const { AUTH_APP_MONGODB_HOST, AUTH_APP_MONGODB_DATABASE} = process.env;
const MONGODB_URIS = `mongodb://${AUTH_APP_MONGODB_HOST}/${ AUTH_APP_MONGODB_DATABASE}`

mongoose.connect(MONGODB_URIS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
    .then(db => console.log('DB conected succesfully'))
    .catch(err => console.log(err));