var cheerio = require('cheerio'),
	fs = require('fs'),
	path = require('path'),
	hbs = require('hbs'),
	mine = require('../config/mine'),
	pathconfig = require('../config/pathConfig');
module.exports = {
		
		/**
		 * 
		 * 根据changedDom对指定的页面进行修改，接收到的数据格式为json对象，可能会有多个pageId，表示此页面有多个页面嵌套，需要分别修改
		 * var changeDom = {
					"page1":{
						"url":"test/index.html",
						"001":{"class":"cmsClass","value":"newValue1"},
						"002":{"class":"cmsClass","value":"newValue2"},
						"003":{"class":"cmsClass","value":"newValue3"},
						"004":{"class":"cmsClass","value":"newValue4"},
						"005":{"class":"cmsClass","value":"newValue5"}
					}
			}
		 */
		modify : function(changeDom){
		    var content,$;
		    //对changeDom进行遍历，分别对其中的页面进行修改
		    for(var pageid in changeDom){
        		var page = changeDom[pageid],pagePath = path.join(pathconfig.dst,page.url);
        		var ext = path.extname(pagePath);
    		    ext = ext ? ext.slice(1) : 'unknown';
    		    
    		    if (!fs.existsSync(pagePath)) {
		            console.log('文件不存在');
		            return false;
		        } else {
		        	//同步读取
		        	content = fs.readFileSync(pagePath,'utf8');
	                $ = cheerio.load(content);	                
	               //修改一个页面
	                for(var veriscms in page){
	                	if(veriscms != 'url'){
	                		$('[veriscms="' + veriscms + '"]').text(page[veriscms].value).attr('class',page[veriscms]["class"]);
	                	}
	                }
	                
	                
	                //TODO 异步变同步
		            fs.writeFileSync(pagePath, $.html());
		            console.log('页面修改成功');
		            return true;  
		        }
	        	
        	}		    
		},
		
		//创建多级目录  （共两个参数，第一个参数为根目录，第二个为真是的目录结构）
		//mkdirsSync(pathconfig.dst,'another/add1/one')  创建文件夹
		/**
		 * 创建多级目录
		 * dst ： 根目录
		 * dirpath ：目标路径 
		 */
		mkdirsSync : function(dst, dirpath){
			if (!fs.existsSync(dst + dirpath)) {
	            var pathtmp;
	            dirpath.split('/').forEach(function(dirname) {
	            	
	                if (pathtmp) {
	                    pathtmp = path.join(pathtmp, dirname);
	                }
	                else {
	                    pathtmp = dirname;
	                }
	                if (!fs.existsSync(dst + pathtmp)) {
	                    fs.mkdirSync(dst + pathtmp);
	                }
	            });
	        }
			console.log('目录创建成功')
	        return true; //目录已经存在
		},
		
		//删除文件或目录
		/**
		 * 删除指定文件或空目录，不可删除非空目录
		 * dst ： 根目录
		 * dirpath ： 要删除的目标路径
		 * 
		 */
		del : function(dst ,dirpath){
			var realpath = dst.concat(dirpath),stats = fs.statSync(realpath);
			if(stats.isFile()){
				fs.unlinkSync(realpath);
				console.log(fs.existsSync(realpath)? "删除文件失败" : "删除文件成功");
			        
			}else if(stats.isDirectory()){
				fs.rmdirSync(realpath);
				if(fs.existsSync(realpath)){
					console.log("删除目录失败")
					return false;
				}else{
					console.log("删除目录成功")
					return true;
				}
				
			}else{
				console.log('文件类型 有误');
				return false;
			}
			
			
		},
		
		//文件剪切
		/**
		 * dst为根目录，不可省略
		 * oldpath为原文件的目录
		 * newpath为要剪切到的目标目录
		 * filename为文件名
		 * 所有目录必须以斜杠结尾
		 */
		cut : function(dst , oldpath, newpath ,filename){
			var oldpath = dst.concat(oldpath,filename), newpath = dst.concat(newpath, filename);
			if(fs.existsSync(newpath)){
				console.log('同名文件已经存在');
			}else{
				var readData,
				fileReadStream = fs.createReadStream(oldpath),
				fileWriteStream = fs.createWriteStream(newpath);						
				fileReadStream.pipe(fileWriteStream);	
				fileWriteStream.on('close',function(){
					console.log('文件复制成功'); 
					fs.unlinkSync(oldpath);
					if(fs.existsSync(oldpath)){
						console.log("删除目录失败")
						return false;
					}else{
						console.log("删除目录成功")
						return true;
					}
					
				});
			}
			
			
		},
		//生成新页面
		/**
		 * 把模板文件和json数据结合在一起生成新的html文件
		 * laypath为模板路径（包括模板名称），dst为生成的html文件的存储目录，data为用来渲染的数据
		 * 
		 */
		layout : function(dst,laypath, htmlpath, data){
			var laypath = dst.concat(laypath),
				htmlpath = dst.concat(htmlpath),
				$,source,template,result;
				
			if(fs.existsSync(laypath)){
				content = fs.readFileSync(laypath,'utf8'),
				$ = cheerio.load(content),
				source = $.html(),
				template = hbs.compile(source),
				result = template(data);
				console.log(result);
				fs.writeFileSync(htmlpath, result)
				if(fs.existsSync(htmlpath)){
					console.log("页面生成")
					return true;
				}else{
					console.log("生成失败")
					return false;
				}
			}else{
				console.log('模板文件不存在');
				return false;
			}
		},
		/**
		 * 同步读取文件
		 * 
		 */
		readFileSync : function(filePath){
            return fs.readFileSync(filePath,'utf8'); 
		},
		/**
		 * 判断文件是否存在
		 */
		isFileExsit : function (filePath){
			if (fs.existsSync(filePath)) {
	            return true;
	        }
			return false;
		}
		
}