var url = require('url'),
	server = require('../server/server'),
	svconfig = require('../config/svConfig'),
	pathconfig = require('../config/pathConfig');
module.exports = function(app) {
	var returnedData = {
  		  
  		};
	app.get('/', function (request, response) {
		var pathname = url.parse(request.url).pathname,
			query = url.parse(request.url,true).query,
			servicecode = query.serviceCode;		
		response.send('nihao')
	});
	app.post('', function (request, response,next) {
		var pathname = url.parse(request.url).pathname,
			query = url.parse(request.url,true).query,
			servicecode = query.serviceCode;
			postData = '';	
		console.log("-------收到post请求---------")；
		request.setEncoding("utf8");
	    //监听data数据传输
	    request.addListener("data", function(postDataChunk) {
	      postData += postDataChunk;
	    });
        //TODO 这种接受post参数的方式需要改进
	    request.addListener("end", function() {
	    	

	    });
	});
}