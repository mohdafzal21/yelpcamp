var express =require("express");
var router = express.Router();

var Campground = require("../models/campground");

////////
// campground routes
///////

router.get("/", function(req,res){
    // get all campgrounds from db and render
    Campground.find({}, function (err, campgrounds) {
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campground: campgrounds, currentUser: req.user});
        }

    });


});
/// new - show form to create a campground
router.post("/",isLoggedIn, function (req,res) {
    // get data from form and add to campground array
    var name = req.body.name;
    var image  = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user_id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description:desc, author:author};
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
// create a new route
router.get("/new",isLoggedIn, function (req,res) {
    res.render("campgrounds/new");
});

/// show page
router.get("/:id", function (req,res) {
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


// midlleware

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");
}



module.exports = router;