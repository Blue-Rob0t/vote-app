const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.promise;


const resultSchema = new Schema({
    contact:{
        type:String
    }
})

module.exports = mongoose.model('Result', resultSchema);


//user votes