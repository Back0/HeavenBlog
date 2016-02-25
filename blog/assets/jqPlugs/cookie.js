$.heaven = $.heaven || {};
$.extend($.heaven,{
	/*
	
	 */
	cookie:function(name, value, options){
		if(typeof value === "undefined" ){
			var cookieName = encodeURIComponent(name) + '=',
				cookieStart = document.cookie.indexOf(cookieName),
				cookieValue = '';
			if(cookieStart > -1){
				var cookieEnd = document.cookie.indexOf(';',cookieStart);
				if(cookieEnd == -1){
					cookieEnd = document.cookie.length;
				}
				cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length,cookieEnd))
				return cookieValue;
			}
			
		}else{
			var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
			if($.isObj(options) || value.length == 0){
				if(value.length == 0){
					options.expires = new Date(0);
				}
				if(options.expires instanceof Date){
					cookieText += ';expires=' + options.expires.toGMTString();
				}
				if(options.path){
					cookieText += ';path=' + options.path;
				}
				if(options.domain){
					cookieText += ';domain=' + options.domain;
				}
				if(options.secure){
					cookieText += ';secure';
				}
				document.cookie = cookieText;
			}
		}
	}
})