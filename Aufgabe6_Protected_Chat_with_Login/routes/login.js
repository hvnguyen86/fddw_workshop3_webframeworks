var express = require('express');
var router = express.Router();
var User = require("../model/User");

router.post("/",async function(req,res){
    var username = req.body.username;
	var password = req.body.password;

    if(username && password){
        var user = await User.getByUsernameAndPassword(username,password);
        if(user && user.username == username && user.password == password){
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect("/rooms");
        } else {
            res.send("Incorrect Username and Password!");
        }
    } else {
        res.send("Please enter Username and Password!")
    }
});

router.get("/logout",function(req, res){
    req.session.destroy();
    res.redirect("/")
})

module.exports = router;
