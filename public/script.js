const supabaseUrl =
  "https://ijjdzlynmxzikwbiiqxx.supabase.co";

const supabaseKey =
  "sb_publishable_PKfhsyCFWeSXLe4RL0wUvA_aRTS0WDg";

const supabaseClient =
  supabase.createClient(
    supabaseUrl,
    supabaseKey
  );


// =======================
// DATA
// =======================
let data = [];

let total = 0;


// =======================
// TAMBAH BARANG
// =======================
function tambah() {

  let nama =
    document.getElementById("nama").value;

  let harga = parseInt(
    document.getElementById("harga").value
  );

  let jumlah = parseInt(
    document.getElementById("jumlah").value
  );

  // VALIDASI
  if (!nama || !harga || !jumlah) {

    alert("Lengkapi data!");

    return;

  }

  // PUSH DATA
  data.push({
    nama,
    harga,
    jumlah
  });

  render();

  // RESET INPUT
  document.getElementById("nama").value = "";

  document.getElementById("harga").value = "";

  document.getElementById("jumlah").value = "";

}


// =======================
// RENDER LIST
// =======================
function render() {

  let list =
    document.getElementById("list");

  list.innerHTML = "";

  total = 0;

  data.forEach((item, index) => {

    let subtotal =
      item.harga * item.jumlah;

    total += subtotal;

    let li =
      document.createElement("li");

    li.className =
      "flex flex-col md:flex-row md:justify-between bg-slate-700 p-4 rounded gap-2";

    li.innerHTML = `

      <div>

        <p class="font-semibold text-lg">
          ${item.nama}
        </p>

        <p class="text-sm text-gray-300">
          ${item.jumlah} x Rp ${item.harga}
        </p>

      </div>

      <div class="text-right">

        <p class="text-green-400 font-bold text-lg">
          Rp ${subtotal}
        </p>

        <button
          onclick="hapus(${index})"
          class="text-red-400 text-sm">

          Hapus

        </button>

      </div>

    `;

    list.appendChild(li);

  });

  document.getElementById("total")
    .innerText = total;

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

  document.getElementById("kembalian")
    .innerText = 0;

}


// =======================
// BAYAR
// =======================
async function bayarTransaksi() {

  // VALIDASI
  if (data.length === 0) {

    alert("Belum ada barang!");

    return;

  }

  let bayar = parseInt(
    document.getElementById("bayar").value
  );

  if (isNaN(bayar)) {

    alert("Masukkan nominal bayar!");

    return;

  }

  if (bayar < total) {

    alert("Uang kurang!");

    return;

  }

  // HITUNG KEMBALIAN
  let kembalian = bayar - total;

  document.getElementById("kembalian")
    .innerText = kembalian;

  try {

    // =======================
    // SIMPAN KE SUPABASE
    // =======================
    for (let item of data) {

      const { error } =
        await supabaseClient
          .from("transaksi")
          .insert([
            {
              nama_barang: item.nama,
              harga: item.harga,
              jumlah: item.jumlah,
              total: item.harga * item.jumlah
            }
          ]);

      if (error) {

        console.log(error);

        alert("Gagal simpan ke database!");

        return;

      }

    }

    // =======================
    // TAMPILKAN STRUK
    // =======================
    document.getElementById("struk")
      .classList.remove("hidden");

    let isi = "";

    data.forEach(item => {

      isi += `

        <div class="flex justify-between text-sm mb-1">

          <span>
            ${item.nama} (${item.jumlah})
          </span>

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

    // AUTO HIDE STRUK
    setTimeout(() => {

      document.getElementById("struk")
        .classList.add("hidden");

    }, 15000);

    // RESET
    data = [];

    render();

    document.getElementById("bayar").value = "";

    alert("Transaksi berhasil!");

    loadRiwayat();

  } catch (err) {

    console.log(err);

    alert("Terjadi kesalahan!");

  }

  // =======================
// AMBIL RIWAYAT
// =======================

async function loadRiwayat() {

  const { data, error } =
    await supabaseClient
      .from("transaksi")
      .select("*")
      .order("id", { ascending: false });

  if (error) {

    console.log(error);

    return;

  }

  let riwayat =
    document.getElementById("riwayat");

  riwayat.innerHTML = "";

  data.forEach(item => {

    riwayat.innerHTML += `

      <tr class="border-b border-slate-700">

        <td class="p-2">
          ${item.nama_barang}
        </td>

        <td class="p-2">
          Rp ${item.harga}
        </td>

        <td class="p-2">
          ${item.jumlah}
        </td>

        <td class="p-2 text-green-400 font-bold">
          Rp ${item.total}
        </td>

      </tr>

    `;

  });

}


// =======================
// LOAD AWAL
// =======================

loadRiwayat();
}