                          require('dotenv').config()
const app               = require('./server');
                          require('./db');

const port = app.get('port');
const host = app.get('host');

app.listen(port, host, () => {
    console.log('server running');
});