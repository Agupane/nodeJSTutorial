const config = require('../config/config')
const mongoose = require('mongoose')
const { mongo } = config
const user = mongo.user
const pwd = mongo.pwd
const dbName = mongo.db
const uri = 'mongodb+srv://'+user+':'+pwd+'@examplecluster-unirs.mongodb.net/'+dbName+'?retryWrites=true'

const mongoConnect = (callback) => {
  mongoose.connect(uri)
    .then(client => {
      console.log("Mongodb connected");
      callback(client)
    })
    .catch(error => {
      console.log("Mongodb Error", error)
      throw error;
    })
};
exports.mongoConnect = mongoConnect;