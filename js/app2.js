$(document).ready(function () {
    var daftarBarang = [];

    function formatRupiah(angka) {
        return angka.toFixed(0).replace(/\d(?=(\d{3})+$)/g, "$&,");
    }

    function updateDaftarBarang() {
        var tableBody = $("#daftarBarang tbody");
        tableBody.empty();

        var totalKeseluruhan = 0;

        for (var i = 0; i < daftarBarang.length; i++) {
            var item = daftarBarang[i];
            var total = item.harga * item.jumlah;
            totalKeseluruhan += total;

            var row = $("<tr>");
            row.append($("<td>").text(item.nama));
            row.append($("<td>").text(formatRupiah(item.harga)));
            row.append($("<td>").text(item.jumlah));
            row.append($("<td>").text(formatRupiah(total)));
            var deleteButton = $("<button class='btn btn-error btn-xs'><i class='fas fa-trash'></i></button>");
            deleteButton.data("index", i);
            row.append($("<td>").append(deleteButton));
            tableBody.append(row);
        }

        $("#totalKeseluruhan").text(formatRupiah(totalKeseluruhan));
    }

    $("input").on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            const inputs = $("input");
            const currentIndex = inputs.index(this);

            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
            } else {
                inputs[0].focus();
            }
        }
    });

    $("#jumlahBarang").on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            tambahBarang();
        }
    });

    function tambahBarang() {
        var namaBarang = $("#namaBarang").val();
        var hargaBarang = parseFloat($("#hargaBarang").val());
        var jumlahBarang = parseInt($("#jumlahBarang").val());
    
        if (namaBarang && !isNaN(hargaBarang) && !isNaN(jumlahBarang)) {
            var item = {
                nama: namaBarang,
                harga: hargaBarang,
                jumlah: jumlahBarang,
            };
            daftarBarang.push(item);
            updateDaftarBarang();
            $("#namaBarang").val("");
            $("#hargaBarang").val("");
            $("#jumlahBarang").val("");
        } else {
            alert("Harap isi semua informasi barang dengan benar.");
        }
    }

    $("#tambahBarang").click(tambahBarang);

    $("#daftarBarang").on("click", "button", function () {
        var index = $(this).data("index");
        daftarBarang.splice(index, 1);
        updateDaftarBarang();
    });

    $("#bagiDua").click(function () {
        var totalKeseluruhanText = $("#totalKeseluruhan").text();
        var totalKeseluruhan = parseFloat(totalKeseluruhanText.replace(/[^0-9.]+/g, ''));

        if (!isNaN(totalKeseluruhan)) {
            showPercentageModal(totalKeseluruhan);
        }
    });

    function updateDetailPerhitungan(totalAwal, persentase, totalAkhir, modal) {
        const detailTable = $("#detailPerhitungan");
        detailTable.empty();

        const tambahan = totalAkhir - totalAwal;
        
        detailTable.append(`<tr><td class="font-bold">Total Keseluruhan Awal</td><td class="text-right">${formatRupiah(totalAwal)}</td></tr>`);
        
        if (persentase > 0) {
            detailTable.append(`<tr><td class="font-bold">Persentase yang Diterapkan</td><td class="text-right">${persentase}%</td></tr>`);
            detailTable.append(`<tr><td class="font-bold">Penambahan</td><td class="text-right"> + ${formatRupiah(tambahan)}</td></tr>`);
            detailTable.append(`<tr><td class="font-bold">Total Setelah Penambahan</td><td class="text-right">${formatRupiah(totalAkhir)}</td></tr>`);
        }
        
        detailTable.append(`<tr><td class="font-bold">Pembagian untuk Modal</td><td class="text-right">${formatRupiah(totalAkhir)} : 12</td></tr>`);
        detailTable.append(`<tr class="text-primary"><td class="font-bold">Modal per Pcs</td><td class="text-right font-bold">${formatRupiah(modal)}</td></tr>`);
    }

    function showPercentageModal(total) {
        var percentageModal = document.getElementById('percentageModal');
        percentageModal.classList.add('modal-open');

        $('.percentage-btn').click(function() {
            $('#customPercentage').val($(this).data('percentage'));
        });

        $('#applyPercentage').click(function() {
            var percentage = parseFloat($('#customPercentage').val());
            if (!isNaN(percentage)) {
                var increasedTotal = total * (1 + percentage / 100);
                var hasilBagi = increasedTotal / 12;
                $("#totalKeseluruhan").text(formatRupiah(increasedTotal));
                $("#hasilBagi12").text(formatRupiah(hasilBagi));
                updateDetailPerhitungan(total, percentage, increasedTotal, hasilBagi);
            }
            percentageModal.classList.remove('modal-open');
        });

        $('#continueWithoutPercentage').click(function() {
            var hasilBagi = total / 12;
            $("#hasilBagi12").text(formatRupiah(hasilBagi));
            updateDetailPerhitungan(total, 0, total, hasilBagi);
            percentageModal.classList.remove('modal-open');
        });
    }


    $("#resetDaftar").click(function () {
        daftarBarang = [];
        updateDaftarBarang();
    });

    function getFormattedDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date().toLocaleDateString('id-ID', options);
        return date;
    }

    $("#simpanPDF").click(function () {
        const namaDaftarBarang = $("#namaDaftarBarang").val();
        const totalKeseluruhan = $("#totalKeseluruhan").text();
        const hasilBagi12 = $("#hasilBagi12").text();

        if (daftarBarang.length === 0) {
            alert("Tidak ada barang yang akan disimpan dalam PDF.");
            return;
        }

        const tableData = daftarBarang.map(item => [
            item.nama,
            formatRupiah(item.harga),
            item.jumlah.toString(),
            formatRupiah(item.harga * item.jumlah)
        ]);

        const docDefinition = {
            content: [
                { text: `Modal untuk ${namaDaftarBarang}`, style: "header" },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*'],
                        body: [
                            ['Nama Barang', 'Harga Barang', 'Jumlah', 'Total'],
                            ...tableData
                        ]
                    }
                },
                { text: `Total: ${totalKeseluruhan}`, style: "total" },
                { text: `Modal: ${hasilBagi12}`, style: "total" },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                total: {
                    fontSize: 14,
                    bold: true,
                    alignment: 'right',
                    margin: [0, 10, 0, 0]
                }
            },
            footer: {
                text: `Dibuat pada ${getFormattedDate()}`,
                alignment: 'center',
                fontSize: 10
            }
        };

        pdfMake.createPdf(docDefinition).download(`modal_${namaDaftarBarang}.pdf`);
        alert("PDF berhasil diunduh.");
    });

    // Theme toggle
    $("#themeToggle").change(function() {
        if (this.checked) {
            $("html").attr("data-theme", "dark");
        } else {
            $("html").attr("data-theme", "light");
        }
    });
});