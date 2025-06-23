const RatingAndReview = require("../model/RatingAndReview");
const User = require('../model/User');
const Product = require("../model/Product");
const mongoose = require("mongoose")

// Create a new rating and review
exports.createRating = async (req, res) => {
  try {
   
    const { rating, review, productId,userId } = req.body
    
    if(!rating || !review || !productId || !userId){
        return res.status(500).json({
            success:false,
            message:"all filds are required"
        })
    }

    // Check if the user has already reviewed this product
    const alreadyReviewed = await RatingAndReview.findOne({user:userId,product:productId});

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Product already reviewed by You",
      })
    }

    // Create a new rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      product: productId,
      user : userId,
    })

    // Add the rating and review to the product
    await Product.findByIdAndUpdate(productId, {
      $push: {
        ratingAndReviews: ratingReview,
      },
    })

    return res.status(201).json({
      success: true,
      message: "Rating and review created successfully",
      ratingReview,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}


exports.getRatingAndReview = async (req, res) => {
  try {
    const {productId} = req.body
    
    if(!productId){
        return res.status(500).json({
            success:false,
            message:"all filds are required"
        })
    }

    const averageRating = await RatingAndReview.aggregate([
        { $match: {product: new mongoose.Types.ObjectId(productId)} },
        { $group: {_id: null, average : { $avg: "$rating"} } },
    ])

    const allRatingAndReview = await Product.findById(productId)
                                .populate({
                                  path:"ratingAndReviews",
                                  populate:{
                                    path: "user"
                                  }
                                })
                                .exec();

 

    if (averageRating.length > 0) {
        return res.status(200).json({
            success: true,
            data : {
               averageRating:averageRating[0].average,
               ratingAndReviews:allRatingAndReview.ratingAndReviews
            }
           })
    }

    return res.status(200).json({
        success: true,
        data : {
           averageRating:0,
           ratingAndReviews:allRatingAndReview.ratingAndReviews
        }
       })


  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating for the course",
      error: error.message,
    })
  }
}

