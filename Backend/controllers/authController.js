const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { getUsers, saveUsers } = require("../lib/fileStore");

// 🔹 SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (req.app.locals.useFileDb) {
      const users = await getUsers();
      const exist = users.find((user) => user.email === email);
      if (exist) return res.status(400).json({ msg: "User already exists" });

      const hashed = await bcrypt.hash(password, 10);
      users.push({
        _id: crypto.randomUUID(),
        name,
        email,
        password: hashed,
        role,
      });

      await saveUsers(users);
      return res.json({ msg: "Signup successful (local storage mode)" });
    }

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
  } catch (error) {
    res.status(500).json({ msg: "Signup failed", error: error.message });
  }
};

// 🔹 LOGIN
exports.login = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT secret is not configured" });
    }

    const { email, password } = req.body;

    if (req.app.locals.useFileDb) {
      const users = await getUsers();
      const user = users.find((item) => item.email === email);
      if (!user) return res.status(400).json({ msg: "User not found" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ msg: "Wrong password" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ msg: "Login failed", error: error.message });
  }
};

// 🔹 RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ msg: "Email and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ msg: "New password must be at least 6 characters long" });
    }

    if (req.app.locals.useFileDb) {
      const users = await getUsers();
      const userIndex = users.findIndex((user) => user.email === email);
      if (userIndex === -1) return res.status(404).json({ msg: "User not found" });

      users[userIndex].password = await bcrypt.hash(newPassword, 10);
      await saveUsers(users);
      return res.json({ msg: "Password updated successfully" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Reset password failed", error: error.message });
  }
};

// 🔹 GET USERS
exports.getUsers = async (req, res) => {
  try {
    if (req.app.locals.useFileDb) {
      const users = await getUsers();
      return res.json(
        users.map((user) => {
          const safeUser = { ...user };
          delete safeUser.password;
          return safeUser;
        })
      );
    }

    const users = await User.find({}, "-password").sort({ _id: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Users fetch failed", error: error.message });
  }
};
