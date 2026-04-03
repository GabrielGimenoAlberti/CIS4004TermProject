const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
} = require("../controllers/userController");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);

module.exports = router;