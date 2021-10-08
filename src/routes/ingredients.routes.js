const { Router }        = require('express');
const router            = Router();
const { 
    renderIngredientForm, 
    createIngredient, 
    renderIngredients, 
    renderIngredient,
    renderEditForm, 
    updateIngredient,  
    deleteIngredient 
}                       = require('../controllers/ingredients.controller');
const { 
    isAuthenticated
}                       = require('../helpers/auth');

//////////////////////////////// NEW INGREDIENT
router.get('/ingredients/add', isAuthenticated, renderIngredientForm);
router.post('/ingredients/new-ingredient', isAuthenticated, createIngredient);

//////////////////////////////// GET INGREDIENTS
router.get('/ingredients/:id', isAuthenticated ,renderIngredients);

//////////////////////////////// GET ONE INGREDIENT
router.get('/ingredient/:id', isAuthenticated, renderIngredient);

//////////////////////////////// EDIT INGREDIENT
router.get('/ingredients/edit/:id', isAuthenticated, renderEditForm);
router.put('/ingredients/edit/:id', isAuthenticated, updateIngredient);

//////////////////////////////// DELETE INGREDIENT
router.delete('/ingredients/delete/:id', isAuthenticated, deleteIngredient);


module.exports = router;