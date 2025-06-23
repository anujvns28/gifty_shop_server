const OTP = require("../model/Otp");
const User = require("../model/User");
const Address = require("../model/address")
const otpGenerator = require('otp-generator');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { mailSend } = require("../utility/mailSender");
const Profile = require("../model/Profile");
const crypto = require("crypto")


exports.sendOtp = async(req,res) => {
    try{
    // fetching email
    const {email} = req.body;

    if(!email){
        return res.status(500).json({
            success:false,
            message:"Email is requird"
        })
    }

    const user = await User.findOne({email:email})
    console.log(user)
    if(user){
        return res.status(500).json({
            success:false,
            message:"User is alredy reguistered"
        })
    }

    const otp = otpGenerator.generate(6, {
         upperCaseAlphabets: false,
         specialChars: false ,
         lowerCaseAlphabets:false,
    });

    const otpBody = {
        email:email,
        otp:otp
    }

    const data = await OTP.create(otpBody);
    
    // send email
     await mailSend(email,"Email Varifaction",otp)

    return res.status(200).json({
        success:true,
        message:"Otp genrated successfully",
        data:data
    })

    }catch(error){
     console.log(error)
     return res.status(500).json({
        success:false,
        message:"Error occerured in sending otp",
     }) 
    }
}

// signup
exports.signUp = async(req,res) => {
    try{
    //fetchin data
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        otp,
      } = req.body

      console.log(req.body,"this is body")
      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !otp ||
        !accountType
      ) {
        return res.status(403).send({
          success: false,
          message: "All Fields are required",
        })
      }

       // Check if password and confirm password match
    if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Password and Confirm Password do not match. Please try again.",
        })
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists. Please sign in to continue.",
        })
      }

     //recent otp
     const recentOtp = await OTP.findOne({email:email}).sort({createdAt:-1})
     
     console.log(recentOtp.otp)
    if (recentOtp.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    } else if (Number(otp) !== recentOtp.otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid2",
      })
    }

 // Hash the password
 const hashedPassword = await bcrypt.hash(password, 10)

 const profileDetails = await Profile.create({
    gender: null,
    dateOfBirth: null,
    about: null,
    contactNumber: null,
  })

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    accountType: accountType,
    profileDetail: profileDetails._id,
    image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
  })

  return res.status(200).json({
    success: true,
    user,
    message: "User registered successfully",
  })

    }catch(error){
        console.log(error)
        return res.status(500).json({
           success:false,
           message:"Error occerured in Signup form",
        })   
    }
}

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body
  
      // Check if email or password is missing
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: `Please Fill up All the Required Fields`,
        })
      }
  
      // Find user with provided email
      const user = await User.findOne({ email })
      .populate("additionalInfo")
      .populate("address")
      .exec();

  
      // If user not found with provided email
      if (!user) {
        return res.status(401).json({
          success: false,
          message: `User is not Registered with Us Please SignUp to Continue`,
        })
      }
  
      //  Compare Password
      if(await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { email: user.email, id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        )

        res.status(200).json({
          success: true,
          user,
          token,
          message: `User Login Success`,
        })
      } else {
        return res.status(401).json({
          success: false,
          message: `Password is incorrect`,
        })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: `Login Failure Please Try Again`,
      })
    }
  }


exports.sendResetPasswordMail = async(req,res) => {
  try{
   const email = req.body.email;
   
   if(!email){
    return res.status(400).json({
      success:false,
      message:"email is required"
    })
   }

   const resetId = crypto.randomUUID();
   
  const resetUrl = `https://shousedekho.vercel.app/update-password/${resetId}`
  // send mail
  await mailSend(email,"Reset Password Email",resetUrl);

  // update user token
  await User.findOneAndUpdate({email:email},{
    token:resetId
  },{new:true})
   
   return res.status(200).json({
    success:true,
    messeage:"reset mail send"
   })

  }catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"error occured in sending reset mail"
    })
  }
}  

exports.updatePassword = async(req,res) => {
  try{
  const {password,confirmPassword,token} = req.body;

  if(!password || !confirmPassword || !token){
    return res.status(400).json({
      success:false,
      message:"all fild are required"
    })
  }

  if(password !== confirmPassword){
    return res.status(400).json({
      success:false,
      message:"Passord not match"
    })
  }

  const user = await User.findOne({token:token});

  if(!user){
    return res.status(400).json({
      success:false,
      message:"token is not vallied"
    })
  }

  // has passwod
  const hashedPassword = await bcrypt.hash(password, 10)

  await User.findByIdAndUpdate(user._id,{
    password:hashedPassword
  },{new:true})


  return res.status(200).json({
    success:"true",
    message:"Password updated successfully"
  })

  }catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:'error occured in updating password'
    })
  }
}