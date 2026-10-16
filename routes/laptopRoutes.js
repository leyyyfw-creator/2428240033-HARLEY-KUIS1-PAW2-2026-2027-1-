const express = require("express");
const Laptop = require("../models/Laptop");

const router = express.Router();

// GET /api/laptops - mengambil semua data laptop
router.get("/", async (req, res) => {
  try {
    const laptops = await Laptop.find();
    res.status(200).json(laptops);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data laptop", error: error.message });
  }
});

// GET /api/laptops/:id - mengambil satu data laptop
router.get("/:id", async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    if (!laptop) return res.status(404).json({ message: "Data laptop tidak ditemukan" });
    res.status(200).json(laptop);
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ message: "ID laptop tidak valid" });
    res.status(500).json({ message: "Gagal mengambil data laptop", error: error.message });
  }
});

// POST /api/laptops - menambahkan data laptop
router.post("/", async (req, res) => {
  try {
    const { merk_laptop, processor, harga } = req.body;
    const laptop = await Laptop.create({ merk_laptop, processor, harga });
    res.status(201).json(laptop);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Data laptop tidak valid", error: error.message });
    }
    res.status(500).json({ message: "Gagal menambahkan data laptop", error: error.message });
  }
});

// PUT /api/laptops/:id - memperbarui data laptop
router.put("/:id", async (req, res) => {
  try {
    const { merk_laptop, processor, harga } = req.body;
    const laptop = await Laptop.findByIdAndUpdate(
      req.params.id,
      { merk_laptop, processor, harga },
      { new: true, runValidators: true }
    );
    if (!laptop) return res.status(404).json({ message: "Data laptop tidak ditemukan" });
    res.status(200).json(laptop);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "ID atau data laptop tidak valid", error: error.message });
    }
    res.status(500).json({ message: "Gagal memperbarui data laptop", error: error.message });
  }
});

// DELETE /api/laptops/:id - menghapus data laptop
router.delete("/:id", async (req, res) => {
  try {
    const laptop = await Laptop.findByIdAndDelete(req.params.id);
    if (!laptop) return res.status(404).json({ message: "Data laptop tidak ditemukan" });
    res.status(200).json({ message: "Data laptop berhasil dihapus", data: laptop });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ message: "ID laptop tidak valid" });
    res.status(500).json({ message: "Gagal menghapus data laptop", error: error.message });
  }
});

module.exports = router;