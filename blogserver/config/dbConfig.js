module.exports = {
  mysql: {
    host: '127.0.0.1', 
    user: 'root',
    password: 'root',
    database:'test', 
    port: 3306
  },

  //此系统中使用mongodb
  mongodb:{
    dbname:"HeavenBlog",
    port: "27017",
    host: "127.0.0.1",
  },
  redis : {
    port: "6379",
    host: "127.0.0.1",
    options :{}
  }
};