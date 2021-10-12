const recipesCtrl       = {};
const Recipe            = require('../models/Recipe');
const Ingredient        = require('../models/Ingredient');


recipesCtrl.renderRecipeForm = async (req, res) => {
    try {
        const publicingredients = await Ingredient.find({PUBLIC: true}).lean();
        const privateIngredients = await Ingredient.find({USER: req.user.id}).lean();
        const ingredients = publicingredients.concat(privateIngredients);
        res.render('recipes/newRecipe', { ingredients });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
}
recipesCtrl.selectIngredients = async (req, res) => {
    const { 
        title, 
        ingredientsId
    } = req.body;
    const newRecipe = new Recipe({ 
        title, 
        ingredientsId 
    });
    newRecipe.user = req.user.id;
    try {
        await newRecipe.save();
        req.flash('success_msg', 'Recipe Added Successfully');
        res.redirect(`/recipes/continueRecipe/${newRecipe._id}`);
    } catch (err) {
        console.log(err)
        req.flash('error_msg', 'Please fill in the form correctly');
        res.redirect('/recipes/add');
    }           
}

recipesCtrl.continueRecipe = async (req, res) => {
    try{
        const recipe = await Recipe.findById(req.params.id);
        if( ingredient.user != req.user.id ) {
            req.flash('error_msg', 'Oops! you are not authorized to access here');
            return res.redirect('/ingredients');
        } else {
            const ingredients = [ ...recipe.ingredientsId ];
            const names = [];
            for(let i = 0; i <ingredients.length; i++) {
                var ingredient = await Ingredient.findById(ingredients[i]);
                names.push(ingredient.title);
            }
            const id = req.params.id;
            res.render('recipes/continueRecipe', { id, names });   
        }
    } catch(err){
        console.log(err);
        res.redirect('/');
        req.flash('error_msg', 'Oops something went wrong, try again later');
    }          
}

recipesCtrl.createRecipe = async (req, res) => {
    const { ingredientsAmounts } = req.body;
    try {
        await Recipe.findByIdAndUpdate(req.params.id, {ingredientsAmounts}).lean();
        req.flash('success_msg', 'Recipe Created Successfully');
        res.redirect('/recipes');  
    } catch(err) {
        console.log(err);
        res.redirect('/');
        req.flash('error_msg', 'Oops something went wrong');
    }
}

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

//! corregir esta funcion

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
        const recipe = await Recipe.findById(req.params.id).lean();
        if( recipe.user != req.user.id ) {
            req.flash('error_msg', 'Oops! you are not authorized to access here');
            return res.redirect('/recipes');
        } else {
            const ingredientsInRecipe = [ ...recipe.ingredientsId ];
            const publicingredients = await Ingredient.find({PUBLIC: true}).lean();
            const privateIngredients = await Ingredient.find({USER: req.user.id}).lean();
            var ingredients = publicingredients.concat(privateIngredients);
            for (let i = 0; i < ingredients.length; i++) {
                for (let j = 0; j < ingredientsInRecipe.length; j++) {
                    if (ingredients[i]._id == ingredientsInRecipe[j]) {
                        ingredients[i].selected = true;
                    }
                }
            }
            res.render('recipes/editRecipe', {recipe, ingredients});
        }
    } catch (err) {
        res.redirect('/');
        req.flash('error_msg', 'Oops something went wrong, try again later');
    }
};

recipesCtrl.updateRecipe = async (req, res) => {
    const { title, 
        ingredientsId
} = req.body;
try {
    await Recipe.findByIdAndUpdate(req.params.id, { 
        title,
        ingredientsId
    }).lean();
    req.flash('success_msg', 'Please continue updating your recipe');
    res.redirect(`/recipes/editContinue/${req.params.id}`);
} catch(err) {
    console.log(err)
    req.flash('error_msg', 'Please fill in the form correctly');
    res.redirect('/recipes/add');
}
};
recipesCtrl.continueUpdateRecipeForm = async (req, res) => {
    try{
        const recipe = await Recipe.findById(req.params.id);
        if( recipe.user != req.user.id ) {
            req.flash('error_msg', 'Oops! you are not authorized to access here');
            return res.redirect('/recipes');
        } else {
            console.log('aaa');
            const ingredients = [ ...recipe.ingredientsId ];
            const names = [];
            for(let i = 0; i <ingredients.length; i++) {
                var ingredient = await Ingredient.findById(ingredients[i]);
                names.push(ingredient.title);
            }
            const id = req.params.id;
            res.render('recipes/continueEditRecipe', { id, names });   
        }
    } catch(err){
        console.log(err);
        req.flash('error_msg', 'Oops something went wrong, try again later');
        res.redirect('/');
    }
}
recipesCtrl.continueUpdateRecipe = async (req, res) => {
    const { ingredientsAmounts } = req.body;
    console.log(req.params.id)
    try {
        await Recipe.findByIdAndUpdate(req.params.id, {ingredientsAmounts}).lean();
        req.flash('success_msg', 'Recipe Updated Successfully');
        res.redirect('/recipes');  
    } catch(err) {
        res.redirect('/');
        req.flash('error_msg', 'Oops something went wrong');
    }
}

recipesCtrl.deleteRecipe = async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Recipe Deleted Successfully')
        res.redirect('/recipes');
    } catch(err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
};

module.exports = recipesCtrl;

