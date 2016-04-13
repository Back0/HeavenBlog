var fs = require('fs'),
	mine = require('../config/mine').types,
	svconfig = require('../config/svConfig'),
	service = require('../service/service');
module.exports = {
		//get静态资源请求
	getServiceWare : function(request, response, next){
  		var viewCondition = request.viewCondition,
			pathname = viewCondition.pathname,
			realPath = viewCondition.realPath,
			ext = viewCondition.ext;
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
	},
	postServiceWare : function(request, response, next){
		var condition = request.serviceCondition,
			servicecode = condition.servicecode,
			postData = '',
			returnedData = {};
		request.setEncoding("utf8");
	    request.addListener("data", function(postDataChunk) {
	      postData += postDataChunk;
	    });
        //TODO 这种接受post参数的方式需要改进
	    request.addListener("end", function() {
	    	if(postData){
	    		console.log(JSON.parse(postData));
	        	var params = JSON.parse(postData),
	        		svName = svconfig[servicecode];
	        	if(!svName){
	        		//未找到相应的服务（所有的服务必须在svconfig中进行配置）
	        		//TODO 返回错误信息
	        	}
	        	//TODO  post随行参数传入前进行包装
	    		service[svName](params,function(backdata,isSuccess){
	    			if(isSuccess){
	    				returnedData.operate_code = 1;
	    				returnedData.heaven_data = backdata;
	    			}else{
	    				returnedData.operate_code = 0;
	    				returnedData.heaven_data = backdata;
	    			}
	    			response.json(returnedData);
	    		});
	        }

	    });
	}
}