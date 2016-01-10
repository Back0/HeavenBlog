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

	//国际化页面请求测试
	/*app.get(/i18n/, function (request, response) {
		console.log("国际化测试")
		var pathname = url.parse(request.url).pathname,
			pathname = pathname.replace(/heavenview\//g,''),
			query = url.parse(request.url,true).query,
			realPath,ext;
		if(pathname.indexOf('/assets/') > -1){
			realPath = path.join(pathconfig.view["root"], pathname);
		}else{
			realPath = path.join(pathconfig.server["tpl"], pathname);
		}	
		//art-template配置	
	   	ext = path.extname(realPath);
	    ext = ext ? ext.slice(1) : 'unknown';
	    service["test"]("zh-CN",function(isSuccess,data){
	    	if(isSuccess){
	    		response.writeHead(200, {
                    'Content-Type': "text/html"
                });
                response.write(data, "utf8");
                response.end();
	    	}
	    })
	    
		
	});*/

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