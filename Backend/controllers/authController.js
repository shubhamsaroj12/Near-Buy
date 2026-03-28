const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ msg: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashed,
    role,
  });

  await user.save();

  res.json({ msg: "Signup successful" });
};

// 🔹 LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "secret123");

  res.json({
    token,
    user,
  });
};