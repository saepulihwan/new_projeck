let data = [];
let total = 0;


// =======================
// TAMBAH BARANG
// =======================
function tambah() {

  let nama = document.getElementById("nama").value;

  let harga = parseInt(
    document.getElementById("harga").value
  );

  let jumlah = parseInt(
    document.getElementById("jumlah").value
  );

  if (!nama || !harga || !jumlah) {
    alert("Lengkapi data!");
    return;
  }

  data.push({
    nama,
    harga,
    jumlah
  });

  render();

  document.getElementById("nama").value = "";
  document.getElementById("harga").value = "";
  document.getElementById("jumlah").value = "";

}


// =======================
// RENDER LIST
// =======================
function render() {

  let list = document.getElementById("list");

  list.innerHTML = "";

  total = 0;

  data.forEach((item, index) => {

    let subtotal = item.harga * item.jumlah;

    total += subtotal;

    let li = document.createElement("li");

    li.className =
      "flex justify-between bg-slate-700 p-3 rounded";

    li.innerHTML = `
      <div>
        <p class="font-semibold">${item.nama}</p>
        <p class="text-sm text-gray-300">
          ${item.jumlah} x Rp ${item.harga}
        </p>
      </div>

      <div class="text-right">
        <p class="text-green-400 font-bold">
          Rp ${subtotal}
        </p>

        <button
          onclick="hapus(${index})"
          class="text-red-400 text-sm">

          hapus

        </button>
      </div>
    `;

    list.appendChild(li);

  });

  document.getElementById("total").innerText = total;

}


// =======================
// HAPUS
// =======================
function hapus(index) {

  data.splice(index, 1);

  render();

}


// =======================
// RESET
// =======================
function resetKasir() {

  data = [];

  render();

  document.getElementById("kembalian").innerText = 0;

}


// =======================
// BAYAR
// =======================
function bayarTransaksi() {

  // CEK APAKAH ADA BARANG
  if (data.length === 0) {
    alert("Belum ada barang!");
    return;
  }

  // AMBIL INPUT BAYAR
  let bayar = parseInt(
    document.getElementById("bayar").value
  );

  // CEK INPUT KOSONG
  if (isNaN(bayar)) {
    alert("Masukkan nominal bayar!");
    return;
  }

  // CEK UANG KURANG
  if (bayar < total) {
    alert("Uang kurang!");
    return;
  }

  // HITUNG KEMBALIAN
  let kembalian = bayar - total;

  document.getElementById("kembalian")
    .innerText = kembalian;


  // SIMPAN KE DATABASE
  fetch("/api/transaksi", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      data,
      total,
      bayar,
      kembalian
    })

  })

  .then(res => res.json())

  .then(res => {

    alert(res.message);

    // =======================
    // TAMPILKAN STRUK
    // =======================
    document.getElementById("struk")
      .classList.remove("hidden");
      // HILANGKAN STRUK OTOMATIS
      setTimeout(() => {

      document.getElementById("struk")
      .classList.add("hidden");

      }, 10000);

    let isi = "";

    data.forEach(item => {

      isi += `
        <div class="flex justify-between text-sm mb-1">
          <span>${item.nama} (${item.jumlah})</span>
          <span>
            Rp ${item.harga * item.jumlah}
          </span>
        </div>
      `;

    });

    document.getElementById("isi-struk")
      .innerHTML = isi;

    document.getElementById("struk-total")
      .innerText = total;

    document.getElementById("struk-bayar")
      .innerText = bayar;

    document.getElementById("struk-kembalian")
      .innerText = kembalian;


    // =======================
    // RESET SETELAH BAYAR
    // =======================
    data = [];

    render();

    document.getElementById("bayar").value = "";

  })

  .catch(err => {

    console.log(err);

    alert("Terjadi kesalahan!");

  });

}