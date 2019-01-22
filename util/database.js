const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../config/config')

const { mongo } = config
const user = mongo.user
const pwd = mongo.pwd
const dbName = mongo.db
const uri = 'mongodb+srv://'+user+':'+pwd+'@examplecluster-unirs.mongodb.net/'+dbName+'?retryWrites=true'
const client = new MongoClient(uri, { useNewUrlParser: true });

let _db;

const mongoConnect = (callback) => {
  client.connect()
    .then(client => {
      console.log("Mongodb connected");
      _db = client.db()
      callback(client)
    })
    .catch(error => {
      console.log("Mongodb Error", error)
      throw error;
    })
};

const getDb = () => {
  if(_db) {
    return _db;
  }
  throw 'No database found!';
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb