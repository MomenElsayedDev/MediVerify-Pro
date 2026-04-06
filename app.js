const dotenv = require("dotenv");
dotenv.config(); // Must be first before requiring routes

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server is running on port ${process.env.PORT}`),
    );
  })
  .catch((err) => console.error("DB Connection Error:", err));