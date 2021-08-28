const {Schema, model}   = require('mongoose');

const IngredientSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    }, 
    calorias: {
        type: Number,
        required: true
    },
    hdecarbono: {
        type: Number,
        required: true
    },
    grasa: {
        type: Number,
        required: true
    },
    proteina: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

module.exports = model('Ingredient', IngredientSchema, 'ingredients');

