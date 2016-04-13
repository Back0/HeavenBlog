var fs = require('fs'),
	logger = require('morgan'),
	accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'}),
	routerware = require('../middleware/routeWare'),
	deliver = require("../middleware/deliver");
module.exports = function(app) {
	//日志中间件
	app.use(logger('common', {stream: process.stdout}));
  	//heavenview请求前台资源
  	app.get(/heavenview/,routerware.getRouterWare);
  	app.get(/heavenview/,deliver.getServiceWare);

	//后台服务请求
	//get请求分支
	app.get(/heavenserver/, function (request, response) {
		response.send('nihao')
	});
	//post请求分支
	app.post(/heavenserver/, routerware.postRouterWare);
	app.post(/heavenserver/,deliver.postServiceWare);
}