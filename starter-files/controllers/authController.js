//auto login after user creates account
//authtentticated user privalages 

const passport = require('passport');
const promisify = require('es6-promisify')
const mongoose = require('mongoose');
//imports user Schema reference to model
const User = mongoose.model('User');
//creating tolkien to reseting password
const crypto = require("crypto");
//mail.js functionality to send email to user
const mail = require('../handlers/mail')

// logs user in once credentials pass using passport and local strategy
exports.login = passport.authenticate('local', {
    failiureRedirect: '/login',
    failureFlash: 'failed login',
    successRedirect: '/',
    successFlash: 'you are logged in'
});
// exports.login = passport.authenticate('facebook', options);
// exports.login = passport.authenticate('twitter', options);
// etc etc... 

//logout automatically using passport
exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'you are logged out!');
    res.redirect('/');
};

//only continue if user is logged into service
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next(); //got to next method you are logged in!
        return; //stop.
    }
    req.flash('error', 'please login!');
    res.redirect('/login');
}

//set a token on a user object to track user has forgotten password
exports.forgot = async(req, res) => {

    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        req.flash('error', 'no user exists with that account');
        return res.redirect('/login');
    }
    //set specific user model to this password token
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    //set specific user to this password expiration date
    user.resetPasswordExp = Date.now() + 360000000;

    await user.save();

    //email reset link;
    const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    console.log(resetUrl)

    //send mail - mail.js

    await mail.send({
        user,
        subject: '',
        resetUrl: resetUrl,
        filename: 'password-reset'

    })


    req.flash('success', `email was sent to ${user.email}`);
    //redirect to login page

    res.redirect('/login');
};

exports.reset = async(req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExp: {
            $gt: Date.now()
        }
    })
    if (!user) {
        req.flash('error', 'password expired or user doesn\'t exist')
        return res.redirect('/login')
    }

    res.render("reset", {
        title: 'reset your password'
    })

    console.log(user);
}

exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body['confirmed-password']) {
        return next();
    };

    req.flash('error', 'passwords do not match')
    res.redirect('back')

};

exports.update = async(req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExp: {
            $gt: Date.now()
        }
    });

    if (!user) {
        req.flash('error', 'Password reset is invald... please request a new one')
        res.redirect('/login')
    }

    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExp = undefined;

    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'password has been changed')
    res.redirect('/')
}