const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


var urlSchema = new Schema({
    url:  {
        type: String,
        required: true
    },
    title: {
        type:String,
        required:true
    }
});

var courseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    instructor: {
        type: String,
        required: true,
        
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    label: {
        type: String,
        default:''
    },
    price:{
        type: Currency,
        required: false,
        min:0
    },
    featured:{
        type:Boolean,
        default:false
    },
    links:[urlSchema]
}, {
    timestamps: true
});


var Courses = mongoose.model('Course', courseSchema);

module.exports = Courses;