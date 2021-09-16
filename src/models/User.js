const {Schema, model}   = require('mongoose');
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    confirmed: {
        type: Boolean,
        default: false
    },
    forgotPassword: {
        type: String,
    },
    suscribed: {
        type: Boolean,
        default: false
    },
    stripeId: {
        type: String,
    },
    stripeInvoicePrefix: {
        type: String,
    },
    stripeSubscriptionId: {
        type: String,
        default: 'not_subsribed'
    }
}, {
    timestamps: true
});

UserSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = model('User', UserSchema, 'users');



