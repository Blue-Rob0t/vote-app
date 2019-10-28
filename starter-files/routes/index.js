const express = require('express');
const router = express.Router();

//controllers
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const voteController = require('../controllers/voteController');

/*what is catchErrors*/
const { catchErrors } = require('../handlers/errorHandlers');

//Register

router.get('/',
    voteController.showAllPolls
)

router.get('/register',
    userController.registerForm);

// Do work here
router.get('/login',
    userController.loginForm);
router.post('/login',
    authController.login
);

//vote

router.get('/poll', 
    authController.isLoggedIn,
    voteController.poll,
   

);

router.post('/poll',
    catchErrors(voteController.savePoll),
     //create link to view voting form    
     //expose data to voting form
     //create view for voting form

);


router.get('/poll/:id/link',
    voteController.showLink
);

router.get('/poll/:id/vote',
    catchErrors(
    voteController.showVote
    )
)

router.post('/poll/:id/vote',
    catchErrors(
    voteController.voteData
        
    )
)
 

router.get('/poll/:id/graph',
    catchErrors(voteController.graph),
    voteController.barGraph
);


// =============================================================================
// USER AND AUTH
// =============================================================================

//User - Logout
router.get('/logout',
    authController.logout
);

//User - Register
router.get('/register',
    userController.registerForm);
//User - Registered
router.post('/register',
    userController.validateRegister,
    userController.saveRegister,
    authController.login
);

//User -Edit account
router.get('/account',
        authController.isLoggedIn,
        userController.account
    )
    //User -Edit Account - Post
router.post('/account', catchErrors(userController.editAccount))
    //supplies reset link
router.post('/account/forgot', catchErrors(authController.forgot))
    //get reet page if token from email is valid
router.get('/account/reset/:token', catchErrors(authController.reset))
    //allows password to be changed
router.post('/account/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.update))


module.exports = router;


//post
//login