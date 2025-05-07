if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require('express');
const connection = require('./connection');

const listingRouter = require('./routes/listing');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');


const Listing = require('./models/Listing.js')
const path = require('path')
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const app = express();
const wrapAsync = require('./utils/wrapAsync.js')

const session = require('express-session')
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');
const ExpressError = require('./utils/EexressError.js')

const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require("./models/User.js")

connection();

app.use(methodOverride("_method"))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.engine('ejs', ejsmate);


const store = MongoStore.create({
    mongoUrl : process.env.ATLASDB_URL,
    crypto : {
        secret :  process.env.SECRET,
    },
    touchAfter : 24*3600, //in seconds
})

store.on("error",()=>{
    console.log("Error in mongo store ", err)
})

const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,

    cookie :{
        expires : Date.now() + 7 *24 * 60*60*1000,
        maxAge : 7 *24 * 60*60*1000,
        httpOnly : true
    }
}







//ORDER OF THE FOLLOWING FOUR SHOULD BE AS FOLLOWS :-

// session middleware
app.use(session(sessionOption));

// flash middleware
app.use(flash());

// passport init
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

// locals middleware (after flash)
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});



//ROUTES ARE HERE

//LIstings
app.use("/listings", listingRouter);
//REVIEWS
app.use("/listings/:id/reviews",reviewRouter); //here parent route has also parameters (params). to use this params
                                         //we need "const router = express.Router({mergeParams: true}); " in the 
                                         // review route to access the params of parent .
//User
app.use("/", userRouter);

//Main
app.get('/', wrapAsync(async (req, res, next) => {
    res.redirect('/listings');
}))








//Unmatched Routes

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

//Error Handler : Middleware
app.use((err, req, res, next) => {

    let { statusCode = 500, message = 'something went wrong !' } = err;
    res.status(400).render('error.ejs', { err })
    // res.status(statusCode).send(message);
})

app.listen('8080', (err) => {
    if (err) {
        console.log(err.message);

    } else {
        console.log("Server is running on port 8080")
    }
})