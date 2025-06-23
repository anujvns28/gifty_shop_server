const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  productDes: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  productsImages: [{
    type: String,
    required: true
  }],
  mainImage: {
    type: String,
    required: true
  },
  forWhom: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cateogry"
  },
  customor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  discountPrice: {
    type: Number,
    required: true
  },
  ratingAndReviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "RatingAndReview"
  }],
})



const Product = mongoose.model('Product', productSchema);

module.exports = Product;


