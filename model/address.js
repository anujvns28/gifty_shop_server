const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    phoneNumber:{
        type:String,
    },
    pincode:{
        type:String,
    },
     locality:{
        type:String,
    },
    address:{
       type:String,
    },
    city:{
        type:String,
    },
    state:{
        type:String,
    },
    landmark:{
        type:String,
    },
    alternatePhoneNumber:{
        type:String,
    },

})

module.exports = mongoose.model("Address",addressSchema)