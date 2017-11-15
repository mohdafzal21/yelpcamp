var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/practicedemo",{ useMongoClient: true });


var postSchema = mongoose.Schema({
    title: String,
    content: String
});

var Posts = mongoose.model("Posts", postSchema);

var userSchema = mongoose.Schema({
    name:String,
    email: String,
    posts:[postSchema]
});
var User = mongoose.model("User",userSchema);

//
// var newUser = new User({
//     email:"n@n.com",
//     name:"new name"
// });
// newUser.posts.push({
//     title: "this is post from post",
//     content: " hi"
// });
// newUser.save(function(err,user){
//     if(err){console.log(err)}else{console.log(user)}
// });
//

User.findOne({name: "new name"},function(err,user){
    if(err){console.log(err)}else{
        user.posts.push({
            title:" new title",
            content:"new content"
        });
        user.save(function(err,user){
            if(err){console.log(err)}else{
                console.log(user);
            }
        });


    }
});

















