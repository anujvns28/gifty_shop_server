const express = require('express');
const router = express.Router();

const {
    createCategories,
    deleteCategorie,
    fetchCategories,
    updateCategoreis,
    categoryDetail
} = require("../controllers/categoreis");

// ********************************************************************************************************
//                                      categories
// ********************************************************************************************************

//creating categores
router.post("/createCategory", createCategories);
//update categores
router.post("/updateCategory",updateCategoreis);
//delete categores
router.post("/deleteCategories", deleteCategorie);
//fetchall categories
router.get("/fetchallCategory", fetchCategories);
// categoryinfo
router.post("/categoryInfo",categoryDetail)


module.exports = router