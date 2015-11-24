var db = require('../util/mongodb'),
	status = require('../config/status');
var mongo = new db("user");
module.exports = {
	//用于检测用户是否已经存在，如果存在，则返回1，否则返回0,查询出错返回-1
	_userExists : function(user,callback){
		mongo.read({"email":user.email},function(result){
			console.log("------------------" + JSON.stringify(result));
			var obj = {
                
            	};
			if(typeof result == "string"){
				obj.status=-1;
                obj.message= status.fail.message;
			}
			else if(result.items.length == 0){
				obj.status=status.fail.status;
                obj.message= status.fail.message;
			}else if(result.items.length){
				obj.status=status.success.status;
                obj.message= status.success.message;
				console.log("++++++++用户已存在++++")	
			}
			return callback(obj)
		})
	},
	addNewUser : function(user,callback){
		this._userExists(user,function(result){
			if(result.status == 0)
			mongo.create(user,function(data){
				console.log("++++++++用户不存在，创建新用户++++")
				return callback(data);
			})
		});
		
	}
}
