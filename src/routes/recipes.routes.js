const { Router }        = require('express');
const router            = Router();
const { 
    renderRecipeForm, 
    createRecipe, 
    renderRecipes, 
    renderRecipe,
    renderEditForm, 
    updateRecipe,  
    deleteRecipe
}                       = require('../controllers/recipes.controller');
const { 
    isAuthenticated
}                       = require('../helpers/auth');

//////////////////////////////// NEW RECIPE
router.get('/recipes/add', isAuthenticated, renderRecipeForm);
router.post('/recipes/new-recipe', isAuthenticated, createRecipe);

//////////////////////////////// GET RECIPES
router.get('/recipes', isAuthenticated, renderRecipes);

//////////////////////////////// GET ONE RECIPE
router.get('/recipe/:id', isAuthenticated, renderRecipe);

/////////////////////////////// EDIT RECIPE
router.get('/recipes/edit/:id', isAuthenticated, renderEditForm);
router.post('/recipes/edit/:id', isAuthenticated, updateRecipe);

//////////////////////////////// DELETE RECIPE
router.delete('/recipes/delete/:id', isAuthenticated, deleteRecipe);

module.exports = router;