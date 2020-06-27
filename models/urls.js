const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var urlSchema = new Schema({
    url:  {
        type: String,
        required: true
    },
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
}, );

var Urls = mongoose.model('Url', urlSchema);

module.exports = Urls;