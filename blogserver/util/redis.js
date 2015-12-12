var redis = require('redis'),
	status = require('../config/status'),
    dbconfig = require('../config/dbconfig').redis;
module.exports = {		
	/**
	 * [exists 判断一条记录是否存在]
	 * @param  {[string]}   key      [要判断的记录的key]
	 * @param  {Function} callback [回调函数]
	 * @return {[type]}            [存在返回1，不存在返回0]
	 */
	exists : function(key,callback){
		client.exists(key,function(err,isSuccess){
			if(err){
				console.log("查询出错：" + err);
			}else{
				callback(isSuccess);
			}
		})
	},
	/**
	 * [insert 插入一条string记录]
	 * @param  {[string]}   key      [要插入记录的key]
	 * @param  {[string]}   value    [要插入记录的value]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	insert : function(key,value,callback){
		this.exists(key,function(exist){
			if(exist){
				//该key已经存在
				callback(false);
			}else{
				client.set(key,value,function(err,data){
					if(err){
						console.dir("出错" + err);
						callback(false)
					}else{
						console.log("结果：" + data);
						callback(true)
					}
				})
			}
		})
	},
	/**
	 * [delkey 删除一条记录，任何类型的记录都可以删除]
	 * @param  {[string]}   key      [要删除的记录的key]
	 * @param  {Function} callback [回调函数]
	 * @return {[type]}            [删除出错返回false，否则返回true]
	 */
	delkey : function(key,callback){
		client.del(key,function(err,exists){
			if(err){
				console.log("删除出错：" + err);
				callback(false);
			}else{
				if(exist){
					console.log("删除记录成功");
					callback(true)
				}else{
					console.log("删除成功，该记录不存在");
					callback(true)
				}
			}
		})
	},
	
	/**
	 * [hinsert 插入一条哈希记录，如果该记录的key已经存在，则返回false，插入成功
	 * 则返回两个参数，第一个为true，第二个是插入的数据]
	 * @param  {[string]}   key      [要插入记录的key]
	 * @param  {[object]}   field    [要插入的数据]
	 * @param  {Function} callback [回调函数]
	 * @return {[type]}            [description]
	 */
	hinsert : function(key,field,callback){
		this.exists(key,function(exist){
			if(exist){
				//该key已经存在
				callback(false);
			}else{
				client.hmset(key,field,function(err,data){
					if(err){
						console.dir("出错" + err);
						callback(false)
					}else{
						console.log("结果：" + data);
						callback(true)
					}
				})
			}
		})
	},
	/**
	 * [hupdate 更新一条hash记录，若该记录的key已经存在，则不做插入，返回false，否则插入记录，返回false
	 * 对原来的记录做更新，完全覆盖之前的数据，不管是什么类型，都将被新的数据所覆盖]
	 * @param  {[type]}   key      [要插入记录的key]
	 * @param  {[type]}   field    [要更新的记录]
	 * @param  {Function} callback [回调函数]
	 * @return {[type]}            [description]
	 */
	hupdate : function(key,field,callback){
		this.exists(key,function(exist){
			if(exist){
				client.del(key,function(){
					client.hmset(key,field,function(err,data){
						if(err){
							console.log("数据更新失败:" + err)
							callback(false);
						}else{
							console.log("数据更新成功：" + data);
							callback(true);
						}
							
					})
				})	
			}else{
				console.log("该记录不存在");
				callback(false);
			}
		})
	},
	/**
	 * [hselect 查询一条hash记录]
	 * @param  {[type]}   key      [要查询的数据的key]
	 * @param  {Function} callback [回调函数]
	 * @return {[boolean]}            [查询成功，返回true和查询到的数据，否则返回false]
	 */
	hselect : function(key,callback){
		this.exists(key,function(exist){
			if(exist){
				client.hgetall(key,function(err,res){
					if(err){
						console.log("查询出错：" + err);
						callback(false);
					}else{
						console.log("查询结果：" + res);
						callback(res);
					}
				})
			}else{
				console.log("该记录不存在");
				callback(false);
			}
		})
	}


}