// userController.js
const User = require('../Model/UserData');
const JWT = require('jsonwebtoken');

const jwtKey = "Rishikeshkumar";

async function signupValidation(req, res, next) {
    try {
        const response = await User.findOne({ email: req.body.email, isOtpVerified: true, vendor: req.body.vendor });
        if (response) {
            res.send("record already found");
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const isOtpVerified=async (req,res,next)=>{
  const result=await User.findOne({email:req.body.email,vendor:req.body.vendor})
 if(result){
  if(result.isOtpVeryfied){
    next()
  }
  else{
    res.send("Invalid Otp")
  }
 }
 else{
  res.send("record not found")
 }
  
}

async function register(req, res) {
    try {
        const result = await User.insertMany(req.body);
        console.log("result");
        console.log(result);
        if (result) {
            res.send(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function login(req, res) {
    
    try {
        const user = await User.findOne({ email: req.body.email,vendor:req.body.vendor });
         console.log(user)
        if (!user) {
          return res.send("record not found");
    
        }
           
          if (user.password === req.body.password) {
    
            //  const result = req.body.vendor?{ userId: user._id, email: user.email, name:user.name,vendor:true}:{ userId: user._id, email: user.email, name:user.name,vendor:false}
           
             const result=user
           
    
    
            // Generate JWT token
            JWT.sign({ result }, jwtKey, (err, token) => {
              if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
              }
              if(req.body.vendor===user.vendor){
              res.send({ result, auth: token });
              }
              else{
                res.send("record not found")
              }
            });
          } else {
            res.send("Incorrect password");
          }
        
        
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
}

async function otpVerification(req, res) {
    
      try{
      if(req.body.otp==='1234'){
        console.log("insert data")
        const response=await User.updateOne({ email: req.body.email,vendor:req.body.usertype }, { $set: { isOtpVeryfied:true } });
       res.send("this is a right otp")
      }
      else{
        res.send("Invalid Otp")
      }
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

async function Home(req,res){
      try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = JWT.verify(token, jwtKey);
    const user = decoded.result;

    if (user) {
      
      const userTypeMessage = user.company === 'customer' ? 'This is a customer page.' : 'This is a space provider dashboard.';
      res.send({ message: `Welcome ${user.name}! ${userTypeMessage}` });
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
    signupValidation,
    register,
    login,
    otpVerification,
    Home,
    isOtpVerified,
};
