var url = require('url'),
	server = require('../server/server'),
	svconfig = require('../config/svConfig'),
	pathconfig = require('../config/pathConfig');
module.exports = function(app) {
	var returnedData = {
  		  
  		};
	app.get('/', function (request, response) {
		var pathname = url.parse(request.url).pathname,query = url.parse(request.url,true).query,servicecode = query.serviceCode;		
		response.send('nihao')
	});
	app.post('', function (request, response,next) {
		
	});
}