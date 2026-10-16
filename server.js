require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const laptopRoutes = require("./routes/laptopRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "REST API Manajemen Data Laptop aktif" });
});

app.use("/api/laptops", laptopRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

async function startServer() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI belum diatur. Buat file .env berdasarkan .env.example.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Berhasil terhubung ke MongoDB");
    app.listen(PORT, () => {
      console.log("API berjalan di http://localhost:" + PORT);
    });
  } catch (error) {
    console.error("Gagal terhubung ke MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();