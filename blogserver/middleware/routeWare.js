var url = require('url'),
	path = require('path'),
	querystring = require('querystring'),
	pathconfig = require('../config/pathConfig');
module.exports = {
	//get路由处理
	getRouterWare : function(request, response, next){
		console.log("get路由中间件");
  		//对路由进行处理
  		var pathname = url.parse(request.url).pathname,
			pathname = pathname.replace(/heavenview\//g,''),
			query = url.parse(request.url,true).query,
			viewCondition = {},
			realPath,ext;
		if(pathname.indexOf('/assets/') > -1){
			realPath = path.join(pathconfig.view["root"], pathname);
		}else{
			realPath = path.join(pathconfig.view["root"] + pathconfig.view["heaven"], pathname);
		}
		ext = path.extname(realPath);
	    ext = ext ? ext.slice(1) : 'unknown';
		viewCondition.realPath = realPath;
		viewCondition.pathname = pathname;		
	   	viewCondition.ext = ext;
	   	request.viewCondition = viewCondition;
  		next();
	},

	postRouterWare : function(request, response, next){
		console.log("post路由中间件");
		var pathname = url.parse(request.url).pathname,
			query = url.parse(request.url,true).query,
			serviceCondition = {},
			servicecode = query.servicecode;
		serviceCondition.servicecode = servicecode;
		request.serviceCondition = serviceCondition;
		next();

	}
}