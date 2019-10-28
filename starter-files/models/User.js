const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');


// create new users given email address and name
//detail type of data to be entered and other options avaible to mongodb schema
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please supply email address'
    },

    name: {
        type: String,
        required: 'pleae supply name',
        trim: true
    },

});


//denot that email will be what user will use as username for website and not a unique username.

//exposes to us a method called .register take care of lowerlevel registration
// refer to userController.js

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);
//the model is exported as 'User' -> typically goes towards controller.js file that needs it
module.exports = mongoose.model('User', userSchema);