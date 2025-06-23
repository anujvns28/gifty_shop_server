const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
  categoriesName:{
    type: String,
    required: true
  }, 
  categoriesDesc: {
    type: String,
    required: true
  },
  subCategories: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SubCategories",
  }],
});

const categoreis = mongoose.model('Categories', categoriesSchema);


module.exports = categoreis;
