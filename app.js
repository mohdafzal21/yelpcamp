var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var campgrounds = [
    {name: "Salmon creek", image:"http://www.photosforclass.com/download/3062207412 "},
    {name: "Granite hill", image:"http://www.photosforclass.com/download/3062178880 "},
    {name: "Mountain goat", image:" http://www.photosforclass.com/download/7777868526"}
];




app.get("/", function(req,res){
    res.render("landing.ejs");

});

app.get("/campgrounds", function(req,res){

    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function (req,res) {
    // get data from form and add to campground array
    var name = req.body.name;
    var image  = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");

    //res.send("you hit the post route")

})

app.get("/campgrounds/new", function (req,res) {

    res.render("new.ejs");
})




app.listen(3000, function(req,res){
    console.log("the yelp camp has started ");
});