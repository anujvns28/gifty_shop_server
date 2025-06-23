const Categoreis = require("../model/Categories");
const Product = require("../model/Product");
const SubCategories = require("../model/SubCategories");
const { uploadImageToCloudinary } = require("../utility/imageUploader");

exports.createSubCategories = async (req, res) => {
  try {
    //fetching data
    const { name, desc, categoryId } = req.body;
    const image = req.files.image;
    //vallidatin
    if (!name || !desc || !image || !categoryId) {
      return res.status(500).json({
        success: false,
        message: "all filds are required",
      });
    }
    const url = await uploadImageToCloudinary(image);

    // create subCategories
    const newSubcategory = await SubCategories.create({
      name: name,
      desc: desc,
      image: url.secure_url,
    });

    // pushing category
    await Categoreis.findByIdAndUpdate(
      { _id: categoryId },
      {
        $push: {
          subCategories: newSubcategory._id,
        },
      },
      { new: true }
    );

    //return resonpse
    return res.status(200).json({
      success: true,
      message: "subCategories are created successfully",
      newSubcategory,
    });
  } catch (err) {
    console.log("err occured in creating categoris", err);
    return res.status(500).json({
      success: false,
      message: "error occured in creating Subcategoris",
    });
  }
};

//update subcategories
exports.updateSubCategories = async (req, res) => {
  try {
    //fetchign data
    const { name, desc, SubcategoryId } = req.body;
    //valldating
    if (!name || !desc || !SubcategoryId) {
      return res.status(500).json({
        success: false,
        message: "all filds are required",
      });
    }

    const isSubcategoryExist = await SubCategories.findById(SubcategoryId);

    if (!isSubcategoryExist) {
      return res.status(500).json({
        success: false,
        message: "this subCategory is not exist",
      });
    }

    // Check if image is provided
    let imageUrl;
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const url = await uploadImageToCloudinary(imageFile);
      imageUrl = url.secure_url;
    }

    const Subcategory = await SubCategories.findByIdAndUpdate(
      SubcategoryId,
      { name: name, desc: desc, image: imageUrl },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "SubCategories are updated successfully",
      Subcategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "error occured in updating Subcategoris",
    });
  }
};


// delating categories

exports.deleteSubCategories = async(req,res) =>{
    try{
       const {subCategoryId} = req.body;

       if(!subCategoryId){
        return res.status(500).json({
            success:false,
            message:"subcategoryId is required"
        })
       }
       
    const isSubcategoryExist = await SubCategories.findById(subCategoryId);
    
    if(!isSubcategoryExist){
        return res.status(500).json({
            success:false,
            message:"this SubCategories is not exist"
        })
    }

       await SubCategories.findByIdAndDelete(subCategoryId);

       return res.status(200).json({
        success:true,
        message:"SubCategories are delated",
         
    })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"error occured in delating Subcategoris"
        }) 
    }
}

// fetching categoriesWise subCategories
exports.categoryWiseSubCategories = async(req,res) =>{
    try{
     //fetching data
    const {categoryId} = req.body;
    console.log(req.body,"this is reqki body")

    if(!categoryId){
        return res.status(500).json({
            success:false,
            message:"CategoreisId is requirired"
        })
    }

    const iscategoryExist = await Categoreis.findById(categoryId);
    
    if(!iscategoryExist){
        return res.status(500).json({
            success:false,
            message:"this  is not vallid category"
        })
    }

    const subCategoryes = await Categoreis.findById(categoryId).
    populate("subCategorys").exec();
    

    return res.status(200).json({
        success:true,
        message:"all sub Category returned",
        subCategoryes
    })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"error occured in fetching Subcategoris"
        }) 
    }
}

exports.subCategoryWiseProduct = async(req,res) =>{
    try{
        const {subCategoryId} = req.body;
        console.log(subCategoryId,"subCategoryid this is")

        if(!subCategoryId){
            return res.status(500).json({
                success:false,
                message:"subCategory id is requireved"
            })
        }

        const subCategoryInfo = await SubCategories.findById(subCategoryId)
        .populate("product").exec();

        if(!subCategoryInfo){
            return res.status(500).json({
                success:false,
                message:"This is not valled categoryid"
            })
        }

        return res.status(200).json({
            success:true,
            Message:'Category info fetched successfully',
            data:subCategoryInfo
        })


    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error occured in fetching all subCategories product"
        })  
    }
}