const User = require("../model/User")
const Profile = require("../model/Profile")
const Address = require("../model/address");
const { uploadImageToCloudinary } = require("../utility/imageUploader");

exports.updateProfile = async(req,res) => {
try{
    const {firstName,lastName,gender,contactNumber,about,dateOfBirth,userId} = req.body;
    console.log(req.body,"this is req body")
    
    if(!userId){
        return res.status(500).json({
            success:false,
            message:"userId is required"
        })
    }

    const user = await User.findById(userId);
    if(!user){
        return res.status(500).json({
            success:false,
            message:"you are not valled user"
        })
    }

    const addInfoId = user.additionalInfo;
    const profile = await Profile.findByIdAndUpdate(addInfoId,{
        firstName : firstName ? firstName : user.firstName,
        lastName : lastName ? lastName : user.lastName,
        gender : gender ? gender : user.gender,
        contactNumber : contactNumber ? contactNumber :user.contactNumber,
        dateOfBirth : dateOfBirth ? dateOfBirth : user.dateOfBirth,
        about : about ? about :user.about
    },{new:true})

    const updateUser = await User.findById(userId)
    .populate("additionalInfo")
      .populate("address")
      .exec();

    return res.status(200).json({
        success:true,
        messeage:"updation successfull",
        data : updateUser
    })

}catch(error){
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"error occured in updating profile"
    })
}
}

exports.updateProfileImg  = async(req,res) =>{
    try{
    // fetchig image url
    const {userId} = req.body;
    const image = req.files.profileImage;

    console.log(req.body,req.files.profileImage)

    if(!userId){
        return res.status(400).json({
            success:false,
            message:"UserId is required"
        })
    }

    const userData = await User.findById(userId);
    
    if(!userData){
        return res.status(400).json({
            success:false,
            message:"You are not vallid user"
        }) 
    }

    const imageUrl = await uploadImageToCloudinary(image);

    const updateImg = await User.findByIdAndUpdate(userId,{
        image:imageUrl.secure_url
    },{new:true});
    
    const updateUser = await User.findById(userId)
    .populate("additionalInfo")
      .populate("address")
      .exec();
   
   return res.status(200).json({
    success:true,
    message:"profile img  updated suceesfully",
    data:updateUser,
})

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message:"Error occuring in updating profile image "
        }) 
    }
}


exports.addAddress = async(req,res) =>{
    try{
    //fetching data
    const {userId,name,phoneNumber,pincode,city,state,locality,address,alternatePhoneNumber=null,landmark} = req.body;
    
    //vallidation
    if(!userId ||!name || !phoneNumber || !pincode || !city || !state || !locality ||!address || !landmark ){
        return res.status(400).json({
            success:false,
            message:"all filds are required"
        })
    }

    const userData = await User.findById(userId);
    
    if(!userData){
        return res.status(400).json({
            success:false,
            message:"You are not vallid User"
        }) 
    }

    const addAddress = await Address.create({
        name:name,
        phoneNumber:phoneNumber,
        pincode:pincode,
        locality:locality,
        address:address,
        city:city,
        state:state,
        landmark:landmark,
        alternatePhoneNumber:alternatePhoneNumber
    })

    console.log(addAddress._id,"this is address")

    // pushing address id in userAddres array

    await User.findByIdAndUpdate(userId,{
        $push:{
            address:addAddress._id
        }
     },{new:true})

     const updateUser = await User.findById(userId)
     .populate("additionalInfo")
       .populate("address")
       .exec();
   
   return res.status(200).json({
    success:true,
    message:"address added suceesfully",
    data:updateUser
})


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message:"Error occuring in adding address"
        })    
    }
}


exports.deleteAddress = async(req,res) =>{
    try{
        const {userId,addresId} = req.body;

        if(!userId || !addresId){
            return res.status(400).json({
                success:false,
                message:"UserId is required"
            })
        }
    
        const userData = await User.findById(userId);
        
        if(!userData){
            return res.status(400).json({
                success:false,
                message:"You are not vallid User"
            }) 
        }

       await Address.findByIdAndDelete(addresId);

       await User.findByIdAndUpdate(userId,{
        $pull:{
            address : addresId
        }
       },{new:true})

       const updateUser = await User.findById(userId)
       .populate("additionalInfo")
         .populate("address")
         .exec();

       return res.status(200).json({
        success:true,
        message:"address deletead successfully",
        data:updateUser
    })
    
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message:"Error occuring in deleting  address"
        })    
    }
}


exports.updateAddress = async(req,res) => {
    try{
        const {userId,addresId} = req.body;

        console.log(req.body)
         
        const {name,phoneNumber,pincode,city,state,locality,address,alternatePhoneNumber=null,landmark} = req.body;
        if(!userId || !addresId){
            return res.status(400).json({
                success:false,
                message:"UserId is required"
            })
        }

        const userData = await User.findById(userId);
        
        if(!userData){
            return res.status(400).json({
                success:false,
                message:"You are not vallid User"
            }) 
        }

        const addressInfo = await Address.findById(addresId);
        if(!addressInfo){
            return res.status(400).json({
                success:false,
                message:"address id not vallid User"
            }) 
        }

        const updateAddress = await Address.findByIdAndUpdate(addresId,{
            name:name ? name :addressInfo.name ,
            phoneNumber:phoneNumber ? phoneNumber :addressInfo.phoneNumber,
            pincode:pincode ? pincode :addressInfo.pincode,
            locality:locality ? locality :addressInfo.locality,
            address:address ? address :addressInfo.address,
            city:city ?city  :addressInfo.city,
            state:state ? state :addressInfo.state,
            landmark:landmark ?landmark  :addressInfo.landmark,
            alternatePhoneNumber:alternatePhoneNumber ? alternatePhoneNumber : addressInfo.alternatePhoneNumber
        },{new:true})

        const updateUser = await User.findById(userId)
       .populate("additionalInfo")
         .populate("address")
         .exec();

       return res.status(200).json({
        success:true,
        message:"updation  successfully",
        data:updateUser
    })
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message:"Error occuring in updating  address"
        })   
    }
}


exports.chengePassword = async (req, res) => {
    try {
        //fetchin data
        const { email, password, confirmPassword, oldPassword } = req.body;
        //vallidation
       
        if (!email || !password || !confirmPassword || !oldPassword) {
            return res.status(500).json({
                success: false,
                message: "all filed are required",
            })
        }
        // matchin passwod
        if (password !== confirmPassword) {
            return res.status(500).json({
                success: false,
                message: "password is not matching",
            })
        }
      
        const user = await User.findOne({ email: email });

       
        if (await bcrypt.compare(oldPassword,user.password)) {
            const newhassedpass = await bcrypt.hash(password,10)
           await User.findByIdAndUpdate(
            {_id:user._id},
            {password:newhassedpass},
            {new:true}
           )
        }
        return res.status(200).json({
            success: true,
            messege: "password chenged success"
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring in doing login",
        })
    }
}