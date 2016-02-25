$.heaven = $.heaven || {};
$.extend($.heaven,{
	/*
	检测参数是否为类型，返回一个布尔值
	 */
	isObject : function(obj){
		return Object.prototype.toString.call(obj) == '[object object]';
	},
	/*
	检测参数是否为string类型，返回一个布尔值
	 */
	isString : function(string){
		return Object.prototype.toString.call(string) == '[object String]';
	},
	/*
	检测参数是否为function类型，返回一个布尔值
	 */
	isFunction : function(func){
		return typeof func === 'function';
	},
	/*
	检测参数是否为number类型，返回一个布尔值
	 */
	isNumber : function(num){
		return typeof num === 'number';
	},
	/*
	检测参数是否为boolean类型，返回一个布尔值
	 */
	isBoolean : function(boolean){
		return typeof boolean == 'boolean'
	},
})