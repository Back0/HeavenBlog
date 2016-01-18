var fs = require('fs'),
	path = require('path'),
	mine = require('../config/mine'),
	pathconfig = require('../config/pathConfig');
module.exports = {		
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