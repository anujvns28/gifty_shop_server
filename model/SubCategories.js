const mongoose = require('mongoose');

const subCategoriesSchema = new mongoose.Schema({
    name:{
    type: String,
    required: true
  }, 
  desc: {
    type: String,
    required: true
  },
  image:{
    type:String,
    required:true
  },
  product: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
  }],
});

const subCategoreis = mongoose.model('SubCategories', subCategoriesSchema);

module.exports = subCategoreis;
