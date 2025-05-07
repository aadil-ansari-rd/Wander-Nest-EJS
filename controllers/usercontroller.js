const User = require("../models/User");

const renderSignupForm = (req, res) => {
    res.render('users/signup.ejs')
}


const signup = async (req, res) => {
    try {
        let { name, username, email, password } = req.body;
        const newUser = User({ name, email, username });
        const registeredUserr = await User.register(newUser, password);
        req.login(registeredUserr, (err) => {
            if (err) {
                return next(err);

            }
            req.flash("success", "Welcome to Wanser Nest");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
    }

}


const renderLoginForm = (req, res) => {
    res.render('users/login.ejs')
}

const login = async (req, res) => {
    req.flash("success", "Welcome to Wander Nest! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

const logout =  (req, res, next) => { //This function should not be in wrapAsync
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You  have  been  logged  out.");
        res.redirect("/listings");
    })

}

module.exports = {
    signup,
    renderSignupForm,
    renderLoginForm,
    login,
    logout


}