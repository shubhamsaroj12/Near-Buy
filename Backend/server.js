const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : "*";

app.locals.useFileDb = false;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

// TEST
app.get("/", (req, res) => {
  res.send("API Running ");
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB Connected ✅");
  } catch (err) {
    app.locals.useFileDb = true;
    console.error("MongoDB connection failed. Switching to local file storage mode.");
    console.error(
      "Check Atlas Network Access and add your current IP, or temporarily allow 0.0.0.0/0 for testing."
    );
    console.error(err.message);
  }

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}${app.locals.useFileDb ? " (local file DB mode)" : ""}`
    );
  });
}

startServer();

