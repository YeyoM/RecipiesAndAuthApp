const {Schema, model}   = require('mongoose');

const ConfirmSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = model('Confirm', ConfirmSchema, 'confirms');