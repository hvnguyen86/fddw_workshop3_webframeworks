var express = require('express');
var router = express.Router();
var Room = require("../model/Room");

router.get("/", async function(req, res){
    var rooms = await Room.getAll();
    res.render("rooms/rooms", {title: "Rooms", rooms:rooms})
})

router.post("/", async function(req,res){
    var name = req.body.name;
    await Room.save(name);
    res.redirect("/rooms");
})

router.get("/:id", async function(req, res){
    var id = req.params.id;
    var room = await Room.get(id);
    res.render("rooms/room", {title: "Room", room:room})
})

module.exports = router;