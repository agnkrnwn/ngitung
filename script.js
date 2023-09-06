let barangCounter = 0;
let totalSemua = 0;

function tambahBarang() {
  barangCounter++;

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td><input type="text" id="nama-barang-${barangCounter}" /></td>
    <td><input type="number" id="harga-${barangCounter}" /></td>
    <td><input type="number" id="jumlah-${barangCounter}" oninput="hitungTotal(${barangCounter})" /></td>
    <td><span id="total-barang-${barangCounter}">0</span></td>
  `;

  document.getElementById("barang-list").appendChild(newRow);
}

function hitungTotal(counter) {
  const harga = parseFloat(document.getElementById(`harga-${counter}`).value);
  const jumlah = parseInt(document.getElementById(`jumlah-${counter}`).value);
  const total = harga * jumlah;

  document.getElementById(`total-barang-${counter}`).textContent = formatAngka(total);

  hitungTotalSemua();
}

function formatAngka(angka) {
  return angka.toFixed(0).replace(/\d(?=(\d{3})+$)/g, "$&,");
}

function hitungTotalSemua() {
  totalSemua = 0;

  for (let i = 1; i <= barangCounter; i++) {
    const totalBarang = parseFloat(
      document.getElementById(`total-barang-${i}`).textContent.replace(/,/g, "")
    );
    totalSemua += totalBarang;
  }

  document.getElementById("total-semua").textContent = formatAngka(totalSemua);
}

function hitungBagiDuaBelas() {
  const hasilPembagian = totalSemua / 12;
  document.getElementById("hasil-pembagian").textContent = formatAngka(hasilPembagian);
}

function resetSemua() {
  const tbody = document.getElementById("barang-list");
  tbody.innerHTML = "";
  barangCounter = 0;
  totalSemua = 0;
  document.getElementById("total-semua").textContent = formatAngka(totalSemua);
  document.getElementById("hasil-pembagian").textContent = "0";
}

function getFormattedDate() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date().toLocaleDateString('id-ID', options);
  return date;
}

document.getElementById("simpanPDF").addEventListener("click", function () {
  const namaDaftarBarang = document.getElementById("namaDaftarBarang").value;

  const data = [];
  for (let i = 1; i <= barangCounter; i++) {
    const nama = document.getElementById(`nama-barang-${i}`).value;
    const harga = document.getElementById(`harga-${i}`).value;
    const jumlah = document.getElementById(`jumlah-${i}`).value;
    const total = document.getElementById(`total-barang-${i}`).textContent;

    data.push([nama, harga, jumlah, total]);
  }

  const docDefinition = {
    content: [
      { text: "Modal untuk " + namaDaftarBarang, style: "header", margin: [0, 0, 0, 10] }, // Gunakan nama daftar barang dari input
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*"],
          body: [
            ["Nama", "Harga Per lusin", "Jumlah", "Total"],
            ...data,
          ],
        },
      },
      { text: "Total : " + document.getElementById("total-semua").textContent, style: "total", margin: [0, 15, 0, 0] },
      { text: "Modal: " + document.getElementById("hasil-pembagian").textContent, style: "total", margin: [0, 8, 0, 0] },
    ],

    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
      },
      total: {
        fontSize: 16,
        bold: true,
        alignment: "right",
      },
    },

    footer: {
      text: [
        { text: 'Dibuat pada hari ' + getFormattedDate(), style: 'footer' },
      ],
      margin: [40, 0],
    },
  };

  const pdfName = `${namaDaftarBarang}.pdf`; // Nama file PDF sesuai dengan nama daftar barang
  pdfMake.createPdf(docDefinition).download(pdfName);
});
