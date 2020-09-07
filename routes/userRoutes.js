const express = require("express");
const {
  registerUser,
  loginUser,
  postToCart,
  getUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/addToCart", postToCart);
router.get("/getUser/:userEmail", getUser);

module.exports = router;
