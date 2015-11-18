var url = require('url'),
	path = require('path'),
	fs = require('fs'),
	querystring = require('querystring'),
	server = require('../server/server'),
	mine = require('../config/mine').types,
	svconfig = require('../config/svConfig'),
	pathconfig = require('../config/pathConfig');
module.exports = function(app) {
	var returnedData = {
  		  
  		};
  	//heavenview请求前台资源
  	app.get(/heavenview/, function (request, response) {
		var pathname = url.parse(request.url).pathname,
			pathname = pathname.replace(/heavenview\//g,''),
			query = url.parse(request.url,true).query,
			realPath,ext;
		if(pathname.indexOf('/assets/') > -1){
			realPath = path.join(pathconfig.view["root"], pathname);
		}else{
			realPath = path.join(pathconfig.view["root"] + pathconfig.view["heaven"], pathname);
		}		
	   	ext = path.extname(realPath);
	    ext = ext ? ext.slice(1) : 'unknown';
	    fs.exists(realPath, function (exists) {    
	        if (!exists) {
	            response.writeHead(404, {
	                'Content-Type': 'text/plain'
	            });

	            response.write("This request URL " + pathname + " was not found on this server.");
	            response.end();
	        } else {
	            fs.readFile(realPath, "binary", function (err, file) {
	                if (err) {
	                    response.writeHead(500, {
	                        'Content-Type': 'text/plain'
	                    });
	                    response.end(err);
	                } else {
	                    var contentType = mine[ext] || "text/plain";
	                    response.writeHead(200, {
	                        'Content-Type': contentType
	                    });
	                    response.write(file, "binary");
	                    response.end();
	                }
	            });
	        }
	    });		
		
	});

	//页面资源请求
	//get请求分支
	app.get('/heavenserver', function (request, response) {
		console.lo("...................收到get请求")
		var pathname = url.parse(request.url).pathname,
			query = url.parse(request.url,true).query,
			servicecode = query.serviceCode;	
			condole.log(query)	
		response.send('nihao')
	});
	//post请求分支
	app.post('/heavenserver', function (request, response,next) {
		var pathname = url.parse(request.url).pathname,
			query = url.parse(request.url,true).query,
			servicecode = query.serviceCode;
			postData = '';	
		console.log("-------收到post请求---------");
		console.log(query);
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