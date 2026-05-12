const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.static("public"));

// koneksi MySQL (Laragon)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // default laragon kosong
  database: "kasir_db"
});

// cek koneksi
db.connect((err) => {
  if (err) {
    console.log("Koneksi gagal:", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});


// ==========================
// API SIMPAN TRANSAKSI
// ==========================
app.post("/api/transaksi", (req, res) => {
  const { data, total, bayar, kembalian } = req.body;

  console.log("DATA MASUK:", req.body); // debug

  // simpan ke tabel transaksi
  const sqlTransaksi = `
    INSERT INTO transaksi (total, bayar, kembalian)
    VALUES (?, ?, ?)
  `;

  db.query(sqlTransaksi, [total, bayar, kembalian], (err, result) => {
    if (err) {
      console.log("ERROR TRANSAKSI:", err);
      return res.json({ message: "Gagal simpan transaksi" });
    }

    const transaksiId = result.insertId;

    // simpan detail barang
    data.forEach((item) => {
      const subtotal = item.harga * item.jumlah;

      const sqlDetail = `
        INSERT INTO detail_transaksi 
        (transaksi_id, nama_barang, harga, jumlah, subtotal)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(sqlDetail, [
        transaksiId,
        item.nama,
        item.harga,
        item.jumlah,
        subtotal
      ], (err) => {
        if (err) {
          console.log("ERROR DETAIL:", err);
        }
      });
    });

    res.json({ message: "Transaksi berhasil masuk database ✅" });
  });
});


// ==========================
// API AMBIL DATA TRANSAKSI
// ==========================
app.get("/api/transaksi", (req, res) => {
  db.query("SELECT * FROM transaksi", (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }

    res.json(result);
  });
});


// ==========================
// JALANKAN SERVER
// ==========================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server jalan di port ${PORT}`);
});


app.get("/api/transaksi-detail", (req, res) => {
  const sql = `
    SELECT 
      t.id, t.tanggal, t.total, t.bayar, t.kembalian,
      d.nama_barang, d.harga, d.jumlah, d.subtotal
    FROM transaksi t
    LEFT JOIN detail_transaksi d ON t.id = d.transaksi_id
    ORDER BY t.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }

    res.json(result);
  });
});