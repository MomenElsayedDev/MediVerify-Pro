const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    serialNumber: { type: String, unique: true, required: true },
    expiryDate: { type: Date, required: true },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Medicine", MedicineSchema);