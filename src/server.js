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
const { authMiddleware, authAdmin } = require('./middleware/auth');
const authWriter = require('./middleware/authWriter');
const fetchCategories = require('./middleware/fetchContent');
const methodOverride = require('method-override');
const writerRouter = require('./router/writer');
const editorRouter = require('./router/editorPage');
const forgetPasswordRouter = require('./router/forgetPassword');
const { editUser } = require('./controller/adminController');
const verifyOTPRouter = require('./router/verifyOTP');


const app = express();
const port = 8080;

configViewEngine(app)

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(authMiddleware);
app.use(fetchCategories);
app.use(bodyParser.json({limit: '50mb'}));
app.use(methodOverride('_method'));

app.use('/', webRouter);
app.use('/api/v1/signup', signUpRouter);
app.use('/api/v1/forgetPassword', forgetPasswordRouter);
app.use('/', profileRouter);
app.use('/admin', authAdmin, adminRouter);
app.use('/writer', authWriter, writerRouter);
app.use('/', editorRouter)
app.use('/', verifyOTPRouter);


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