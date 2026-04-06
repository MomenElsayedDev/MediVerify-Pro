const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");
const crypto = require("crypto");

// ==========================================
// [POST] /api/ai/suggest
// Generates a random medicine with AI health tips
// and saves it directly to the database
// ==========================================
router.post("/suggest", async (req, res) => {

  // List of medicines to pick from randomly
  const medicines = [
    { name: "Paracetamol", brand: "Panadol" },
    { name: "Ibuprofen", brand: "Brufen" },
    { name: "Amoxicillin", brand: "Amoxil" },
    { name: "Omeprazole", brand: "Losec" },
    { name: "Metformin", brand: "Glucophage" },
    { name: "Atorvastatin", brand: "Lipitor" },
    { name: "Aspirin", brand: "Aspocid" },
    { name: "Cetirizine", brand: "Zyrtec" },
    { name: "Azithromycin", brand: "Zithromax" },
    { name: "Vitamin D3", brand: "Vidrop" }
  ];

  // Pick a random medicine
  const randomMed = medicines[Math.floor(Math.random() * medicines.length)];

  // Generate a random expiry date between 1 and 3 years from now
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + Math.floor(Math.random() * 3) + 1);

  // Generate unique serial number
  const serialNumber = "MV-" + crypto.randomBytes(3).toString("hex").toUpperCase();

  try {
    // Save the medicine to the database
    const newMed = await Medicine.create({
      name: randomMed.name,
      brand: randomMed.brand,
      serialNumber,
      expiryDate,
      description: "AI Generated suggestion",
    });

    console.log("AI medicine saved:", newMed.name, serialNumber);

    res.json({
      success: true,
      advice: `✅ "${randomMed.name}" has been added to the medicine logs.\n💊 Serial: ${serialNumber}\n📅 Expires: ${expiryDate.toLocaleDateString("en-GB")}`,
      medicine: newMed
    });

  } catch (err) {
    console.error("AI Route Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to save medicine: " + err.message });
  }
});

module.exports = router;