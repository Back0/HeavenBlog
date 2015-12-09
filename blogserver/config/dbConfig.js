module.exports = {
  mysql: {
    host: '127.0.0.1', 
    user: 'root',
    password: 'root',
    database:'cms', 
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
    host: "10.11.16.235",
    options :{}
  }
};