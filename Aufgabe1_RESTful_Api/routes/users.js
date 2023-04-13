var express = require('express');
var router = express.Router();
const crypto = require('crypto');

const config = require('config');
const couchdbUser = config.get("couchdb.user");
const couchdbPassword = config.get("couchdb.password");

var nano = require('nano')(`http://${couchdbUser}:${couchdbPassword}@127.0.0.1:5984`);
var usersDB = nano.db.use("users");

router.get('/', async function(req, res, next) {
  var users = await usersDB.list({include_docs: true})
  res.render("users/users", { title : "User list", users: users.rows});
  
});

router.post("/", async function(req, res){
  var id = crypto.randomUUID();
  const response = await usersDB.insert({_id: id, name: "viet"});
  res.writeHead(201);
  res.end("User created")
})

module.exports = router;
