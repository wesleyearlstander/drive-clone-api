const cors = require('cors');
const { auth } = require('express-openid-connect');
const swaggerUI = require('swagger-ui-express');
const fileUpload = require('express-fileupload');
const { StatusCodes } = require('http-status-codes');
const express = require('express');
const app = express();
const port = process.env.PORT || '8000';

const swaggerSpecs = require('./src/config/swagger');
const auth0Config = require('./src/config/auth0');

const userRouter = require('./src/routes/user.routes');
const fileRouter = require('./src/routes/file.routes');
const dirRouter = require('./src/routes/directory.routes');

const { findUserTreeById, createFileTreeForUser } = require('./src/controllers/directory.controller');
const dbExecute = require('./src/config/database');
const emptyFolder = require('./src/config/emptyFolder');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: StatusCodes.OK // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(express.json());
app.use(fileUpload());

app.use(cors(corsOptions));
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(auth0Config));
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use('/user', userRouter);
app.use('/file', fileRouter);
app.use('/directory', dirRouter);

app.get('/', async (req, res) => {

  let result = await dbExecute(findUserTreeById, [req.oidc.user.sub]).catch(console.error);

  if (!result) {
    await dbExecute(createFileTreeForUser, [req.oidc.user.sub, emptyFolder]);
  }
  res.redirect('/api/docs');
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});