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
        if( recipe.user != req.user.id ) {
            req.flash('error_msg', 'Oops! you are not authorized to access here');
            return res.redirect('/recipes');
        } else {
            const ingredientsInRecipe = [ ...recipe.ingredientsId ];
            const ingredients = [];
            const ingredientsobj = {};
            for (let i = 0; i < ingredientsInRecipe.length; i++) {
                ingredients[i] = await Ingredient.findById(ingredientsInRecipe[i]);
            }
            console.log(ingredients);
            for (let j = 0; j < ingredients.length; j++) {
                ingredientsobj.FORRAJE_PORC += ingredients[i].FORRAJE_PORC
                ingredientsobj.DM_PORC += ingredients[i].DM_PORC
                ingredientsobj.CP_PORC += ingredients[i].CP_PORC
                ingredientsobj.SP_CP_PORC += ingredients[i].SP_CP_PORC
                ingredientsobj.ADICP_CP_PORC += ingredients[i].ADICP_CP_PORC
                ingredientsobj.Sugars_DM_PORC += ingredients[i].Sugars_DM_PORC
                ingredientsobj.RDP_PORC_MS += ingredients[i].RDP_PORC_MS
                ingredientsobj.FAT_PORC += ingredients[i].FAT_PORC
                ingredientsobj.ASH_PORC += ingredients[i].ASH_PORC
                ingredientsobj.NFC += ingredients[i].NFC
                ingredientsobj.ST_PORC += ingredients[i].ST_PORC
                ingredientsobj.NDF_PORC += ingredients[i].NDF_PORC
                ingredientsobj.ADF_PORC += ingredients[i].ADF_PORC
                ingredientsobj.Lignin_DM_PORC += ingredients[i].Lignin_DM_PORC
                ingredientsobj.TDN_DM_PORC += ingredients[i].TDN_DM_PORC
                ingredientsobj.ME_Mcal_kg += ingredients[i].ME_Mcal_kg
                ingredientsobj.NEma_Mcal_kg += ingredients[i].NEma_Mcal_kg
                ingredientsobj.NEl_Mcal_kg += ingredients[i].NEl_Mcal_kg
                ingredientsobj.NEg_Mcal_kg += ingredients[i].NEg_Mcal_kg
                ingredientsobj.RUP_CP_PORC += ingredients[i].RUP_CP_PORC
                ingredientsobj.kd_PB_h_PORC += ingredients[i].kd_PB_h_PORC
                ingredientsobj.kd_CB1_h_PORC += ingredients[i].kd_CB1_h_PORC
                ingredientsobj.kd_CB2_h_PORC += ingredients[i].kd_CB2_h_PORC
                ingredientsobj.kd_CB3_h_PORC += ingredients[i].kd_CB3_h_PORC
                ingredientsobj.PBID_PORC += ingredients[i].PBID_PORC
                ingredientsobj.CB1ID_PORC += ingredients[i].CB1ID_PORC
                ingredientsobj.CB2ID_PORC += ingredients[i].CB2ID_PORC
                ingredientsobj.pef_NDF_PORC += ingredients[i].pef_NDF_PORC
                ingredientsobj.ARG_DM_PORC += ingredients[i].ARG_DM_PORC
                ingredientsobj.HIS_DM_PORC += ingredients[i].HIS_DM_PORC
                ingredientsobj.ILE_DM_PORC += ingredients[i].ILE_DM_PORC
                ingredientsobj.LEU_DM_PORC += ingredients[i].LEU_DM_PORC
                ingredientsobj.LYS_DM_PORC += ingredients[i].LYS_DM_PORC
                ingredientsobj.MET_DM_PORC += ingredients[i].MET_DM_PORC
                ingredientsobj.CYS_DM_PORC += ingredients[i].CYS_DM_PORC
                ingredientsobj.PHE_DM_PORC += ingredients[i].PHE_DM_PORC
                ingredientsobj.TYR_DM_PORC += ingredients[i].TYR_DM_PORC
                ingredientsobj.THR_DM_PORC += ingredients[i].THR_DM_PORC
                ingredientsobj.TRP_DM_PORC += ingredients[i].TRP_DM_PORC
                ingredientsobj.VAL_DM_PORC += ingredients[i].VAL_DM_PORC
                ingredientsobj.Ca_PORC_DM += ingredients[i].Ca_PORC_DM
                ingredientsobj.P_PORC_DM += ingredients[i].P_PORC_DM
                ingredientsobj.Mg_DM_PORC += ingredients[i].Mg_DM_PORC
                ingredientsobj.Cl_DM_PORC += ingredients[i].Cl_DM_PORC
                ingredientsobj.K_DM_PORC += ingredients[i].K_DM_PORC
                ingredientsobj.Na_DM_PORC += ingredients[i].Na_DM_PORC
                ingredientsobj.S_DM_PORC += ingredients[i].S_DM_PORC
                ingredientsobj.Co_mg_kg += ingredients[i].Co_mg_kg
                ingredientsobj.Cu_mg_kg += ingredients[i].Cu_mg_kg
                ingredientsobj.I_mg_kg += ingredients[i].I_mg_kg
                ingredientsobj.Fe_mg_kg += ingredients[i].Fe_mg_kg
                ingredientsobj.Mn_mg_kg += ingredients[i].Mn_mg_kg
                ingredientsobj.Se_mg_kg += ingredients[i].Se_mg_kg
                ingredientsobj.Zn_mg_kg += ingredients[i].Zn_mg_kg
                ingredientsobj.VitA_IU_g += ingredients[i].VitA_IU_g
                ingredientsobj.VitD_IU_g += ingredients[i].VitD_IU_g
                ingredientsobj.VitE_IU_kg += ingredients[i].VitE_IU_kg
                ingredientsobj.Cr_mg_kg += ingredients[i].Cr_mg_kg
            }
                ingredientsobj.FORRAJE_PORC = ingredientsobj.FORRAJE_PORC / ingredients.length;
                ingredientsobj.DM_PORC = ingredientsobj.DM_PORC / ingredients.length;
                ingredientsobj.CP_PORC = ingredientsobj.CP_PORC / ingredients.length;
                ingredientsobj.SP_CP_PORC = ingredientsobj.SP_CP_PORC / ingredients.length;
                ingredientsobj.ADICP_CP_PORC = ingredientsobj.ADICP_CP_PORC / ingredients.length;
                ingredientsobj.Sugars_DM_PORC = ingredientsobj.Sugars_DM_PORC / ingredients.length;
                ingredientsobj.RDP_PORC_MS = ingredientsobj.RDP_PORC_MS / ingredients.length;
                ingredientsobj.FAT_PORC = ingredientsobj.FAT_PORC / ingredients.length;
                ingredientsobj.ASH_PORC = ingredientsobj.ASH_PORC / ingredients.length;
                ingredientsobj.NFC = ingredientsobj.NFC / ingredients.length;
                ingredientsobj.ST_PORC = ingredientsobj.ST_PORC / ingredients.length;
                ingredientsobj.NDF_PORC = ingredientsobj.NDF_PORC / ingredients.length;
                ingredientsobj.ADF_PORC = ingredientsobj.ADF_PORC / ingredients.length;
                ingredientsobj.Lignin_DM_PORC = ingredientsobj.Lignin_DM_PORC / ingredients.length;
                ingredientsobj.TDN_DM_PORC = ingredientsobj.TDN_DM_PORC / ingredients.length;
                ingredientsobj.ME_Mcal_kg = ingredientsobj.ME_Mcal_kg / ingredients.length;
                ingredientsobj.NEma_Mcal_kg = ingredientsobj.NEma_Mcal_kg / ingredients.length;
                ingredientsobj.NEl_Mcal_kg = ingredientsobj.NEl_Mcal_kg / ingredients.length;
                ingredientsobj.NEg_Mcal_kg = ingredientsobj.NEg_Mcal_kg / ingredients.length;
                ingredientsobj.RUP_CP_PORC = ingredientsobj.RUP_CP_PORC / ingredients.length;
                ingredientsobj.kd_PB_h_PORC = ingredientsobj.kd_PB_h_PORC / ingredients.length;
                ingredientsobj.kd_CB1_h_PORC = ingredientsobj.kd_CB1_h_PORC / ingredients.length;
                ingredientsobj.kd_CB2_h_PORC = ingredientsobj.kd_CB2_h_PORC / ingredients.length;
                ingredientsobj.kd_CB3_h_PORC = ingredientsobj.kd_CB3_h_PORC / ingredients.length;
                ingredientsobj.PBID_PORC = ingredientsobj.PBID_PORC / ingredients.length;
                ingredientsobj.CB1ID_PORC = ingredientsobj.CB1ID_PORC / ingredients.length;
                ingredientsobj.CB2ID_PORC = ingredientsobj.CB2ID_PORC / ingredients.length;
                ingredientsobj.pef_NDF_PORC = ingredientsobj.pef_NDF_PORC / ingredients.length;
                ingredientsobj.ARG_DM_PORC = ingredientsobj.ARG_DM_PORC / ingredients.length;
                ingredientsobj.HIS_DM_PORC = ingredientsobj.HIS_DM_PORC / ingredients.length;
                ingredientsobj.ILE_DM_PORC = ingredientsobj.ILE_DM_PORC / ingredients.length;
                ingredientsobj.LEU_DM_PORC = ingredientsobj.LEU_DM_PORC / ingredients.length;
                ingredientsobj.LYS_DM_PORC = ingredientsobj.LYS_DM_PORC / ingredients.length;
                ingredientsobj.MET_DM_PORC = ingredientsobj.MET_DM_PORC / ingredients.length;
                ingredientsobj.CYS_DM_PORC = ingredientsobj.CYS_DM_PORC / ingredients.length;
                ingredientsobj.PHE_DM_PORC = ingredientsobj.PHE_DM_PORC / ingredients.length;
                ingredientsobj.TYR_DM_PORC = ingredientsobj.TYR_DM_PORC / ingredients.length;
                ingredientsobj.THR_DM_PORC = ingredientsobj.THR_DM_PORC / ingredients.length;
                ingredientsobj.TRP_DM_PORC = ingredientsobj.TRP_DM_PORC / ingredients.length;
                ingredientsobj.VAL_DM_PORC = ingredientsobj.VAL_DM_PORC / ingredients.length;
                ingredientsobj.Ca_PORC_DM = ingredientsobj.Ca_PORC_DM / ingredients.length;
                ingredientsobj.P_PORC_DM = ingredientsobj.P_PORC_DM / ingredients.length;
                ingredientsobj.Mg_DM_PORC = ingredientsobj.Mg_DM_PORC / ingredients.length;
                ingredientsobj.Cl_DM_PORC = ingredientsobj.Cl_DM_PORC / ingredients.length;
                ingredientsobj.K_DM_PORC = ingredientsobj.K_DM_PORC / ingredients.length;
                ingredientsobj.Na_DM_PORC = ingredientsobj.Na_DM_PORC / ingredients.length;
                ingredientsobj.S_DM_PORC = ingredientsobj.S_DM_PORC / ingredients.length;
                ingredientsobj.Co_mg_kg = ingredientsobj.Co_mg_kg / ingredients.length;
                ingredientsobj.Cu_mg_kg = ingredientsobj.Cu_mg_kg / ingredients.length;
                ingredientsobj.I_mg_kg = ingredientsobj.I_mg_kg / ingredients.length;
                ingredientsobj.Fe_mg_kg = ingredientsobj.Fe_mg_kg / ingredients.length;
                ingredientsobj.Mn_mg_kg = ingredientsobj.Mn_mg_kg / ingredients.length;
                ingredientsobj.Se_mg_kg = ingredientsobj.Se_mg_kg / ingredients.length;
                ingredientsobj.Zn_mg_kg = ingredientsobj.Zn_mg_kg / ingredients.length;
                ingredientsobj.VitA_IU_g = ingredientsobj.VitA_IU_g / ingredients.length;
                ingredientsobj.VitD_IU_g = ingredientsobj.VitD_IU_g / ingredients.length;
                ingredientsobj.VitE_IU_kg = ingredientsobj.VitE_IU_kg / ingredients.length;
                ingredientsobj.Cr_mg_kg = ingredientsobj.Cr_mg_kg / ingredients.length;
                console.log(ingredientsobj);
            res.render('recipes/editRecipe', {recipe, ingredients});
        }
    } catch (err) {
        res.redirect('/');
        req.flash('error_msg', 'Oops something went wrong, try again later');
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

