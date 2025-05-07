const express = require('express')
const router = express.Router()
const User = require("../models/User.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport')
const {saveRedirectUrl}= require('../middleware.js')
const usercontroller = require("../controllers/usercontroller.js")



//Signup

router.route("/signup")
.get( usercontroller.renderSignupForm)
.post(wrapAsync(usercontroller.signup));



//Login

router.route("/login")
.get( usercontroller.renderLoginForm)
.post(saveRedirectUrl , passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), wrapAsync(usercontroller.login));


//Log out

router.get('/logout',usercontroller.logout);












// //Signup

// router.get('/signup', usercontroller.renderSignupForm)
// router.post("/signup", wrapAsync(usercontroller.signup))


// //Login


// router.get('/login', usercontroller.renderLoginForm)
// router.post("/login", saveRedirectUrl , passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true
// }), wrapAsync(usercontroller.login))


// //Log out

// router.get('/logout',usercontroller.logout);


module.exports = router;