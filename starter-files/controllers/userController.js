// imports mongoose methods
const mongoose = require('mongoose');
//imports user Schema reference to model
const User = mongoose.model('User');
// promisify not promisable functions
const promisify = require('es6-promisify');


// render loginForm pug file
exports.loginForm = (req, res) => {
    res.render('login');
};
// render register pug file
exports.registerForm = (req, res) => {
// FIXME: set it up so if user is logged in home page is vote creator

res.render('register');
};



// validate data passed by client from register form to database
exports.validateRegister = (req, res, next) => {
    // name is lowercased?
    req.sanitizeBody('name');
    // checkBody refers to for elements (name or element, message).metodToCall.canBeChained
    //make sure data exists and is normilized
    req.checkBody('email', 'Needs to be an Email').isEmail();
    req.checkBody('name', 'name is empty').notEmpty();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    //makes sure data exists- confirms both fields are the same
    req.checkBody('password', 'password can not be empty').notEmpty();
    req.checkBody('password-confirm', 'Confirm password cannot be blank').notEmpty();
    // equals to makes sure both fields are the same
    req.checkBody('password-confirm', 'Passwords must match').equals(req.body.password);
    // store validation errors in var
    const errors = req.validationErrors();

    //if error exists -> flash every error on errors object
    if (errors) {
        console.log(req.body);
        req.flash('error', errors.map(err => err.msg));
        // render page again with information written intact
        res.render('register', {
            title: "Register",
            body: req.body,
            flashes: req.flash()
        });
        //extra credit! highlight error fields!
        return;
    };
    // run next method in index.js file
    next();
};

// save new user after he is created
//req.body.(name of input on register.pug's form input)
exports.saveRegister = async(req, res, next) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    });
    //User is schema/ user is actual instance created

    //Create password Hash

    //non promise method 
    // User.register(user, req.body.password, function(){})

    //Using promisify
    // promisify(Schema.method, Schema)
    const register = promisify(User.register, User);
    await register(user, req.body.password);

    // res.send('works');

    next(); //pass to authController.login


};
//User - Edit account GET
exports.account = (req, res) => {
    res.render('account', { title: 'edit account' })
}

//User - Edit Account POST
exports.editAccount = async(req, res) => {

    const updates = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findOneAndUpdate({ _id: req.user._id }, { $set: updates }, { new: true, runValidators: true, context: 'query' })
    req.flash('success', 'you have successfully updated your account')
    res.redirect('back');
};