fetch("/api/transaksi-detail")
  .then(res => res.json())
  .then(data => {

    let container = document.getElementById("container");

    let grouped = {};

    // grouping berdasarkan ID transaksi
    data.forEach(item => {
      if (!grouped[item.id]) {
        grouped[item.id] = {
          tanggal: item.tanggal,
          total: item.total,
          bayar: item.bayar,
          kembalian: item.kembalian,
          items: []
        };
      }

      grouped[item.id].items.push(item);
    });

    // tampilkan ke UI
    for (let id in grouped) {
      let trx = grouped[id];

      let div = document.createElement("div");
      div.className = "bg-slate-800 p-4 rounded-xl shadow";

      let itemsHTML = trx.items.map(i => `
        <li class="flex justify-between">
          <span>${i.nama_barang} (${i.jumlah})</span>
          <span>Rp ${i.subtotal}</span>
        </li>
      `).join("");

      div.innerHTML = `
        <h2 class="text-xl font-bold mb-2">🧾 Transaksi #${id}</h2>
        <p class="text-sm text-gray-400 mb-2">${trx.tanggal}</p>

        <ul class="mb-3 space-y-1">${itemsHTML}</ul>

        <hr class="border-gray-600 mb-2">

        <p>Total: Rp ${trx.total}</p>
        <p>Bayar: Rp ${trx.bayar}</p>
        <p>Kembalian: Rp ${trx.kembalian}</p>
      `;

      container.appendChild(div);
    }
  });