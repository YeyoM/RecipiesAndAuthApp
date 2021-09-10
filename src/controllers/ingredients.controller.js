const ingredientsCtrl     = {};
const Ingredient          = require('../models/Ingredient');

ingredientsCtrl.renderIngredientForm = (req, res) => {
    res.render('ingredients/newIngredient');
}

ingredientsCtrl.createIngredient = async (req, res) => {
    const { title, 
            tipo, 
            calorias, 
            hdecarbono, 
            grasa, 
            proteina
    }   = req.body;
    const newIngredient = new Ingredient({ 
        title, 
        tipo, 
        calorias, 
        hdecarbono, 
        grasa, 
        proteina
    });
    newIngredient.user = req.user.id;
    try {
        await newIngredient.save()
        req.flash('success_msg', 'Ingredient Added Successfully')
        res.redirect('/ingredients');
    } catch (err) {
        console.log(err)
        req.flash('error_msg', 'Please fill in the form correctly');
        res.redirect('/ingredients/add');
    }           
}

ingredientsCtrl.renderIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find({user: req.user.id}).sort({createdAt: 'desc'}).lean();
        res.render('ingredients/allIngredients', { ingredients });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
}

ingredientsCtrl.renderIngredient = async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id).lean();
        res.render('ingredients/ingredient', { ingredient})
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
}

ingredientsCtrl.renderEditForm = async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id).lean();
        if( ingredient.user != req.user.id ) {
            req.flash('error_msg', 'Oops! you are not authorized to access here');
            return res.redirect('/ingredients');
        }
        res.render('ingredients/editIngredient', { ingredient });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
    
}

ingredientsCtrl.updateIngredient = async (req, res) => {
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
        res.redirect('/ingredients');
    } catch(err) {
        console.log(err)
        req.flash('error_msg', 'Please fill in the form correctly');
        res.redirect('/ingredients/add');
    }
}

ingredientsCtrl.deleteIngredient = async (req, res) => {
    try {
        await Ingredient.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Ingredient Deleted Successfully')
        res.redirect('/ingredients');
    } catch(err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
    
}

module.exports = ingredientsCtrl;
