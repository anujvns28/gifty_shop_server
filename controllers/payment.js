const { instance } = require("../config/razorpay");
const { productBuyEmail } = require("../mailTemplate/PaymentSuccessfully");
const Product = require("../model/Product");
const User = require("../model/User");
const Address = require("../model/address");
require("dotenv").config();

const crypto = require("crypto");
const { mailSend } = require("../utility/mailSender");

//initiate the razorpay order
exports.capturePayment = async (req, res) => {
  const { shouses } = req.body;

  if (shouses.length === 0) {
    return res.json({
      success: false,
      message: "Please provide shouse Id",
    });
  }

  let totalAmount = 0;

  for (const shouse_id of shouses) {
    let shouse;
    try {
      shouse = await Product.findById(shouse_id);
      if (!shouse) {
        return res.status(200).json({
          success: false,
          message: "Could not find the shouse",
        });
      }

      totalAmount += shouse.price;
    } catch (error) {
      console.log(error, "eror occuring");
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  const currency = "INR";
  const options = {
    amount: totalAmount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse, "this is payment response");
    res.json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    console.log(error, "erroro occuring ji");
    return res.status(500).json({
      success: false,
      mesage: "Could not Irnitiate Orde",
    });
  }
};


//verify the payment
exports.verifyPayment = async(req, res) => {
    console.log(req.body,"veryfing me aapka svagat hai")
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const shouses = req.body?.shouses;
    const userId = req.body.userId;
    const addresId = req.body.addressId
    

    console.log(razorpay_order_id,razorpay_payment_id,razorpay_signature,shouses,userId)

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !shouses || !userId) {
            return res.status(200).json({
                success:false,
                 message:"Payment Failed"
            });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.REZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");


        console.log("truelove",expectedSignature === razorpay_signature,expectedSignature , razorpay_signature)

        if(expectedSignature === razorpay_signature) {
            if(razorpay_signature) {
            //product ko user ke khate me dal do 
           await addProduct(shouses,userId,addresId,res)
            //return res
            return res.status(200).json({success:true,
                 message:"Payment Verified"
            });
        }
        return res.status(200).json({
            success:"false", 
            message:"Payment Failed"
        });

}
} 


const addProduct = async(shouses, userId,addresId,res) => {
   
       if(!shouses || !userId) {
           return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
       }
   
       for(const shousesId of shouses) {

           try{
               //find the course and enroll the student in it
           const addUser = await User.findOneAndUpdate(
               {_id:userId},
               {$push:{products:shousesId}},
   
               {new:true},
           );

           
   
           if(!addUser) {
               return res.status(500).json({
                success:false,
                message:"You are not vallied user"
            });
           }

           const shouseData = await Product.findByIdAndUpdate(shousesId,{
            $push:{
                customor : userId 
            }
           },{new:true});

           const address = await Address.findById(addresId);
        
        //    console.log(addresId,address,"this is printig address")

               
        // customor ko mail send kareo
            await mailSend(
              addUser.email,
              `Successfully bought ${shouseData.productName}`,
              productBuyEmail(
                addUser.firstName,
                address,
                `giftyshop78@gmail.com/${shousesId}`
              )
            );    
           
           }
           catch(error) {
               console.log("error occuring in varyfing payment ",error);
               return res.status(500).json({success:false, message:error,});
           }
       }
   
   }