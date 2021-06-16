const { StatusCodes } = require('http-status-codes');
const path = require('path');
const appDir = path.dirname(require.main.filename);

const upload = (req, res) => {

  var startup_image = req.files.imageFile;
  var fileName = startup_image.name;

  startup_image.mv(appDir + '/public/' + fileName, function (err) {
    if (err) {
      res.status = StatusCodes.BAD_REQUEST;
      res.json({
        message: 'Error: Upload Failed',
        err
      });
    } else {
      res.status = StatusCodes.OK;
      res.json({
        message: 'Upload Success',
        err
      });
    }
  });

};

const download = (req, res) => {

  const fileName = req.body.fileName;
  const file = appDir + '/public/' + fileName;

  res.download(file);

};


module.exports = {
  upload,
  download
};