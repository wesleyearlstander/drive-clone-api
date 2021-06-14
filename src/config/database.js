const {MongoClient} = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

async function dbExecute(func, params) {

  const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@drive-clone-cluster.cuxyh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  let result;

  try {
    await client.connect();

    result = await func(client, ...params);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
  return result;
}

module.exports = dbExecute;