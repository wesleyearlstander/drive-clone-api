const file = require('../models/file.model');
const folder = require('../models/folder.model')

const upload = (req, res) => {
  // TODO
  if (req.params.fileId === null) {
    return res.status(400).send({
      message: 'Bad request, file id was missing'
    })
  }
}


module.exports = {
  upload
};