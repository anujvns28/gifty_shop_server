const express = require('express');
const router = express.Router();

const {
    createSubCategories,
    deleteSubCategories,
    updateSubCategories,
    categoryWiseSubCategories,
    subCategoryWiseProduct
} = require('../controllers/subCategoreis');


// ********************************************************************************************************
//                                     sub categories routes
// ********************************************************************************************************

//creating categores
router.post("/createSubCategory", createSubCategories);
//update categores
router.post("/updateSubCategory", updateSubCategories);
//delete categores
router.post("/deleteSubCategories", deleteSubCategories);
//fetchall categories
router.post("/fetchallSubCategory",categoryWiseSubCategories);
// fetchall subCategorywise product
router.post("/subCategoryProduct",subCategoryWiseProduct)
module.exports = router