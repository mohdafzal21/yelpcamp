var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var app = express();

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");


//seedDB(); // seed the databse
mongoose.connect("mongodb://localhost/yelp_camp", { useMongoClient: true });

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))

// Passport Congfiguration
app.use(require("express-session")({
   secret: " time to auth",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req,res,next){
    res.locals.currentUser = req.user;
    next();
});


// requiring routes
app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);



app.listen(3000, function(req,res){
    console.log("the yelp camp has started ");
});