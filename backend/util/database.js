const config = require('../config/config')
const mongoose = require('mongoose')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { mongo } = config
const user = mongo.user
const pwd = mongo.pwd
const dbName = mongo.db
const encryptPk = config.encryptPk
const MONGODB_URI = 'mongodb+srv://'+user+':'+pwd+'@examplecluster-unirs.mongodb.net/'+dbName+'?retryWrites=true'

const mongoConnect = (callback) => {
  mongoose.connect(MONGODB_URI)
    .then(client => {
      console.log("Mongodb connected");
      callback(client)
    })
    .catch(error => {
      console.log("Mongodb Error", error)
      throw error;
    })
};

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const sessionInstance = session({
  secret: encryptPk,
  resave: false,
  saveUninitialized: false,
  store: store
})

exports.mongoConnect = mongoConnect;
exports.session = sessionInstance;