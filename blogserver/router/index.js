var routerware = require('../middleware/routeWare'),
	deliver = require("../middleware/deliver"),
	date = require("../util/date");
var dateStr = '';
module.exports = function(app) {
  	//heavenview请求前台资源
  	app.use(function(request, response, next){

		dateStr = date.format(new Date());
  		console.log('请求时间：' + dateStr);
  		next();
  	});
  	app.get(/heavenview/,routerware.getRouterWare);
  	app.get(/heavenview/,deliver.getServiceWare);

	//后台服务请求
	//get请求分支
	app.get(/heavenserver/, function (request, response) {
		console.lo("........收到get请求........");
		response.send('nihao')
	});
	//post请求分支
	app.post(/heavenserver/, routerware.postRouterWare);
	app.post(/heavenserver/,deliver.postServiceWare);
}