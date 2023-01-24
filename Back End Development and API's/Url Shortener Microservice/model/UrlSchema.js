const mongoose = require('mongoose');
const {Schema} =  mongoose;

const urlSchema = new Schema({

    long_url: { type: String, required: true },
    short_url: {type: String, unique:true}

});

var Url = mongoose.model('url', urlSchema);


module.exports = Url;
