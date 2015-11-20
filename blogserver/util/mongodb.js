var mongoskin = require('mongoskin'),
    dbconfig = require('../config/dbconfig').mongodb;
var db = mongoskin.db(dbconfig);