var express = require('express'),
	routes = require('./router/index'),
	app = express();

app.set('port',2014);
routes(app);
app.listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
});