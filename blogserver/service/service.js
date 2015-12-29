var url = require('url'),
	path = require('path'),
	template = require('art-template'),
	member = require('../models/member'),
	article = require('../models/article'),
	userdao = require('../dao/userDao'),
	viewdao = require('../dao/viewDao'),
	pathconfig = require('../config/pathConfig'),
	svconfig = require('../config/svConfig'),
	heaven = require('../util/heaven');
module.exports = {
	registeruser : function (user,callback){
		//用户注册
		var newUser = new member(user);
		console.log("新用户信息 ------>" +newUser);
		userdao.addNewUser(newUser,function(data){
			if(data.status == -1){
				callback(data,false)
			}else{
				callback(data,true)
			}
		});
	},
	userlogin : function(user, callback){
		console.log("________用户登录服务")
		userdao.login(user, function(exist,result){
			var obj = {},temp = heaven.clone(result);
			delete(temp.password);
			delete(temp._id);
			obj.status = exist;

			if(exist == -1){
				console.log("登陆失败")
				console.dir(temp)
				return callback(obj,false)
			}else if(exist == 1){
				console.log("用户存在")
				console.dir(temp)
				obj.items = temp;

				return callback(obj,true)
			}else{
				console.log("用户不存在")
				console.dir(temp)
				obj.items = temp;

				return callback(obj,true)
			}
		})
	},
	test : function(lan,callback){
		viewdao.i18n(lan,function(data){
			if(data){
				var html = template(pathconfig.server["tpl"] + 'index',data);
				console.log(html);
				callback(true,html);
			}
		})
	}
};
