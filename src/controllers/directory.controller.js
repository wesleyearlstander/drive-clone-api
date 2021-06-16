async function findUserTreeById(client, _id) {
  let res = await client
    .db('drive-clone-db')
    .collection('userFileTrees')
    .findOne({ _id });
  return res;
}

async function createFileTreeForUser(client, sub, initialFileTree) {
  let res = await client
    .db('drive-clone-db')
    .collection('userFileTrees')
    .insertOne({ _id: sub, ...initialFileTree });

  return res;
}

async function updateFileTreeForUser(client, sub, updatedFileTree) {
  const res = await client
    .db('drive-clone-db')
    .collection('userFileTrees')
    .replaceOne({ _id: sub }, { module: updatedFileTree });

  return res;
}

module.exports = {
  findUserTreeById,
  createFileTreeForUser,
  updateFileTreeForUser,
};
