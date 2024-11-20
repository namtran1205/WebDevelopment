const express = require('express');
const path = require('path');
const webRouter = require('./router/web');
const configViewEngine = require('./config/viewEngine');
const connectDB = require('./db/connectDB');

const app = express();
const port = 8080;

configViewEngine(app)
app.use('/', webRouter);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () =>
      console.log(`Server running at http://127.0.0.1:${port}/`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();