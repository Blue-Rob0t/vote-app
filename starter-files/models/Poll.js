const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


const pollSchema = new Schema({
    //name of poll
    //poll options dynamically added
    //validations and requirements 

    name: {
        type: String,
        required: 'Please enter name of your poll'
    },
    options: {
        type: [String],
        required: 'Please supply option',
    },

    choice: {
        type: [String]
    },

    data:{
        type: [String]
    }



});
/** FIXME:
 * 
 * get poll nubmers doesn't work correctly
 * create new aggregation plan
 */

//  schema: [💻] Schema {
//          [💻] obj: [💻] {
//              name: [Object],
//              [💻] options: [Object],
//              [💻] choice: [Object],
//              [💻] data: [Object]
//          }, [💻] paths: [💻] {
//              name: [Object],
//              [💻] options: [Object],
//              [💻] choice: [Object],
//              [💻] data: [Object],
//              [💻] _id: [Object],
//              [💻] __v: [Object]
//          },


const ObjectId = mongoose.Types.ObjectId;

pollSchema.statics.getPollNumbers = function (x) {

   return this.aggregate([
       {$unwind:"$choice"},
       {
           $match: {
               _id: ObjectId(x)
           }      
       },
       {$group:{_id:"$choice", count:{$sum:1}}}

    //    {$group: {_id: "$_id", }},
       

   ])
};

module.exports = mongoose.model('Poll', pollSchema);

/**
 * unwind
 * groupt by id
 * 
 * 
 */



/**
 * TODO:
 *    change schema to hold votes
 */


 