//数据库操作

var mysql = require('mysql'),
    dbConfig = require('../config/dbconfig').mysql;

//创建单个数据库连接
//var connection = mysql.createConnection(dbConfig);  

//创建mysql连接池
var pool = mysql.createPool(dbConfig);

var insert = function(sql,param,callback){  
    /*var data = {account: 'Tony', password : '123456'};  
    connection.query('INSERT INTO user SET ?', data, function(err, result) {  
        console.log('ID : ' + result.insertId);  
    });*/
	pool.getConnection(function(err,conn){  
        if(err){  
            throw err; 
        }else{  
            conn.query(sql,param,function(err,vals,fields){  
                conn.release(); 
                if(err){
                	throw err;
                }else{
                	callback(err,vals,fields);
                }
                  
            });  
        }  
    });  
};  
//采用连接池的方式进行修改 
var update = function(sql,param,callback){  
    /*var data = ['Update', 1 ];  
    connection.query('UPDATE user SET account = ? WHERE id = ?', data, function(err, result) {  
    }); */
    
    pool.getConnection(function(err,conn){  
        if(err){  
            throw err; 
        }else{  
            conn.query(sql,param,function(qerr,vals,fields){  
                //释放连接  
                conn.release();  
                //事件驱动回调  
                callback(qerr,vals,fields);  
            });  
        }  
    });  
};  
//单个链接 
var select = function(sql,callback){ 
	pool.getConnection(function(err,conn){  
        if(err){  
            throw err; 
        }else{  
            conn.query(sql,function(err,vals,fields){  
                //释放连接  
                conn.release();   
                callback(err,vals,fields); 
            });  
        }  
    });  
};  
exports.insert = insert;
exports.update = update;
exports.select = select;



//外部使用方法
/*
 * 


var database = require('./common/dbOperate');
app.get('/', function (request, response) {
var selectSql = 'select * from table1';
var insertSql = 'insert into table1 set ?',insertParam = {id:001,name:'liu'};
database.select(selectSql,function(err,data,tabMessage){          //select为异步查询，所以依赖查询结果的操作应放在回调函数中
	console.log(data)
});
database.update(sql,function(err,data,tabMessage){          
	console.log(data);
});

//插入信息
database.insert(insertSql,insertParam,function(err,data,tabMessage){          
	console.log(data);
});
});*/