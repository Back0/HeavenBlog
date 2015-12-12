module.exports = {
		clone : function(obj){
			//深复制对象方法  
            var newO = {};  
  
            if (obj instanceof Array) {  
                newO = [];  
            }  
            for (var key in obj) {  
                var val = obj[key];  
                newO[key] = typeof val === 'object' ? arguments.callee(val) : val;  
            }  
            return newO;  
		},
		generateID : function (){
			var cmsid = '';
			for(; cmsid.length < 16; cmsid += Math.random().toString(36).substr(2));
			return cmsid.substr(0,16);
		}
}