const {Schema, model}   = require('mongoose');

const RecipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    ingredientsId: {
        type: Array,
        default: []
    },
    ingredientsAmounts: {
        type: Array,
        default: []
    },
    user: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = model('Recipe', RecipeSchema, 'recipes');