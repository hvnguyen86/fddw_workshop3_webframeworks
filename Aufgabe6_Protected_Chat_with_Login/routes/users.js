var express = require('express');
var router = express.Router();
var User = require("../model/User");

router.post("/",function(req, res){
  
  var username = req.body.username;
  var password = req.body.password;
  User.save(username,password);
  res.redirect("/");
})

router.get("/registerform", function(req,res){
  res.render("users/registerForm", {title: "Register Form"})
})

router.get("/:id", async function(req,res){
  var id = req.params.id;
  var user = await User.get(id);
  res.render("users/editForm", {title: "Edit Form", user:user})
})


async function deleteUserHandler(req, res){
  var id = req.params.id;
  await User.delete(id);
  res.writeHead(204)
}

module.exports = router;
