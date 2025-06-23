const Product = require("../model/Product");
const SubCategoreis = require("../model/SubCategories");
const User = require('../model/User');
const { uploadImageToCloudinary } = require("../utility/imageUploader");


exports.createProduct = async (req, res) => {
    try {
        const {
            userId,
            productName,
            productDes,
            price,
            forWhom,
            color,
            discountPrice,
            subCategory,
            category
        } = req.body;

        const mainImage = req.files.mainImage
        const subImages = [];

        Object.keys(req.files).forEach((key) => {
            if (key.startsWith("productsImages[")) {
                subImages.push(req.files[key]);
            }
        })

        //  vallidation
        if (!userId ||
            !productName ||
            !productDes ||
            !price ||
            !forWhom ||
            !color ||
            !discountPrice ||
            !subImages ||
            !mainImage ||
            !subCategory ||
            !category
        ) {
            return res.status(500).json({
                success: false,
                message: "All filds are required"
            })
        }

        //upload image
        const mainImageUrl = await uploadImageToCloudinary(mainImage);

        const subImagesUrl = await Promise.all(subImages.map(async (image) => {
            const url = await uploadImageToCloudinary(image);
            return url.secure_url;
        }));

        console.log(subImagesUrl, "this is sub images urld")

        // create product
        const product = await Product.create({
            productName: productName,
            productDes: productDes,
            price: price,
            productsImages: subImagesUrl,
            subCategory: subCategory,
            category: category,
            mainImage: mainImageUrl.secure_url,
            forWhom: forWhom,
            color: color,
            discountPrice: discountPrice
        })

        // update user product or push this product id

        await User.findByIdAndUpdate(userId, {
            $push: {
                products: product._id
            }
        }, { new: true });

        // update subcategory
        await SubCategoreis.findByIdAndUpdate(subCategory, {
            $push: {
                product: product._id
            }
        }, { new: true })

        return res.status(200).json({
            success: true,
            message: "product cretaed sucessfully",
            data: product
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error occured in createing product"
        })
    }
}


exports.getSingleProduct = async (req, res) => {
    try {
        const productId = req.body.productId;

        if (!productId) {
            return res.status(500).json({
                success: false,
                message: "Product id is required"
            })
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(500).json({
                success: false,
                message: "This is not vallid product id"
            })
        }

        return res.status(200).json({
            success: true,
            message: "product info fetched successfully",
            data: product
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occured in fetching single product information"
        })
    }
}


exports.userProduct = async(req,res) => {
    try{
       const userId = req.body.userId;

       if(!userId){
        return res.status(500).json({
            success: false,
            message: "user id is required"
        })
       }

       const user = await User.findById(userId).populate("products").exec();
       if(!user){
        return res.status(500).json({
            success: false,
            message: "You are not vallied user"
        })
       }

       return res.status(200).json({
        success: true,
        message: "product  fetched successfully",
        data: user.products
    })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error occured in fetching single product information"
        }) 
    }
}


exports.changeDiscount = async(req,res) => {
    try{
       const {productId,price,discountPrice} = req.body;

       console.log(req.body)

       if(!productId || !price || !discountPrice){
        return res.status(500).json({
            success: false,
            message: "all filds are required"
        })
       }

       const product = await Product.findById(productId);
       if(!product){
        return res.status(500).json({
            success: false,
            message: "Product is not vallied"
        })
       }

       await Product.findByIdAndUpdate(productId,{
         price : price,
         discountPrice : discountPrice
       },{new:true})

       return res.status(200).json({
        success: true,
        message: "product  updated successfully",
    })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error occured in changing discount"
        }) 
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const {
            productName,
            productDes,
            price,
            forWhom,
            color,
            discountPrice,
            subCategory,
            category,
        } = req.body;

       
        const editedImage = req.body["editedImage[]"];
        const productId = req.body._id;
        const mainImage = req.files ? req.files.mainImage : undefined
        const subImages = [];

        if(req.files){
            Object.keys(req.files).forEach((key) => {
                if (key.startsWith("productsImages[")) {
                    subImages.push(req.files[key]);
                }
            })
        }

        //  console.log(req.files,"files")
        // console.log(editedImage)

        //  vallidation
        if (
            !productName ||
            !productDes ||
            !price ||
            !forWhom ||
            !color ||
            !discountPrice ||
            !subCategory ||
            !category ||
            !productId
        ) {
            return res.status(500).json({
                success: false,
                message: "All filds are required"
            })
        }

        const productData = await Product.findById(productId);
        // console.log(productData);
        if(!productData){
            return res.status(500).json({
                success: false,
                message: "Product id is not vallied"
            })
        }
 
        //upload image
        let mainImageUrl
        if(mainImage){
            mainImageUrl = await uploadImageToCloudinary(mainImage);
        }

        console.log(req.body, "this is edited image") 

        let prevImages
        if((editedImage != -1) && editedImage.length>0){
            prevImages = productData.productsImages;
            let count = 0;
            const subImagesUrl = await Promise.all(subImages.map(async (image) => {
                const url = await uploadImageToCloudinary(image);
                return url.secure_url;
            }));

             // update subimages image
              editedImage.map((item) => {
                prevImages.map((image,index) => {
                    if(Number(item) == Number(index)){
                        console.log("comming")
                        prevImages[Number(item)] = subImagesUrl[count];
                        count++;
                    }
                    
                    if(item >= prevImages.length){
                        prevImages.push(subImagesUrl[count]);
                        count++;
                    }
                })
            })
            
        }

       
        // create product
        const product = await Product.findByIdAndUpdate(productId,{
            productName: productName,
            productDes: productDes,
            price: price,
            productsImages: subImages.length>0 ? prevImages : productData.productsImages,
            subCategory: subCategory,
            category: category,
            mainImage: mainImage ? mainImageUrl.secure_url : productData.mainImage,
            forWhom: forWhom,
            color: color,
            discountPrice: discountPrice
        })

        return res.status(200).json({
            success: true,
            message: "product cretaed sucessfully",
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error occured in createing product"
        })
    }
}

exports.deleteProduct = async(req,res) => {
    try{
        const {productId,userId,subCategoryId} = req.body;
 
 
        if(!productId || !userId || !subCategoryId){
         return res.status(500).json({
             success: false,
             message: "all filds are required"
         })
        }
 
        const product = await Product.findById(productId);
        if(!product){
         return res.status(500).json({
             success: false,
             message: "Product is not vallied"
         })
        }
 
        await Product.findByIdAndDelete(productId);

        await User.findByIdAndUpdate(userId,{
            $pull:{
                products : productId
            }
        },{new:true})

        await SubCategoreis.findByIdAndUpdate(subCategoryId,{
            $pull : {
             product : productId   
            }
        })
 
        return res.status(200).json({
         success: true,
         message: "product  Delted successfully successfully",
     })
 
     }catch(error){
        console.log(error)
         return res.status(500).json({
             success: false,
             message: "Error occured in delteing product"
         }) 
     } 
}

exports.searchProduct = async(req,res) => {
    try{
        const proName = req.body.userInput;
 
         
        if(!proName){
            return res.status(400).json({
                success :false,
                message:"input is required"
            })
        }

        const products = await Product.find(
            {
                "$or": [
                    { "productName": { $regex: proName, $options: 'i' } },
                    { "productDes": { $regex: proName, $options: 'i' } },
                ]
            }
        )

        

        return res.status(200).json({
            success:true,
            shouses:products
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error occured in searching api"
        })
    }
}

