import React, { useEffect, useState } from "react";
import { useRef } from "react";
import axios from "../../utils/axios.js";
import fileDownload from "js-file-download";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import qris from "../../assets/logo/qris.png";
import gopay from "../../assets/logo/gopay.png";
import dana from "../../assets/logo/dana.png";
import ovo from "../../assets/logo/ovo.png";
import shopeepay from "../../assets/logo/shopeepay.png";
import linkaja from "../../assets/logo/linkaja.png";
import bca from "../../assets/logo/bca.png";
import bri from "../../assets/logo/bri.png";
import mandiri from "../../assets/logo/mandiri.png";
import bni from "../../assets/logo/bni.png";
import xendit from "../../assets/logo/xendit.png";
import btn from "../../assets/logo/btn.png";

Modal.setAppElement("#root");

const ExportCvPage = () => {
  const pollingId = useRef(null);
  const isPolling = useRef(null);
  const [qrString, setQrString] = useState("");
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [remainingExports, setRemainingExports] = useState(0);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchQuota = async () => {
    try {
      const res = await axios.get(`/api/payment/export-quota/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRemainingExports(res.data.remainingExports);
    } catch (err) {
      console.error("Gagal cek kuota ekspor:", err);
    }
  };

  const pollPaymentStatus = (refId) => {
    if (isPolling.current) return; // 🔒 Cegah double polling

    isPolling.current = true;
    pollingId.current = setInterval(async () => {
      try {
        const res = await axios.get(`/api/payment/check-status/${refId}`);
        if (res.data.status === "PAID") {
          clearInterval(pollingId.current);
          isPolling.current = false;
          toast.success("✅ Pembayaran berhasil!");
          setShowModal(false);
          localStorage.setItem("activePaymentRefId", refId); // ✅ simpan refId aktif
          await fetchQuota();
        }
      } catch (err) {
        console.error("Polling failed:", err);
      }
    }, 5000);
  };

  const handleCloseModal = () => {
    if (pollingId.current) clearInterval(pollingId.current);
    isPolling.current = false;
    setShowModal(false);
    setIsExporting(false);
    toast.info("❌ Pembayaran dibatalkan, export CV tidak diproses");
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const res = await axios.post(
        "/api/export/pdf",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      fileDownload(res.data, "CV_Export.pdf");
      toast.success("✅ Berhasil export PDF");
      await axios.post(
        "/api/payment/decrease-quota",
        {
          referenceId: localStorage.getItem("activePaymentRefId"),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchQuota(); // refresh kuota dari backend
    } catch (err) {
      toast.error("❌ Gagal export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (remainingExports > 0) return handleDownload();

    try {
      const res = await axios.post(
        "/api/payment/create/qris",
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQrString(res.data.qrString); // ambil qr_string dari backend
      setShowModal(true);
      pollPaymentStatus(res.data.referenceId);
    } catch (err) {
      toast.error("❌ Gagal membuat QR Code");
    }
  };

  const handleExportExcel = async () => {
    if (remainingExports <= 0) return handleExportPDF();
    if (!cv || !cv._id) return alert("CV belum ditemukan");

    const url = `${import.meta.env.VITE_API_URL}/api/export/excel/${cv._id}`;
    window.open(url, "_blank");

    try {
      await axios.post(
        "/api/payment/decrease-quota",
        {
          referenceId: localStorage.getItem("activePaymentRefId"),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchQuota();
    } catch (err) {
      toast.error("❌ Gagal mengurangi kuota saat export Excel");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const res = await axios.get("/api/cv", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCv(res.data.cv || res.data);
      } catch (err) {
        console.error(
          "❌ Frontend error saat membuat QR:",
          err?.response?.data || err.message
        );
        toast.error("❌ Gagal membuat QR Code");
        setErrorMsg("CV belum tersedia. Silakan lengkapi CV terlebih dahulu.");
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
    fetchQuota();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">Memuat data CV...</div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-5xl mx-auto">
      {/* Peringatan wajib isi */}
      <div className="mb-6">
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm font-semibold">
          ⚠️ Periksa semua data di CV Anda sebelum menekan tombol Export.
          Pastikan data sudah benar dan lengkap. Jika ada kesalahan segera
          perbaiki. 1 kali pembayaran berlaku untuk 3x export
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-blue-700">Preview CV</h1>
      <p className="text-sm text-gray-600 mb-4">
        Sisa kesempatan ekspor: <strong>{remainingExports}</strong>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <p>
            <strong>Nama:</strong> {cv.nama}
          </p>
          <p>
            <strong>Nama Katakana:</strong> {cv.namaKatakana}
          </p>
          <p>
            <strong>Panggilan:</strong> {cv.panggilan}
          </p>
          <p>
            <strong>Panggilan Katakana:</strong> {cv.panggilanKatakana}
          </p>
          <p>
            <strong>Tempat, Tanggal Lahir:</strong> {cv.tempatLahir},{" "}
            {new Date(cv.tanggalLahir).toLocaleDateString("ja-JP")}
          </p>
          <p>
            <strong>Usia:</strong> {cv.usia} tahun
          </p>
          <p>
            <strong>Jenis Kelamin:</strong> {cv.jenisKelamin}
          </p>
          <p>
            <strong>Status Pernikahan:</strong> {cv.statusPernikahan}
          </p>
          <p>
            <strong>Agama:</strong> {cv.agama}
          </p>
        </div>
        <div>
          <p>
            <strong>Email:</strong> {cv.email}
          </p>
          <p>
            <strong>Telp:</strong> {cv.telp}
          </p>
          <p>
            <strong>Alamat:</strong> {cv.alamatLengkap}
          </p>
          <p>
            <strong>Tinggi Badan:</strong> {cv.tinggiBadan} cm
          </p>
          <p>
            <strong>Berat Badan:</strong> {cv.beratBadan} kg
          </p>
          <p>
            <strong>Golongan Darah:</strong> {cv.golonganDarah}
          </p>
          <p>
            <strong>Alkohol:</strong> {cv.alkohol}
          </p>
          <p>
            <strong>Merokok:</strong> {cv.merokok}
          </p>
          <p>
            <strong>Buta Warna:</strong> {cv.butaWarna}
          </p>
          <p>
            <strong>Level Bahasa:</strong> {cv.levelBahasa}
          </p>
          <p>
            <strong>SSW Dimiliki:</strong> {cv.sswDimiliki}
          </p>
          <p>
            <strong>Nomor Paspor:</strong> {cv.nomorPaspor}
          </p>
          <p>
            <strong>Masa Berlaku Paspor:</strong> {cv.masaBerlakuPaspor}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Pendidikan</h2>
        {cv.pendidikan?.map((item, i) => (
          <p key={i}>
            - {item.nama}, {item.jurusan} ({item.masa})
          </p>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Pekerjaan</h2>
        {cv.pekerjaan?.map((item, i) => (
          <p key={i}>
            - {item.namaPerusahaan} ({item.masaKerja}): {item.rincianKerja}
          </p>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Keluarga</h2>
        {cv.keluarga?.map((item, i) => (
          <p key={i}>
            - {item.urutan}: {item.nama}, {item.pekerjaan}, {item.usia} tahun
          </p>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Riwayat ke Jepang</h2>
        {cv.riwayatJepang?.map((item, i) => (
          <p key={i}>
            - {item.pernah}, {item.ijinTinggal}, {item.lamaTinggal},{" "}
            {item.perusahaanPenerima}, {item.lokasi}
          </p>
        ))}
      </div>

      {/* Peringatan simpan sebelum lanjut */}
      <div className="mt-6">
        <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md text-sm font-semibold">
          ⚠️ Tekan Export, kemudian kembali ke halaman ini untuk mendownload CV
          jika Anda sudah melakukan Pembayaran. Terima kasih telah menggunakan
          layanan kami.
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        {/* {isExporting && (
          <p className="text-sm text-gray-600 mt-2">
            Sedang memproses PDF, harap tunggu...
          </p>
        )}

        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className={`px-4 py-2 rounded text-white ${
            isExporting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isExporting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Memproses...</span>
            </div>
          ) : (
            "Export PDF"
          )}
        </button> */}

        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Export dan Download CV
        </button>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-auto flex flex-col md:flex-row items-center p-6 gap-8">
          {/* KIRI - QR + Judul */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/2 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Silakan Scan QR Code
            </h2>

            <div className="p-4 bg-white rounded-md shadow-md">
              <QRCodeSVG
                value={qrString}
                size={220}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>

            <p className="mt-3 text-sm text-gray-600">
              QR akan dicek otomatis setiap 5 detik. QR ini bisa Anda
              Screenshoot untuk di Scan.
            </p>
          </div>

          {/* KANAN - Info & Logo */}
          <div className="flex flex-col justify-center items-start w-full md:w-1/2 px-4">
            {/* Nominal */}
            <p className="text-sm text-gray-600 mb-1">
              💰 <span className="font-medium">EXPORT FEE</span>
            </p>
            <div className="mb-2">
              <p className="text-sm text-gray-500 line-through">IDR 40.000</p>
              <p className="text-xl font-bold text-red-600">IDR 9.800</p>
              <p className="text-xs text-green-600 font-semibold">Diskon 75%</p>
            </div>{" "}
            <p className="text-sm text-gray-700 mb-4">
              Berlaku untuk <strong>2x export CV</strong>
              <br />
              Bayar kembali untuk export berikutnya.
            </p>
            {/* Logo QRIS */}
            <img src={qris} alt="QRIS Logo" className="w-36 mx-auto mb-4" />
            {/* Logo dompet digital & bank */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-4 gap-x-6 justify-items-center items-center w-full mt-4">
              <img
                src={gopay}
                alt="GoPay"
                className="h-6 sm:h-7 object-contain"
              />
              <img
                src={dana}
                alt="DANA"
                className="h-6 sm:h-7 object-contain"
              />
              <img
                src={shopeepay}
                alt="ShopeePay"
                className="h-6 sm:h-7 object-contain"
              />
              <img
                src={linkaja}
                alt="LinkAja"
                className="h-6 sm:h-7 object-contain"
              />
              <img src={ovo} alt="OVO" className="h-6 sm:h-7 object-contain" />
              <img src={bca} alt="BCA" className="h-6 sm:h-7 object-contain" />
              <img src={bri} alt="BRI" className="h-6 sm:h-7 object-contain" />
              <img
                src={mandiri}
                alt="Mandiri"
                className="h-6 sm:h-7 object-contain"
              />
              <img src={bni} alt="BNI" className="h-6 sm:h-7 object-contain" />
              <img src={btn} alt="BNI" className="h-6 sm:h-7 object-contain" />
            </div>
            {/* Xendit Logo */}
            <div className="flex items-center mx-auto mt-6">
              <span className="text-xs text-gray-500 mr-2">Supported by</span>
              <img src={xendit} alt="Xendit Logo" className="h-5" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExportCvPage;
