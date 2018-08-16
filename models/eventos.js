const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventosSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    lugar: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    presencial: {
        type: Boolean,
        required: true
    },
    usuario: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Evento', EventosSchema);