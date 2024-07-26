const nodemailer = require("nodemailer");
const OtpModel = require("../model/otpModel");
const UserModel = require("../model/userModel");
const sendOTPMail = async(email,otp) =>{
    try {
        let mailer = nodemailer.createTransport({
            service: "gmail",
            secure:true,
            port: 465,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
        const response = await mailer.sendMail({
            from: "cloudhome@gmail.com",
            to: email,
            subject: "OTP for CloudHome",
            html:`
            <html>
              <body>
                <h1>Welcome to CloudHome!</h1>
                <p>Your One-Time Password (OTP) is: ${otp}</p>
                <p>Please use this OTP to verify your email address.</p>
              </body>
            </html>
            `
        });
        console.log(response);
        return true;
    } catch (error) {
        console.log("----------------------------");
        console.log(error);
        console.log("----------------------------");
        return false;   
     }
        
    }
   

const generateOtp = async (req, res) => {
  try {
      const { email,_id } = req.user;
      const restrictedTimeForOtp = 10*60*1000;
      const sendOTPMailed = await OtpModel.findOne({ email,createdAt:{
        $gte: Date.now() - restrictedTimeForOtp,
      }
    });
    if(sendOTPMailed){
        res.status(200).json({
            status: "success",
            message: "OTP already sent, please check your email",
            data: {},
        });
        return;
  
    }
      // generate random otp
      const randomOtp = Math.floor(1000 + Math.random() * 9000);
      // send otp to email address using nodemailer
      // check if email is sent successfully or not using sendOTPMail function
      const isMailSent =await sendOTPMail(email,randomOtp);
      if(!isMailSent){
         res.status(500).json({
            status: "fail",
            message: "Failed to send OTP",
            data: {},
        });
        return;
      }
      // create a entry in database with otp
     // verify if otp already exists 
      
        await OtpModel.create({
            email,
            otp: randomOtp,
            userId: _id,
        });
      
      res.status(201);
      res.json({
          status: "success",
          message: `Otp sent to ${email}`,
          data: {},
      });
  } catch (err) {
      console.log("----------------------------");
      console.log(err);
      console.log("----------------------------");
      res.status(500).json({
          status: "fail",
          message: "Internal Server Error",
          data: err,
      });
  }
};

const verifyOtp = async (req,res)=>{
    try {
        const {otp} = req.body;
        const {email} = req.user;
        // verify if otp is valid and not expired
        const restrictedTimeForOtp = 10*60*1000;
        const sendOTPMailed = await OtpModel.findOne({ email,createdAt:{
          $gte: Date.now() - restrictedTimeForOtp,
        }
      });
      if(!sendOTPMailed) {
         res.status(404).json({
            status: "fail",
            message: "Invalid OTP or OTP expired",
            data: {},
        });
        return;
      }
        // if valid then update user's isEmailVerified field in database
        const hashedOtp = sendOTPMailed.otp;
        const isCorrect = await sendOTPMailed.verifyOtp(otp,hashedOtp);
        if(!isCorrect){
            res.status(400).json({
                status: "fail",
                message: "Incorrect OTP",
                data: {},
            });
            return;
        }
        await UserModel.findOneAndUpdate({email},{isEmailVerified: true});
        res.status(200).json({
            status: "success",
            message: "Email verified successfully",
            data: {},
        });
        return;
       
    } catch (err) {
        console.log("----------------------------");
        console.log(err);
        console.log("----------------------------");
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
            data: err,
        });
    }

}

module.exports = { generateOtp,verifyOtp };