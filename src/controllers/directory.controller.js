async function findUserTreeById(client, _id) {
  let res = await client.db('drive-clone-db').collection('userFileTrees').findOne({_id});
  console.log("res in here:", res);
  return res;
}

async function createFileTreeForUser(client, sub, initialFileTree) {
  let res = await client.db('drive-clone-db').collection('userFileTrees').insertOne({ _id: sub, ...initialFileTree });
  return res;
}

module.exports = {
  findUserTreeById,
  createFileTreeForUser
};