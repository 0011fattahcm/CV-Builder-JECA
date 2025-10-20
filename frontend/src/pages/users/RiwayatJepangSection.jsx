import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";
import { toast } from "react-toastify";
import { Save } from "lucide-react";

const defaultRiwayat = {
  pernah: "",
  ijinTinggal: "",
  lamaTinggalMulai: "",
  lamaTinggalSelesai: "",
  perusahaanPenerima: "",
  lokasi: "",
};

const formatLamaTinggal = (start, end) => {
  if (!start || !end) return "";
  const s = new Date(start);
  const e = new Date(end);
  return `${s.getFullYear()}年　${String(s.getMonth() + 1).padStart(
    2,
    "0"
  )}月　${String(s.getDate()).padStart(
    2,
    "0"
  )}日 ～ ${e.getFullYear()}年　${String(e.getMonth() + 1).padStart(
    2,
    "0"
  )}月　${String(e.getDate()).padStart(2, "0")}日`;
};
const parseLamaTinggal = (lamaTinggalStr) => {
  if (!lamaTinggalStr || !lamaTinggalStr.includes("～"))
    return { start: "", end: "" };

  const [startStr, endStr] = lamaTinggalStr.split("～").map((s) => s.trim());

  const parseDate = (str) => {
    const year = str.match(/(\d{4})年/)?.[1];
    const month = str.match(/(\d{1,2})月/)?.[1].padStart(2, "0");
    const day = str.match(/(\d{1,2})日/)?.[1].padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    start: parseDate(startStr),
    end: parseDate(endStr),
  };
};

const RiwayatJepangSection = () => {
  const [riwayat, setRiwayat] = useState(defaultRiwayat);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cv`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.riwayatJepang?.length > 0) {
          const rj = res.data.riwayatJepang[0];
          const { start, end } = parseLamaTinggal(rj.lamaTinggal || "");

          setRiwayat({
            pernah: rj.pernah || "",
            ijinTinggal: rj.ijinTinggal || "",
            lamaTinggalMulai: start,
            lamaTinggalSelesai: end,
            perusahaanPenerima: rj.perusahaanPenerima || "",
            lokasi: rj.lokasi || "",
          });
        }
      } catch (err) {
        console.warn("⚠️ Riwayat Jepang belum ada atau gagal fetch:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setRiwayat((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const cleanData = {
      riwayatJepang: {
        pernah: riwayat.pernah,
        ijinTinggal: riwayat.ijinTinggal.trim(),
        lamaTinggal: formatLamaTinggal(
          riwayat.lamaTinggalMulai,
          riwayat.lamaTinggalSelesai
        ),
        perusahaanPenerima: riwayat.perusahaanPenerima.trim(),
        lokasi: riwayat.lokasi.trim(),
      },
    };

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/cv`, cleanData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Riwayat Jepang Berhasil Disimpan", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (err) {
      toast.error("❌ Gagal menyimpan Riwayat Jepang", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Peringatan wajib isi */}
      <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm font-semibold">
        ⚠️ Jika tidak ada riwayat isikan "Belum Pernah". Jika ada, isikan
        detailnya dengan lengkap. Gunakan Kanji untuk Nama perusahaan dan Lokasi
        Bekerja.
      </div>
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-700 mb-3">
          Riwayat ke Jepang
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            name="pernah"
            value={riwayat.pernah}
            onChange={(e) => handleChange("pernah", e.target.value)}
            className="input-style"
          >
            <option value="">Pilih Status</option>
            <option value="無">Belum Pernah 無</option>
            <option value="有">Pernah 有</option>
          </select>
          <select
            name="ijinTinggal"
            value={riwayat.ijinTinggal}
            onChange={(e) => handleChange("ijinTinggal", e.target.value)}
            className="input-style"
          >
            <option value="">Pilih Jenis Izin Tinggal (在留資格)</option>
            <option value="Ginou Jisshu (技能実習)">
              Ginou Jisshu (技能実習)
            </option>
            <option value="Tokutei Ginou (特定技能)">
              Tokutei Ginou (特定技能)
            </option>
            <option value="Ryugaku (留学)">Ryugaku (留学)</option>
            <option value="Special Activities (特定活動)">
              Special Activities (特定活動)
            </option>
            <option value="Temporary Visit (短期滞在)">
              Temporary Visit (短期滞在)
            </option>
          </select>

          <div className="grid grid-cols-2 gap-2 col-span-1">
            <input
              type="date"
              name="lamaTinggalMulai"
              value={riwayat.lamaTinggalMulai}
              onChange={(e) => handleChange("lamaTinggalMulai", e.target.value)}
              className="input-style"
            />
            <input
              type="date"
              name="lamaTinggalSelesai"
              value={riwayat.lamaTinggalSelesai}
              onChange={(e) =>
                handleChange("lamaTinggalSelesai", e.target.value)
              }
              className="input-style"
            />
          </div>
          <input
            type="text"
            placeholder="Perusahaan Penerima / Sekolah"
            name="perusahaanPenerima"
            value={riwayat.perusahaanPenerima}
            onChange={(e) => handleChange("perusahaanPenerima", e.target.value)}
            className="input-style"
          />
          <input
            type="text"
            placeholder="Lokasi di Jepang"
            name="lokasi"
            value={riwayat.lokasi}
            onChange={(e) => handleChange("lokasi", e.target.value)}
            className="input-style"
          />
        </div>
        {riwayat.lamaTinggalMulai && riwayat.lamaTinggalSelesai && (
          <div className="text-sm text-gray-600 mt-1">
            Lama Tinggal:{" "}
            {formatLamaTinggal(
              riwayat.lamaTinggalMulai,
              riwayat.lamaTinggalSelesai
            )}
          </div>
        )}
      </div>
      {/* Peringatan simpan sebelum lanjut */}
      <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md text-sm font-semibold">
        ⚠️ Simpan halaman Data Riwayat ini sebelum lanjut ke halaman berikutnya.
      </div>
      <div className="text-right">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          <Save size={18} className="stroke-[2.5]" />
          Simpan Data Riwayat Jepang
        </button>
      </div>
    </div>
  );
};

export default RiwayatJepangSection;
