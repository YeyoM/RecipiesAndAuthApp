const {Schema, model}   = require('mongoose');

const RecipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    animal: {
        type: String, 
        required: true
    },
    ingredientsId: {
        type: Array,
        default: []
        // al parecer seran 14
    },
    ingredientsAmounts: {
        type: Array,
        default: []
    },
    materiaSeca: { 
        type: Number,
    },
    proteina: {
        type: Number,
    },
    pc: {
        type: Number,
    },
    user: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
    }
}, {
    timestamps: true
})

module.exports = model('Recipe', RecipeSchema, 'recipes');