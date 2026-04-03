const Category = require("../models/Category");

const categoryTypes = [
    "Music",
    "Sports",
    "Food",
    "Networking",
    "Festival",
    "Other"
];

const seedCategories = async () => {
    try {
        for (const name of categoryTypes) {
            const exists = await Category.findOne({ name });
            if (!exists) {
                await Category.create({ name });
                console.log(`Category ${name} seeded`);
            }
        }
    } catch(error) {
        console.error("Error seeding categories:", error);
    }
};

module.exports = seedCategories;