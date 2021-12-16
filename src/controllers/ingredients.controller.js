const ingredientsCtrl     = {};
const Ingredient          = require('../models/Ingredient');

ingredientsCtrl.renderIngredientForm = (req, res) => {
    res.render('ingredients/newIngredient');
};

ingredientsCtrl.createIngredient = async (req, res) => {
    const { title, 
            tipo, 
            FORRAJE_PORC,
            DM_PORC,
            CP_PORC,
            SP_CP_PORC,
            ADICP_CP_PORC,
            Sugars_DM_PORC,
            RDP_PORC_MS,
            FAT_PORC,
            ASH_PORC,
            NFC,
            ST_PORC,
            NDF_PORC,
            ADF_PORC,
            Lignin_DM_PORC,
            TDN_DM_PORC,
            ME_Mcal_kg,
            NEma_Mcal_kg,
            NEl_Mcal_kg,
            NEg_Mcal_kg,
            RUP_CP_PORC,
            kd_PB_h_PORC,
            kd_CB1_h_PORC,
            kd_CB2_h_PORC,
            kd_CB3_h_PORC,
            PBID_PORC,
            CB1ID_PORC,
            CB2ID_PORC,
            pef_NDF_PORC,
            ARG_DM_PORC,
            HIS_DM_PORC,
            ILE_DM_PORC,
            LEU_DM_PORC,
            LYS_DM_PORC,
            MET_DM_PORC,
            CYS_DM_PORC,
            PHE_DM_PORC,
            TYR_DM_PORC,
            THR_DM_PORC,
            TRP_DM_PORC,
            VAL_DM_PORC,
            Ca_PORC_DM,
            P_PORC_DM,
            Mg_DM_PORC,
            Cl_DM_PORC,
            K_DM_PORC,
            Na_DM_PORC,
            S_DM_PORC,
            Co_mg_kg,
            Cu_mg_kg,
            I_mg_kg,
            Fe_mg_kg,
            Mn_mg_kg,
            Se_mg_kg,
            Zn_mg_kg,
            VitA_IU_g,
            VitD_IU_g,
            VitE_IU_kg,
            Cr_mg_kg,
            PUBLIC
    }   = req.body;
    const newIngredient = new Ingredient({ 
        title, 
            tipo, 
            FORRAJE_PORC,
            DM_PORC,
            CP_PORC,
            SP_CP_PORC,
            ADICP_CP_PORC,
            Sugars_DM_PORC,
            RDP_PORC_MS,
            FAT_PORC,
            ASH_PORC,
            NFC,
            ST_PORC,
            NDF_PORC,
            ADF_PORC,
            Lignin_DM_PORC,
            TDN_DM_PORC,
            ME_Mcal_kg,
            NEma_Mcal_kg,
            NEl_Mcal_kg,
            NEg_Mcal_kg,
            RUP_CP_PORC,
            kd_PB_h_PORC,
            kd_CB1_h_PORC,
            kd_CB2_h_PORC,
            kd_CB3_h_PORC,
            PBID_PORC,
            CB1ID_PORC,
            CB2ID_PORC,
            pef_NDF_PORC,
            ARG_DM_PORC,
            HIS_DM_PORC,
            ILE_DM_PORC,
            LEU_DM_PORC,
            LYS_DM_PORC,
            MET_DM_PORC,
            CYS_DM_PORC,
            PHE_DM_PORC,
            TYR_DM_PORC,
            THR_DM_PORC,
            TRP_DM_PORC,
            VAL_DM_PORC,
            Ca_PORC_DM,
            P_PORC_DM,
            Mg_DM_PORC,
            Cl_DM_PORC,
            K_DM_PORC,
            Na_DM_PORC,
            S_DM_PORC,
            Co_mg_kg,
            Cu_mg_kg,
            I_mg_kg,
            Fe_mg_kg,
            Mn_mg_kg,
            Se_mg_kg,
            Zn_mg_kg,
            VitA_IU_g,
            VitD_IU_g,
            VitE_IU_kg,
            Cr_mg_kg,
            PUBLIC
    });
    newIngredient.user = req.user.id;
    try {
        await newIngredient.save()
        req.flash('success_msg', 'Ingredient Added Successfully')
        res.redirect('/ingredients/1');
    } catch (err) {
        console.log(err)
        req.flash('error_msg', 'Please fill in the form correctly');
        res.redirect('/ingredients/add');
    }           
};

function isNum(val){
    return !isNaN(val)
}

ingredientsCtrl.renderIngredients = async (req, res) => {
    console.log('hola1');
    try {
        console.log('hola2');
        if(isNum(req.params.id)){
            const publicingredients = await Ingredient.find({PUBLIC: true}).lean();
            const privateIngredients = await Ingredient.find({USER: req.user.id}).lean();
            const ingredients = publicingredients.concat(privateIngredients);
        const idReq = parseInt(req.params.id) - 1;
        const separatedIngredients = [];
        const arrsLong = 50;
        var arrs = 0;
    console.log('hola3');
        for (let i = 0; i < ingredients.length; i += arrsLong) {
            let slice = ingredients.slice(i, i + arrsLong);
            separatedIngredients.push(slice);
            arrs += 1;
        }
        console.log('hola4');
        for (let j = 0; j < arrs; j ++) {
            console.log(idReq, j);
            if (idReq === j){
    console.log('hola5');
                const ingredientspage = JSON.parse(JSON.stringify(separatedIngredients[j]));
    console.log('hola6');

                console.log(typeof ingredientspage);
                // Check if is the firstPage
                const prevPage = j;
                const nextPage = j + 2;
            console.log('hola7');

                if (idReq === 0) { 
                    res.render('ingredients/allIngredients', { 
                        ingredientspage,
                        isFirst: true,
                        nextPage
                    }) // Check if is the last page
                } else if (idReq === (arrs - 1)) {
                    console.log(ingredientspage);
                    res.render('ingredients/allIngredients', { 
                        ingredientspage,
                        isLast: true, 
                        prevPage
                    })
                } else {
                    res.render('ingredients/allIngredients', { 
                        ingredientspage,
                        isMiddle: true,
                        prevPage,
                        nextPage
                    });
                }
            }
        }
        } else{
            req.flash('error_msg', 'Invalid Url request');
            res.redirect('/ingredients/1');
        }
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
};

ingredientsCtrl.renderIngredient = async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id).lean();
        res.render('ingredients/ingredient', { ingredient })
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
};

ingredientsCtrl.renderEditForm = async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id).lean();
        if( ingredient.USER != req.user.id ) {
            req.flash('error_msg', 'Oops! you are not authorized to access here');
            return res.redirect('/ingredients');
        }
        res.render('ingredients/editIngredient', { ingredient });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
};

ingredientsCtrl.updateIngredient = async (req, res) => {
    const { 
        title, 
            tipo, 
            FORRAJE_PORC,
            DM_PORC,
            CP_PORC,
            SP_CP_PORC,
            ADICP_CP_PORC,
            Sugars_DM_PORC,
            RDP_PORC_MS,
            FAT_PORC,
            ASH_PORC,
            NFC,
            ST_PORC,
            NDF_PORC,
            ADF_PORC,
            Lignin_DM_PORC,
            TDN_DM_PORC,
            ME_Mcal_kg,
            NEma_Mcal_kg,
            NEl_Mcal_kg,
            NEg_Mcal_kg,
            RUP_CP_PORC,
            kd_PB_h_PORC,
            kd_CB1_h_PORC,
            kd_CB2_h_PORC,
            kd_CB3_h_PORC,
            PBID_PORC,
            CB1ID_PORC,
            CB2ID_PORC,
            pef_NDF_PORC,
            ARG_DM_PORC,
            HIS_DM_PORC,
            ILE_DM_PORC,
            LEU_DM_PORC,
            LYS_DM_PORC,
            MET_DM_PORC,
            CYS_DM_PORC,
            PHE_DM_PORC,
            TYR_DM_PORC,
            THR_DM_PORC,
            TRP_DM_PORC,
            VAL_DM_PORC,
            Ca_PORC_DM,
            P_PORC_DM,
            Mg_DM_PORC,
            Cl_DM_PORC,
            K_DM_PORC,
            Na_DM_PORC,
            S_DM_PORC,
            Co_mg_kg,
            Cu_mg_kg,
            I_mg_kg,
            Fe_mg_kg,
            Mn_mg_kg,
            Se_mg_kg,
            Zn_mg_kg,
            VitA_IU_g,
            VitD_IU_g,
            VitE_IU_kg,
            Cr_mg_kg,
            PUBLIC
    } = req.body;
    try {
        await Ingredient.findByIdAndUpdate(req.params.id, { 
            title, 
            tipo, 
            FORRAJE_PORC,
            DM_PORC,
            CP_PORC,
            SP_CP_PORC,
            ADICP_CP_PORC,
            Sugars_DM_PORC,
            RDP_PORC_MS,
            FAT_PORC,
            ASH_PORC,
            NFC,
            ST_PORC,
            NDF_PORC,
            ADF_PORC,
            Lignin_DM_PORC,
            TDN_DM_PORC,
            ME_Mcal_kg,
            NEma_Mcal_kg,
            NEl_Mcal_kg,
            NEg_Mcal_kg,
            RUP_CP_PORC,
            kd_PB_h_PORC,
            kd_CB1_h_PORC,
            kd_CB2_h_PORC,
            kd_CB3_h_PORC,
            PBID_PORC,
            CB1ID_PORC,
            CB2ID_PORC,
            pef_NDF_PORC,
            ARG_DM_PORC,
            HIS_DM_PORC,
            ILE_DM_PORC,
            LEU_DM_PORC,
            LYS_DM_PORC,
            MET_DM_PORC,
            CYS_DM_PORC,
            PHE_DM_PORC,
            TYR_DM_PORC,
            THR_DM_PORC,
            TRP_DM_PORC,
            VAL_DM_PORC,
            Ca_PORC_DM,
            P_PORC_DM,
            Mg_DM_PORC,
            Cl_DM_PORC,
            K_DM_PORC,
            Na_DM_PORC,
            S_DM_PORC,
            Co_mg_kg,
            Cu_mg_kg,
            I_mg_kg,
            Fe_mg_kg,
            Mn_mg_kg,
            Se_mg_kg,
            Zn_mg_kg,
            VitA_IU_g,
            VitD_IU_g,
            VitE_IU_kg,
            Cr_mg_kg,
            PUBLIC
        }).lean();
        req.flash('success_msg', 'Ingredient Updated Successfully');
        res.redirect('/ingredients/1');
    } catch(err) {
        console.log(err)
        req.flash('error_msg', 'Please fill in the form correctly');
        res.redirect('/ingredients/add');
    }
};

ingredientsCtrl.deleteIngredient = async (req, res) => {
    try {
        await Ingredient.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Ingredient Deleted Successfully')
        res.redirect('/ingredients/1');
    } catch(err) {
        console.log(err);
        req.flash('error_msg', 'Oops! Something went wrong, try again later');
        res.redirect('/');
    }
};

module.exports = ingredientsCtrl;
