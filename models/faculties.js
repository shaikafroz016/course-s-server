const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var facultySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default:false      
    }
}, {
    timestamps: true
});
var Faculties = mongoose.model('Faculty', facultySchema);

module.exports = Faculties;