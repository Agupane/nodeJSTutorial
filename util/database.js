const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../config/config')

const { mongo } = config
const user = mongo.user
const pwd = mongo.pwd


const uri = 'mongodb+srv://'+user+':'+pwd+'@examplecluster-unirs.mongodb.net/test?retryWrites=true'
const client = new MongoClient(uri, { useNewUrlParser: true });
const mongoConnect = (callback) => {
  client.connect()
        .then(result => {
            console.log("Mongodb connected");
            callback(result)
        })
        .catch(error => {
            console.log("Mongodb Error", error)
        })
};
module.exports = mongoConnect;