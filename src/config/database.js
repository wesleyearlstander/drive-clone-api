const {MongoClient} = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@drive-clone-cluster.cuxyh.mongodb.net/test?retryWrites=true&w=majority`;
const dbClient = new MongoClient(uri);

module.exports = dbClient;