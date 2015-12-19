/**
 * 公共方法集合，此中方法均为常用工具类函数
 */
/**
 * [isEmptyObj 该函数判定传入参数是否为空对象{}，如果是返回true，否则返回false]
 * @param  {[type]}  obj [object对象]
 * @return {Boolean}     [如果是{}，返回true，否则返回false]]
 */
function isEmptyObj(obj){
	if(Object.prototype.toString.call(obj) === "[object Object]"){
		for(var item in obj){
			if(obj.hasOwnProperty(item)){				
				return false;
			}else{
				return true;
			}
		}
	}
	return false;
}
/**
 * [validate 表单验证]
 * @param  {[string]} select [jq选择器]
 * @param  {[object]} obj    [验证条件]
 * @return {[type]}        [如果验证全部通过，则返回true，否则返回false]
 */
function validate(select,obj){
	if(!isEmptyObj(obj)){
		var value = $(select).val(),result = {},validate = true,
			emailExp = /^[\d\w]+@[\d\w]+\.[\d\w]+/,
			numberExp = /^[0-9]*$/;
		if(obj.hasOwnProperty("required")){
			if(value.length>0){
				result["required"] = true;
			}else{
				result["required"] = false;
			}
		}
		if(obj.hasOwnProperty("email")){
			if(emailExp.test(value)){
				result["email"] = true;
			}else{
				result["email"] = false;
			}
		}
		if(obj.hasOwnProperty("number")){
			if(value.length > 0 && numberExp.test(value)){
				result["number"] = true;
			}else{
				result["number"] = false;
			}
		}


		//验证obj条件是否全部满足
		for(var i in obj){
			if(!obj[i]){
				validate = false; 
			}
		}
		return validate;
	}
}