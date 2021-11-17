const {Schema, model} = require('mongoose');

const AnimalSchema = new Schema({
    tipoGanado: {
        type: String,
        required: true
    }, // ganado lechero o ganado de engorda
    tipoAnimal: {
        type: String,
        required: true
    }, //pastoreo o confinado
    edadMeses: {
        type: Number,
        required: true
    },
    pesoVivo: { 
        type: Number, 
        required: true 
    },
    user: {
        type: String,
        required: true
    },
    // Para ganado Lechero
    prodLeche: { 
        type: Number
        // litros
    },
    prodObjetivoLech: { 
        type: Number
        // litros
    },
    loteProd: { 
        type: String
        // fecha?
    },
    // ganado lechero, de pastoreo
    noLactancia: { 
        type: String
        // 1, 2, 3, o mayor a 3
    },
    distOrde: { 
        type: Number
    },
    // ganado de engorda
    raza: { 
        type: String
        //europeo, indico o mixto
    },
    prodObjetivoEngo: { 
        type: String
        //CREEP FEEDING (LACTANCIA)
        //DESARROLLO (150 -250 KG)
        //CRECIMIENTO (250-350 KG)
        //ENGORDA (350-450)
        //FINALIZACIÓN (450-MERCADO)
    },
    diets: { 
        type: Array,
        default: []
    }
},{
    timestamps: true
})

module.exports = model('Animal', AnimalSchema, 'animals');