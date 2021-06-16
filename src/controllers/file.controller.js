const { StatusCodes } = require('http-status-codes');

const upload = (req, res) => {
  const fileId = req.params.fileId;

  if (!fileId) {
    res.status = StatusCodes.BAD_REQUEST;
    res.json({
      message: 'BadRequest',
    });
  } else {
    res.status = StatusCodes.OK;
    res.json({
      message: `File ID: ${fileId} uploaded`,
    });
  }
};

module.exports = {
  upload,
};
