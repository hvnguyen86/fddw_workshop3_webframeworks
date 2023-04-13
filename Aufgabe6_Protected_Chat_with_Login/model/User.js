const config = require('config');
const couchdbUser = config.get("couchdb.user");
const couchdbPassword = config.get("couchdb.password");
const crypto = require('crypto');

var nano = require('nano')(`http://${couchdbUser}:${couchdbPassword}@127.0.0.1:5984`);
var usersDB = nano.db.use("chatusers");

var User = {};

User.save = async function(username,password, id = null){
    var response;
    if(!id){
        id = crypto.randomUUID();
        response = await usersDB.insert({_id: id, username: username, password: password});
    } else {
        var user = await User.get(id);
        var revision = user._rev;
        response = await usersDB.insert({_id: id, _rev : revision ,username: username, password: password});
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

User.getByUsernameAndPassword = async function(username,password){
    
    const users = await usersDB.find(
        {
            selector: {
                username: username,
                password: password
            },

            limit: 1
        }
    )
    return users.docs[0];
}

User.delete = async function(id){
    var user = await User.get(id);
    var revision = user._rev;
    var response = usersDB.destroy(id,revision);
    return response;
}

module.exports = User;