const {Schema, model}   = require('mongoose');

const IngredientSchema = new Schema({
    ID: {
        type: Number,
    },
    title: {
        type: String,
        required: true
    },
    PUBLIC: {
        type: Boolean,
        required: true,
        default: true,
    },
    USER: {
        type: String
    },
    tipo: {
        type: String,
        required: true
    }, 
    FORRAJE_PORC: {
        type: Number,
    },
    DM_PORC: {
        type: Number,
    },
    CP_PORC: {
        type: Number,
    },
    SP_CP_PORC: {
        type: Number,
    },
    ADICP_CP_PORC: {
        type: Number,
    },
    Sugars_DM_PORC: {
        type: Number,
    },
    RDP_PORC_MS: {
        type: Number,
    },
    FAT_PORC: {
        type: Number,
    },
    ASH_PORC: {
        type: Number,
    },
    NFC: {
        type: Number,
    },
    ST_PORC: {
        type: Number,
    },
    NDF_PORC: {
        type: Number,
    },
    ADF_PORC: {
        type: Number,
    },
    Lignin_DM_PORC: {
        type: Number,
    },
    TDN_DM_PORC: {
        type: Number,
    },
    ME_Mcal_kg: {
        type: Number,
    },
    NEma_Mcal_kg: {
        type: Number,
    },
    NEl_Mcal_kg: {
        type: Number,
    },
    NEg_Mcal_kg: {
        type: Number,
    },
    RUP_CP_PORC: {
        type: Number,
    },
    kd_PB_h_PORC: {
        type: Number,
    },
    kd_CB1_h_PORC: {
        type: Number,
    },
    kd_CB2_h_PORC: {
        type: Number,
    },
    PBID_PORC: {
        type: Number,
    },
    CB1ID_PORC: {
        type: Number,
    },
    CB2ID_PORC: {
        type: Number,
    },
    pef_NDF_PORC: {
        type: Number,
    },
    ARG_DM_PORC: {
        type: Number,
    },
    HIS_DM_PORC: {
        type: Number,
    },
    ILE_DM_PORC: {
        type: Number,
    },
    LEU_DM_PORC: {
        type: Number,
    },
    LYS_DM_PORC: {
        type: Number,
    },
    MET_DM_PORC: {
        type: Number,
    },
    CYS_DM_PORC: {
        type: Number,
    },
    PHE_DM_PORC: {
        type: Number,
    },
    TYR_DM_PORC: {
        type: Number,
    },
    THR_DM_PORC: {
        type: Number,
    },
    TRP_DM_PORC: {
        type: Number,
    },
    VAL_DM_PORC: {
        type: Number,
    },
    Ca_PORC_DM: {
        type: Number,
    },
    P_PORC_DM: {
        type: Number,
    },
    Mg_DM_PORC: {
        type: Number,
    },
    Cl_DM_PORC: {
        type: Number,
    },
    K_DM_PORC: {
        type: Number,
    },
    Na_DM_PORC: {
        type: Number,
    },
    S_DM_PORC: {
        type: Number,
    },
    Co_mg_kg: {
        type: Number,
    },
    Cu_mg_kg: {
        type: Number,
    },
    I_mg_kg: {
        type: Number,
    },
    Fe_mg_kg: {
        type: Number,
    },
    Mn_mg_kg: {
        type: Number,
    },
    Se_mg_kg: {
        type: Number,
    },
    Zn_mg_kg: {
        type: Number,
    },
    VitA_IU_g: {
        type: Number,
    },
    VitD_IU_g: {
        type: Number,
    },
    VitE_IU_kg: {
        type: Number,
    },
    Cr_mg_kg: {
        type: Number,
    },
});

module.exports = model('Ingredient', IngredientSchema, 'ingredients');

