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
	template.config("openTag", "$[");
	template.config("closeTag", "]$");
module.exports = {
	registeruser : function (user,callback){
		//用户注册
		var newUser = new member(user);
		console.log("新用户信息 ------>" +newUser);
		userdao.addNewUser(newUser,function(data){
			callback("",data,data.status);
		});
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