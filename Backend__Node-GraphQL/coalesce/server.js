const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const path = require('path');
mongoose.set('useFindAndModify', false);

const MONGODB_URI = `
  mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_USER_PW}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true
`;

const graphQlSchema = require('./schema/index');
const graphQlResolver = require('./resolvers/index');
const auth = require('./middlewares/check-auth');
const fileUpload = require('./middlewares/file-upload');

const app = express();

app.use('/images/posts', express.static(path.join('images', 'posts')));
app.use('/images/pfp', express.static(path.join('images', 'pfp')));
app.use('/images/banner', express.static(path.join('images', 'banner')));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.put('/post-image', fileUpload.single('image'), (req, res, next) => {
  let path = '';
  if (req.file) {
    path = req.file.path;
  }
  return res.status(201).json({ filePath: path });
});

app.put(
  '/profile-images',
  fileUpload.fields([
    { name: 'pfp', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  (req, res, next) => {
    let paths = {
      pfpPath: undefined,
      bannerPath: undefined
    };
    if (req.files['pfp']) {
      paths = { ...paths, pfpPath: req.files['pfp'][0].path };
    }
    if (req.files['banner']) {
      paths = { ...paths, bannerPath: req.files['banner'][0].path };
    }
    return res.status(201).json(paths);
  }
);

app.use(
  '/coalesce',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data || 'Something went wrong....';
      const message = err.message || 'An error occurred';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    }
  })
);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.DEV_PORT || 4000);
    console.log('Connected to the Database!');
  })
  .catch((err) => {
    console.log('Error establishing the connection! :-> ', err);
  });
