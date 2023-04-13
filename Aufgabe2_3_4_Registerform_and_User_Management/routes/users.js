var express = require('express');
var router = express.Router();
var User = require("../model/User");

router.get('/', async function(req, res, next) {
  var users = await User.getAll();
  res.render("users/users", { title : "User list", users: users});
  
});

router.post("/",saveUserHandler)

router.get("/registerform", function(req,res){
  res.render("users/registerForm", {title: "Register Form"})
})

router.get("/:id", async function(req,res){
  var id = req.params.id;
  var user = await User.get(id);
  res.render("users/editForm", {title: "Edit Form", user:user})
})

router.route("/:id").post(saveUserHandler).put(saveUserHandler).delete(deleteUserHandler)

async function saveUserHandler (req, res){
  var id = req.params.id;
  var prename = req.body.prename;
  var surname = req.body.surname;
  User.save(prename,surname,id);
  res.redirect("/users");
}

async function deleteUserHandler(req, res){
  var id = req.params.id;
  await User.delete(id);
  res.writeHead(204)
}

module.exports = router;
