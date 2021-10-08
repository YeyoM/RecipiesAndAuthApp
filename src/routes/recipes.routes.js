const { Router }        = require('express');
const router            = Router();
const { 
    renderRecipeForm, 
    selectIngredients,
    continueRecipe,
    createRecipe, 
    renderRecipes, 
    renderRecipe,
    renderEditForm, 
    updateRecipe,  
    continueUpdateRecipeForm,
    continueUpdateRecipe,
    deleteRecipe
}                       = require('../controllers/recipes.controller');
const { 
    isAuthenticated
}                       = require('../helpers/auth');

//////////////////////////////// NEW RECIPE
router.get('/recipes/add', isAuthenticated, renderRecipeForm);
router.post('/recipes/new-recipe', isAuthenticated, selectIngredients);
router.get('/recipes/continueRecipe/:id', isAuthenticated, continueRecipe);
router.post('/recipes/continueRecipePost/:id', isAuthenticated, createRecipe);


//////////////////////////////// GET RECIPES
router.get('/recipes', isAuthenticated, renderRecipes);

//////////////////////////////// GET ONE RECIPE
router.get('/recipe/:id', isAuthenticated, renderRecipe);

/////////////////////////////// EDIT RECIPE
router.get('/recipes/edit/:id', isAuthenticated, renderEditForm);
router.put('/recipes/edit/:id', isAuthenticated, updateRecipe);
router.get('/recipes/editContinue/:id', isAuthenticated, continueUpdateRecipeForm);
router.put('/recipes/editContinue/:id', isAuthenticated, continueUpdateRecipe);

//////////////////////////////// DELETE RECIPE
router.delete('/recipes/delete/:id', isAuthenticated, deleteRecipe);

module.exports = router;