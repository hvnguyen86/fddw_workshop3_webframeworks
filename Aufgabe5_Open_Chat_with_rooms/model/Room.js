const config = require('config');
const couchdbUser = config.get("couchdb.user");
const couchdbPassword = config.get("couchdb.password");
const crypto = require('crypto');

var nano = require('nano')(`http://${couchdbUser}:${couchdbPassword}@127.0.0.1:5984`);
var roomsDB = nano.db.use("rooms");

var Room = {};

Room.save = async function(name, public = false){
    var id = crypto.randomUUID();
    response = await roomsDB.insert({_id: id, name: name});
}

Room.getAll = async function(){
    var rooms = await roomsDB.list({include_docs: true})
    return rooms.rows;
}


Room.get = async function(id){
    const room = await roomsDB.get(id);
    return room;
}

module.exports = Room;