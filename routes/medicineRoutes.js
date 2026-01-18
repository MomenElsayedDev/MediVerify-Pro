const router = require("express").Router();
const Medicine = require("../models/Medicine");
const crypto = require("crypto");

// ==========================================
// [GET] Routes - Fetching Data
// ==========================================

// 1. Get all medicines (Sorted by newest first)
router.get("/all", async (req, res) => {
  try {
    const meds = await Medicine.find().sort({ createdAt: -1 });
    res.json({ success: true, data: meds });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Get a specific medicine by its Database ID
router.get("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res
        .status(404)
        .json({ success: false, message: "Medicine not found" });
    }

    res.json({ success: true, data: medicine });
  } catch (err) {
    // Handles invalid ObjectId format
    res
      .status(500)
      .json({ success: false, message: "Invalid ID format or server error" });
  }
});

// 3. Verify medicine via Serial Number
router.get("/verify/:serial", async (req, res) => {
  try {
    const { serial } = req.params;
    const medicine = await Medicine.findOne({
      serialNumber: serial.toUpperCase(),
    });

    if (medicine) {
      return res.json({ success: true, data: medicine });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Serial number not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// [POST] Routes - Creating Data
// ==========================================

// 4. Add a new medicine
router.post("/add", async (req, res) => {
  try {
    const { name, brand, expiryDate, description } = req.body;

    // Generate a unique Serial Number (e.g., MV-A1B2C3)
    const serialNumber =
      "MV-" + crypto.randomBytes(3).toString("hex").toUpperCase();

    const newMed = await Medicine.create({
      name,
      brand,
      expiryDate,
      description,
      serialNumber,
    });

    res.status(201).json({ success: true, data: newMed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// [PUT] Routes - Updating Data
// ==========================================

// 5. Update medicine details
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, expiryDate } = req.body;

    // Ensure the model name matches your Medicine model
    await Medicine.findByIdAndUpdate(id, { name, brand, expiryDate });

    res.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// [DELETE] Routes - Removing Data
// ==========================================

// 6. Delete a medicine
router.delete("/delete/:id", async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
