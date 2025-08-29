const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(
    "mongodb+srv://sreenufriends18_db_user:6cVgQNo9S6nwX6q5@nodecluster.suzo82p.mongodb.net/shop?retryWrites=true&w=majority&appName=NodeCluster"
  )
    .then((client) => {
      console.log("connectd");
      _db = client.db();
      cb();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = ()=>{
    if(_db){
        return _db;
    }
    return 'No database found!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
