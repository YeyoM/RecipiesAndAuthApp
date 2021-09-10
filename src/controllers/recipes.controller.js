const recipesCtrl       = {};
const Recipe            = require('../models/Recipe');
const Ingredient        = require('../models/Ingredient');

recipesCtrl.renderRecipeForm = async (req, res) => {
    try {
        const ingredients = await Ingredient.find({user: req.user.id}).sort({createdAt: 'desc'}).lean();
        res.render('recipes/newRecipe', { ingredients });
        console.log(req.body);
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
}

recipesCtrl.createRecipe = async (req, res) => {
    console.log(req.body)
    const { title, 
            ingredientsId, 
            ingredientsAmounts,  
    }   = req.body;
    const newRecipe = new Recipe({ 
        title, 
        ingredientsId, 
        ingredientsAmounts, 
    });
    newRecipe.user = req.user.id;
    try {
        await newRecipe.save()
        req.flash('success_msg', 'Recipe Added Successfully')
        res.redirect('/recipes');
    } catch (err) {
        console.log(err)
        req.flash('error_msg', 'Please fill in the form correctly');
        res.redirect('/recipes/add');
    }           
};

recipesCtrl.renderRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({user: req.user.id}).sort({createdAt: 'desc'}).lean();
        res.render('recipes/allRecipes', { recipes });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
};

recipesCtrl.renderRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).lean();
        const ingredients = await Ingredient.find({user: req.user.id}).sort({createdAt: 'desc'}).lean();
        const newRecipe = new Array(recipe);
        for (let i = 0; i < ingredients.length; i++) {
            ingredients[i].amount = newRecipe[0].ingredientsAmounts[i];
        }
        for (let i = 0; i < ingredients.length; i++) {
            if(ingredients[i].amount === undefined) {
                ingredients.splice([i], [i]);
            }
        }
        const totals = { ...ingredients[0] };
        totals.calorias = 0;
        totals.hdecarbono = 0;
        totals.grasa = 0;
        totals.proteina = 0;
        for (let i = 0; i < ingredients.length; i++) {
            totals.calorias += (ingredients[i].calorias * ingredients[i].amount) / 100;
            totals.hdecarbono += (ingredients[i].hdecarbono * ingredients[i].amount) / 100;
            totals.grasa += (ingredients[i].grasa * ingredients[i].amount) / 100;
            totals.proteina += (ingredients[i].proteina * ingredients[i].amount) / 100;
        }
        res.render('recipes/recipe', { ingredients, totals })
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
};

recipesCtrl.renderEditForm = async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id).lean();
        if( ingredient.user != req.user.id ) {
            req.flash('error_msg', 'Oops! you are not authorized to access here');
            return res.redirect('/ingredients');
        }
        res.render('recipes/editRecipes', { ingredient });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
};

recipesCtrl.updateRecipe = async (req, res) => {
    const { 
        title, 
        tipo, 
        calorias, 
        hdecarbono, 
        grasa, 
        proteina
    } = req.body;
    try {
        await Ingredient.findByIdAndUpdate(req.params.id, { 
            title, 
            tipo, 
            calorias, 
            hdecarbono, 
            grasa, 
            proteina 
        }).lean();
        req.flash('success_msg', 'Ingredient Updated Successfully');
        res.redirect('/recipes');
    } catch(err) {
        console.log(err)
        req.flash('error_msg', 'Please fill in the form correctly');
        res.redirect('/recipes/add');
    }
};

recipesCtrl.deleteRecipe = async (req, res) => {
    try {
        await Ingredient.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Ingredient Deleted Successfully')
        res.redirect('/recipes');
    } catch(err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
};

module.exports = recipesCtrl;

