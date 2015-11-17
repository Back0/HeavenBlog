var url = require('url'),
	querystring = require('querystring'),
	server = require('../server/server'),
	svconfig = require('../config/svConfig'),
	pathconfig = require('../config/pathConfig');
module.exports = function(app) {
	var returnedData = {
  		  
  		};
  	//heavenview请求前台资源
  	app.get('/heavenview', function (request, response) {
		var pathname = url.parse(request.url).pathname,
			query = url.parse(request.url,true).query,
			servicecode = query.serviceCode;		
		response.send('heavenview')
	});
	//get请求分支
	app.get('/', function (request, response) {
		var pathname = url.parse(request.url).pathname,
			query = url.parse(request.url,true).query,
			servicecode = query.serviceCode;		
		response.send('nihao')
	});
	//post请求分支
	app.post('/', function (request, response,next) {
		var pathname = url.parse(request.url).pathname,
			query = url.parse(request.url,true).query,
			servicecode = query.serviceCode;
			postData = '';	
		console.log("-------收到post请求---------")；
		request.setEncoding("utf8");
	    request.addListener("data", function(postDataChunk) {
	      postData += postDataChunk;
	    });
        //TODO 这种接受post参数的方式需要改进
	    request.addListener("end", function() {
	    	if(postData){
	        	var params = JSON.parse(querystring.parse(postData)),
	        		svName = svConfig[serviceCode];
	        	if(!svName){
	        		//未找到相应的服务（所有的服务必须在svconfig中进行配置）
	        		//TODO 返回错误信息
	        	}
	    		service[svName](params.data["condition"],function(err,backdata,isSuccess){
	    			if(isSuccess){
	    				console.log('返回结果');
	    				returnedData.operate_code = "1";
	    				returnedData["data"] = backdata;
	    			}else{
	    				returnedData.operate_code = "0";
	    				returnedData["data"] = backdata;
	    			}
	    			response.json(returnedData);
	    		});
	        }

	    });
	});
}