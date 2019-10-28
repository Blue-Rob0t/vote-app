//configure passport for use in authController.js
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(User.createStrategy());

//everytime req what should I do with user?
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())