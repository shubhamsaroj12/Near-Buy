const router = require("express").Router();
const {
  signup,
  login,
  resetPassword,
  getUsers,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/users", getUsers);

module.exports = router;

