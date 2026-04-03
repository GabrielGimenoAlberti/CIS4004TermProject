const Category = require("../models/Category");

const getCategoryByID = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found"});
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getCategoryByID,
    getAllCategories,
};