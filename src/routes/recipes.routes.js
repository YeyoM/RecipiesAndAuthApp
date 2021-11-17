const { Router }        = require('express');
const router            = Router();
const { 
    selectAnimal,
    lechAnimalForm,
    lechAnimalPost,
    engAnimalForm,
    engAnimalPost,
    selectIngredientsForm,
    selectIngredientsPost,
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
    deleteRecipe,
}                       = require('../controllers/recipes.controller');
const { 
    isAuthenticated
}                       = require('../helpers/auth');

//////////////////////////////// NEW RECIPE
router.get('/recipes/add', isAuthenticated, selectAnimal);
router.get('/recipes/add/ganadolechero', isAuthenticated, lechAnimalForm);
router.post('/recipes/add/ganadolechero', isAuthenticated, lechAnimalPost);
router.get('/recipes/add/ganadoengorda', isAuthenticated, engAnimalForm);
router.post('/recipes/add/ganadoengorda', isAuthenticated, engAnimalPost);
router.get('/recipes/new-recipe/:id', isAuthenticated, selectIngredientsForm);
router.post('/recipes/new-recipe/:id', isAuthenticated, selectIngredientsPost);
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