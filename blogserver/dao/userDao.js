var db = require('../util/mongodb');
var mongo = new db("user");
module.exports = {
	addNewUser : function(user,callback){
		mongo.create(user,callback)
	}
}