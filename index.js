const cors = require('cors');
const { auth } = require('express-openid-connect');
const swaggerUI = require('swagger-ui-express');
const fileUpload = require('express-fileupload');
const { StatusCodes } = require('http-status-codes');
const express = require('express');
const app = express();
const port = process.env.PORT || '8000';
const {
  auth0Config,
  swaggerSpecs,
  emptyFolder,
} = require('./src/config');
const {
  folderRouter,
  userRouter,
  fileRouter,
} = require('./src/routes');
const {
  findUserTreeById,
  createFileTreeForUser,
  dbExecute,
} = require('./src/services');

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: StatusCodes.OK, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(express.json());
app.use(fileUpload());

app.use(cors(corsOptions));
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(express.json());
app.use(auth(auth0Config));

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use('/v1/users', userRouter);
app.use('/v1/files', fileRouter);
app.use('/v1/folders', folderRouter);

app.get('/', async (req, res) => {
  let result = await dbExecute(findUserTreeById, [
    req.oidc.user.sub,
  ]).catch(console.error);

  if (!result) {
    await dbExecute(createFileTreeForUser, [
      req.oidc.user.sub,
      emptyFolder,
    ]);
  }
  res.redirect('/api/docs');
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
