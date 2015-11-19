var url = require('url'),
	path = require('path'),
	member = require('../models/member'),
	article = require('../models/article'),
	pathconfig = require('../config/pathConfig'),
	svconfig = require('../config/svConfig'),
	heaven = require('../util/heaven');
module.exports = {
	registeruser : function (user){
		//用户注册
		console.log("用户注册，用户信息" + JSON.stringify(user));
		var newUser = new member(user);
		console.log(newUser)
	}	
};