

// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userController = require('./Controllers/userControllers');


const app = express();
app.use(express.json());
app.use(express.static('uploads'));
app.use(cors());

// Connect to MongoDB
require('./Db/config')


app.post('/register', userController.signupValidation, userController.register);
app.post('/login',userController.isOtpVerified, userController.login);
app.post('/otpverification', userController.otpVerification);
app.get('/home',userController.Home)

app.listen(4500, () => {
    console.log('Server is running on port 4500');
});




