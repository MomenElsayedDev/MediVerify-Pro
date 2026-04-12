const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");
const crypto = require("crypto");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🧠 آخر دواء اتعرض
let lastMedicine = null;

// 🔢 Serial
function generateSerial() {
  return "MV-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

// 📅 Expiry
function generateExpiry() {
  const date = new Date();
  const months = Math.floor(Math.random() * 30) + 6;
  date.setMonth(date.getMonth() + months);
  return date;
}

// 🧠 AI with anti-repeat logic
async function getUniqueMedicine() {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 1.2,
    messages: [
      {
        role: "system",
        content: `
Return ONLY ONE medicine name.

DO NOT repeat the previous medicine: ${lastMedicine || "none"}.

Choose from:
Paracetamol, Ibuprofen, Amoxicillin, Omeprazole,
Metformin, Aspirin, Cetirizine, Azithromycin, Vitamin D3
        `,
      },
      {
        role: "user",
        content: "Give a different medicine than last time.",
      },
    ],
  });

  const med = response.choices[0].message.content.trim();

  lastMedicine = med; // 🧠 update memory

  return med;
}

// 🚀 ROUTE
router.post("/suggest", async (req, res) => {
  try {
    const medicineName = await getUniqueMedicine();

    const serial = generateSerial();
    const expiry = generateExpiry();

    const newMed = await Medicine.create({
      name: medicineName,
      brand: "Generated",
      serialNumber: serial,
      expiryDate: expiry,
      description: "AI generated medicine",
    });

    res.json({
      success: true,
      medicine: newMed,
      info: {
        name: medicineName,
        serial,
        expiry: expiry.toLocaleDateString("en-GB"),
      },
    });
  } catch (err) {
    console.error("🔥 AI Error:", err.message);

    res.status(500).json({
      success: false,
      message: "AI generation failed",
    });
  }
});

module.exports = router;