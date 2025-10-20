import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";
import { toast } from "react-toastify";
import { Save } from "lucide-react";

const pekerjaanOptions = [
  "理容師",
  "未就労",
  "電気技師",
  "学生",
  "家事",
  "石工",
  "定年",
  "大工",
  "公務員",
  "記者",
  "軍人",
  "牧師",
  "農家",
  "教師",
  "畜産",
  "運転手",
  "会社員",
  "商人",
  "アルバイト",
  "役人",
  "農民",
  "村長",
  "家事手伝い",
  "自営業",
];

/* ======== PETUNJUK (UI SAJA) — TIDAK MENGUBAH LOGIC ======== */
const PEKERJAAN_GUIDE = [
  { indo: "Belum / Tidak Bekerja", kanji: "未就労" },
  { indo: "Mengurus Rumah Tangga", kanji: "家事" },
  { indo: "Pensiunan", kanji: "定年" },
  { indo: "Pegawai Negeri Sipil", kanji: "公務員" },
  { indo: "TNI", kanji: "軍人" },
  { indo: "Petani / Pekebun", kanji: "農家" },
  { indo: "Peternak", kanji: "畜産" },
  { indo: "Karyawan Swasta", kanji: "会社員" },
  { indo: "Buruh Harian Lepas", kanji: "アルバイト" },
  { indo: "Buruh Tani / Perkebunan", kanji: "農民" },
  { indo: "Pembantu Rumah Tangga", kanji: "家事手伝い" },
  { indo: "Pelajar", kanji: "学生" },
  { indo: "Tukang Cukur", kanji: "理容師" },
  { indo: "Tukang Listrik", kanji: "電気技師" },
  { indo: "Tukang Batu", kanji: "石工" },
  { indo: "Tukang Kayu", kanji: "大工" },
  { indo: "Wartawan", kanji: "記者" },
  { indo: "Ustadz / Mubaligh", kanji: "牧師" },
  { indo: "Guru", kanji: "教師" },
  { indo: "Sopir", kanji: "運転手" },
  { indo: "Pedagang", kanji: "商人" },
  { indo: "Perangkat Desa", kanji: "役人" },
  { indo: "Kepala Desa", kanji: "村長" },
  { indo: "Wiraswasta", kanji: "自営業" },
];

const defaultForm = {
  keluarga: Array(6)
    .fill()
    .map(() => ({
      urutan: "",
      nama: "",
      pekerjaan: "",
      usia: "",
    })),
};

const KeluargaSection = () => {
  const [form, setForm] = useState(defaultForm);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cv`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && Array.isArray(res.data.keluarga)) {
          const fixedArray = [...res.data.keluarga];
          while (fixedArray.length < 6) {
            fixedArray.push({ urutan: "", nama: "", pekerjaan: "", usia: "" });
          }

          const updated = fixedArray.map((item) => ({
            urutan: item.urutan || "",
            nama: item.nama || "",
            pekerjaan: item.pekerjaan || "",
            usia: item.usia?.toString() || "",
          }));

          setForm({ keluarga: updated });
        }
      } catch (err) {
        console.warn("⚠️ Data keluarga belum ada atau gagal fetch:", err);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (index, field, value) => {
    const updated = [...form.keluarga];
    updated[index][field] = value;
    setForm({ keluarga: updated });
  };

  const handleSave = async () => {
    const dataToSend = form.keluarga
      .filter((k) => k.urutan || k.nama || k.pekerjaan || k.usia)
      .map(({ urutan, nama, pekerjaan, usia }) => ({
        urutan: urutan.trim(),
        nama: nama.trim(),
        pekerjaan: pekerjaan.trim(),
        usia: usia.toString().trim(),
      }));

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cv`,
        { keluarga: dataToSend },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Data Keluarga Berhasil Disimpan", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (err) {
      toast.error("❌ Gagal menyimpan data keluarga", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== PETUNJUK: Jenis Pekerjaan (Indonesia — Kanji) ===== */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <p className="font-semibold mb-2">
          Petunjuk Jenis Pekerjaan (Indonesia — Kanji)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {PEKERJAAN_GUIDE.map((item) => (
            <div
              key={item.indo}
              className="flex items-center justify-between rounded-md bg-white/70 px-3 py-2 border border-amber-200"
            >
              <span className="truncate pr-2">{item.indo}</span>
              <span className="font-semibold text-amber-700">{item.kanji}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-amber-700/80">
          * Gunakan daftar ini sebagai acuan saat memilih kolom{" "}
          <strong>Pekerjaan</strong> di bawah.
        </p>
      </div>
      {/* ========================= END PETUNJUK ========================= */}

      {form.keluarga.map((item, index) => (
        <div key={index} className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            Anggota Keluarga {index + 1}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={item.urutan}
              onChange={(e) => handleChange(index, "urutan", e.target.value)}
              className="input-style"
            >
              <option value="">Pilih Urutan</option>
              <option value="父">Ayah 父</option>
              <option value="母">Ibu 母</option>
              <option value="兄">Kakak Laki-laki 兄</option>
              <option value="姉">Kakak Perempuan 姉</option>
              <option value="弟">Adik Laki-laki 弟</option>
              <option value="妹">Adik Perempuan 妹</option>
              <option value="子供">Anak 子供</option>
              <option value="夫">Suami 夫</option>
              <option value="妻">Istri 妻</option>
            </select>
            <input
              type="text"
              placeholder="Nama"
              value={item.nama}
              onChange={(e) => handleChange(index, "nama", e.target.value)}
              className="input-style"
            />
            <select
              value={item.pekerjaan}
              onChange={(e) => handleChange(index, "pekerjaan", e.target.value)}
              className="input-style"
            >
              <option value="">Pilih Pekerjaan</option>
              {pekerjaanOptions.map((job, i) => (
                <option key={i} value={job}>
                  {job}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Usia"
              value={item.usia}
              onChange={(e) => handleChange(index, "usia", e.target.value)}
              className="input-style"
              min="0"
            />
          </div>
          {item.usia && (
            <div className="text-sm text-gray-600 mt-1">{item.usia} 歳</div>
          )}
        </div>
      ))}

      {/* Peringatan simpan sebelum lanjut */}
      <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md text-sm font-semibold">
        ⚠️ Simpan halaman Data Keluarga ini sebelum lanjut ke halaman
        berikutnya.
      </div>

      <div className="text-right">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          <Save size={18} className="stroke-[2.5]" />
          Simpan Data Keluarga
        </button>
      </div>
    </div>
  );
};

export default KeluargaSection;
