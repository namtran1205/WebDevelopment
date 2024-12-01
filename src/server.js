const express = require('express');
const path = require('path');
const webRouter = require('./router/web');
const configViewEngine = require('./config/viewEngine');
const connectDB = require('./db/connectDB');
const signUpRouter = require('./router/signUpRouter');
const profileRouter = require('./router/profile');
const adminRouter = require('./router/admin');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/auth');
const methodOverride = require('method-override');
const createPageRouter = require('./router/createPage');

const app = express();
const port = 8081;

configViewEngine(app)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authMiddleware);
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use('/api/v1/signup', signUpRouter);
app.use('/', profileRouter);
app.use('/admin', adminRouter);
app.use('/', webRouter);
app.use('/', createPageRouter);


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