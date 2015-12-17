var db = require('../util/mongodb'),
	status = require('../config/status');
var mongo = new db("user");
module.exports = {
	//用于检测用户是否已经存在，如果存在，则返回1，否则返回0,查询出错返回-1
	/**
	 * [_userExists description 该方法用于检测用户是否存在]
	 * @param  {[json]}   user     [查询条件]
	 * @param  {Function} callback [回调函数]
	 * @return {[boolean,obj]}     [若存在,返回true和该用户信息，若不存在返回false和空数组，发生错误时返回false和err对象]
	 */
	_userExists : function(user,callback){
		mongo.read({"email":user.email},function(result){
			console.log("------------------" + JSON.stringify(result));
			if(result.status){
				if(result.items.length){
					console.log("该用户已存在");
					return callback(1,result.items[0]);
				}else{
					console.log("该用户不存在")
					return callback(0,result.items);
				}
				
			}else{
				return callback(-1,result.items);
			}
		})
	},
	addNewUser : function(user,callback){
		this._userExists(user,function(exist,result){
			var obj= {};
			if(exist == 0){
				mongo.create(user,function(data){
					console.log("++++++++用户不存在，创建新用户++++" + data)
					obj.status = exist
					//obj.items = data.items;
					return callback(obj);
				})
			}else{
				obj.status = exist;
				//obj.items = result;
				return callback(obj)
			}
		});
		
	}
}
