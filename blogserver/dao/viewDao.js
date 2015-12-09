var redis = require('../util/redis');
module.exports = {
  i18n:function(lan,callback){
  	redis.hselect(lan,function(data){
  		if(data){
  			callback(data);
  		}else{
  			callback(false)
  		}
  	})
  }
};
