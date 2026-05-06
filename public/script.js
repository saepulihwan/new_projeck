let data = [];
let total = 0;

function render() {
  let list = document.getElementById("list");
  list.innerHTML = "";
  total = 0;

  data.forEach((item, index) => {
    let subtotal = item.harga * item.jumlah;
    total += subtotal;

    let li = document.createElement("li");
    li.className = "flex justify-between items-center bg-slate-700 p-3 rounded";

    li.innerHTML = `
      <div>
        <p class="font-semibold">${item.nama}</p>
        <p class="text-sm text-gray-300">${item.jumlah} x Rp ${item.harga}</p>
      </div>

      <div class="text-right">
        <p class="text-green-400 font-bold">Rp ${subtotal}</p>
        <button onclick="hapus(${index})"
          class="text-red-400 text-sm">hapus</button>
      </div>
    `;

    list.appendChild(li);
  });

  document.getElementById("total").innerText = total;
}

function tambah() {
  let nama = document.getElementById("nama").value;
  let harga = parseInt(document.getElementById("harga").value);
  let jumlah = parseInt(document.getElementById("jumlah").value);

  data.push({ nama, harga, jumlah });
  render();
}
function reset() {
  // reset input
  document.getElementById("nama").value = "";
  document.getElementById("harga").value = "";
  document.getElementById("jumlah").value = "";
  document.getElementById("bayar").value = "";
}

function bayar() {
  let bayar = parseInt(document.getElementById("bayar").value);

  if (bayar < total) {
    alert("Uang kurang!");
    return;
  }

  let kembalian = bayar - total;
  document.getElementById("kembalian").innerText = kembalian;

  // kirim ke server
  fetch("/api/transaksi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data, total, bayar, kembalian })
  })
  .then(res => res.json())
  .then(res => {
    alert(res.message);

    // 🔥 RESET SETELAH BAYAR
    data = [];
    total = 0;

    document.getElementById("list").innerHTML = "";
    document.getElementById("total").innerText = 0;
    document.getElementById("kembalian").innerText = 0;
    document.getElementById("bayar").value = "";

  });
}

  // kirim ke server
  fetch("/api/transaksi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data, total, bayar, kembalian })
  })
  .then(res => res.json())
  .then(res => {
    alert(res.message);
  });
