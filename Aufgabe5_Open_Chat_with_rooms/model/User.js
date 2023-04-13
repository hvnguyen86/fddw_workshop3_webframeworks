const config = require('config');
const couchdbUser = config.get("couchdb.user");
const couchdbPassword = config.get("couchdb.password");
const crypto = require('crypto');

var nano = require('nano')(`http://${couchdbUser}:${couchdbPassword}@127.0.0.1:5984`);
var usersDB = nano.db.use("users");

var User = {};

User.save = async function(prename,surname, id = null){
    var response;
    if(!id){
        id = crypto.randomUUID();
        response = await usersDB.insert({_id: id, prename: prename, surname: surname});
    } else {
        var user = await User.get(id);
        var revision = user._rev;
        response = await usersDB.insert({_id: id, _rev : revision ,prename: prename, surname: surname});
    }

    return response;

}

User.getAll = async function(){
    var users = await usersDB.list({include_docs: true})
    return users.rows;
}

User.get = async function(id){
    const user = await usersDB.get(id);
    return user;
}

User.delete = async function(id){
    var user = await User.get(id);
    var revision = user._rev;
    var response = usersDB.destroy(id,revision);
    return response;
}

module.exports = User;