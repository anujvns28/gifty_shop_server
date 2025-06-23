const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    secure: false,
});


exports.mailSend = async(email,title,body) =>{
  try{
    const info = await transporter.sendMail({
        from: `This is from Gifty_shop_2 ${process.env.MAIL_USER}`,
        to: email,
        subject: title,
        html: body
      });
    
      console.log("Message sent: %s", info.messageId);
  }catch(error){
    console.log(error,"error occeurd in sendimg mail")
    return res.status(500).json({
        success:false,
        message:"Error occured"
    })
  }
}

