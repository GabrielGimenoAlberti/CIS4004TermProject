const express = require("express");
const router = express.Router();
const {
    getCategoryByID,
    getAllCategories
} = require("../controllers/categoryController");

router.get("/:id", getCategoryByID);
router.get("/", getAllCategories);

module.exports = router;