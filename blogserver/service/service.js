var url = require('url'),
	path = require('path'),
	member = require('../models/member'),
	article = require('../models/article'),
	userdao = require('../dao/userDao'),
	pathconfig = require('../config/pathConfig'),
	svconfig = require('../config/svConfig'),
	heaven = require('../util/heaven');
module.exports = {
	registeruser : function (user,callback){
		//用户注册
		var newUser = new member(user);
		console.log("新用户信息 ------>" +newUser);
		userdao.addNewUser(newUser,function(data){
			callback("",data,data.status);
		});
	}	
};