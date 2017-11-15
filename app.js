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
seedDB();
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




// Campground.create({
//
//     name: "Mountain goat",
//     image:" http://www.photosforclass.com/download/7777868526",
//     description: "this is huge mountain goat, awesome place to visit"
// },function (err,campground) {
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Newly created Campground");
//         console.log(campground);
//     }
//     });
// var campgrounds = [
//     {name: "Salmon creek", image:"http://www.photosforclass.com/download/3062207412 "},
//     {name: "Granite hill", image:"http://www.photosforclass.com/download/3062178880 "},
//     {name: "Mountain goat", image:" http://www.photosforclass.com/download/7777868526"}
// ];




app.get("/", function(req,res){
    res.render("landing.ejs");

});

app.get("/campgrounds", function(req,res){
    // get all campgrounds from db and render
    Campground.find({}, function (err, campgrounds) {
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campground: campgrounds});
        }

    });


});
/// new - show form to create a campground
app.post("/campgrounds", function (req,res) {
    // get data from form and add to campground array
    var name = req.body.name;
    var image  = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description:desc};
    // campgrounds.push(newCampground);

    // Create a new campground and save to databse
    Campground.create(newCampground, function (err, newlyCreated) {
        if(err){
            console.log(err);
        }else{
            res.redirect("campgrounds")
        }

    })
  //  res.redirect("/campgrounds");

    //res.send("you hit the post route")

});

app.get("/campgrounds/new", function (req,res) {

    res.render("campgrounds/new");
});

/// show page
app.get("/campgrounds/:id",isLoggedIn, function (req,res) {
    // find campground with id ad render show page
    Campground.findById(req.params.id).populate("comments").exec( function(err,foundCampground){
                 if(err){
                     console.log(err);
                 }else{
                     console.log(foundCampground);
                     //render show template with that campground
                     res.render("campgrounds/show", {campground:foundCampground});
                 }
    });

});


/////////////////////
///comment routes
/////////////////////
app.get("/campgrounds/:id/comments/new",isLoggedIn,function (req,res) {
    //find campground by id
    Campground.findById(req.params.id,function (err,campground) {
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground: campground});
        }

    });
});

app.post("/campgrounds/:id/comments",function(req,res){
    // lookup campground using id
    // con
      Campground.findById(req.params.id, function (err,campground) {
          if(err){
              console.log(err);
              res.redirect("/campgrouds");
          }else{
              // create new comment
              Comment.create(req.body.comment, function (err, comment) {
                  if(err){console.log(err)}
                  else{
                      campground.comment.push(comment);
                      campground.save();
                      res.redirect('/campgrounds'+ campground._id)
                  }

              });

          }

      })

});

////// Auth routes
 app.get("/register", function(req,res){
    res.render("register");
 });

 app.post("/register", function(req,res) {

     var newUser = new User({username: req.body.username});

     User.register(newUser, req.body.password, function (err, user) {
         if (err) {
             console.log(err);
             return res.render("register")

         }
             passport.authenticate("local")(req, res, function () {
                 res.redirect("/campgrounds");
             });

     });
 });


 /// show login form

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect:"/login"
}) ,function(req,res){});



// logout route
app.get("/logout", function(req,res){
   req.logout();
   res.redirect("/campgrounds");
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");
}



app.listen(3000, function(req,res){
    console.log("the yelp camp has started ");
});