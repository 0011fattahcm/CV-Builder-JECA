import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";
import { toast } from "react-toastify";
import { Save } from "lucide-react";

const defaultForm = {
  pendidikan: [
    { jenjang: "（小）", nama: "", jurusan: "", mulai: "", selesai: "" }, // SD
    { jenjang: "（中）", nama: "", jurusan: "", mulai: "", selesai: "" }, // SMP
    { jenjang: "（高）", nama: "", jurusan: "", mulai: "", selesai: "" }, // SMA
    { jenjang: "（大）", nama: "", jurusan: "", mulai: "", selesai: "" }, // PT
  ],
};

const formatJapanesePeriod = (start, end) => {
  if (!start || !end) return "";
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.getFullYear()}年${
    startDate.getMonth() + 1
  }月 ～ ${endDate.getFullYear()}年${endDate.getMonth() + 1}月`;
};

const PendidikanSection = () => {
  const [form, setForm] = useState(defaultForm);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cv`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && Array.isArray(res.data.pendidikan)) {
          // Pastikan tetap ada 4 item
          const fixedArray = [...res.data.pendidikan];
          while (fixedArray.length < 4) {
            fixedArray.push({ nama: "", jurusan: "", masa: "" });
          }

          const updated = defaultForm.pendidikan.map((item, i) => {
            const pendidikan = fixedArray[i] || {};

            let mulai = "",
              selesai = "";
            if (pendidikan.masa && pendidikan.masa.includes("～")) {
              const [startStr, endStr] = pendidikan.masa
                .split("～")
                .map((s) => s.trim());
              const parseMonth = (str) => {
                const year = str.match(/(\d{4})年/)?.[1];
                const month = str.match(/(\d{1,2})月/)?.[1].padStart(2, "0");
                return `${year}-${month}`;
              };
              mulai = parseMonth(startStr);
              selesai = parseMonth(endStr);
            }

            return {
              jenjang: item.jenjang,
              nama: pendidikan.nama || "",
              jurusan: pendidikan.jurusan || "",
              mulai,
              selesai,
            };
          });

          setForm({ pendidikan: updated });
        }
      } catch (err) {
        console.warn("⚠️ CV belum ada atau error, pakai default saja:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...form.pendidikan];
    updated[index][field] = value;
    setForm({ pendidikan: updated });
  };

  const handleSave = async () => {
    const dataToSend = form.pendidikan.map((p) => ({
      nama: p.nama.trim(),
      jurusan: p.jurusan.trim(),
      masa: formatJapanesePeriod(p.mulai, p.selesai),
    }));

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cv`,
        { pendidikan: dataToSend },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Data Pendidikan Berhasil Disimpan", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (err) {
      toast.error("❌ Gagal menyimpan pendidikan", {
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
        ⚠️ Semua Data Jenjang Pendidikan wajib diisi sesuai dengan diri Anda.
        Jurusan baik SMA/SMK atau Perguruan Tinggi diisi dengan bahasa Jepang.
      </div>

      {form.pendidikan.map((edu, index) => (
        <div key={index} className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            {["SD", "SMP", "SMA/SMK/MA", "Perguruan Tinggi"][index]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <span className="mr-2 text-gray-700 whitespace-nowrap">
                {edu.jenjang}
              </span>
              <input
                type="text"
                placeholder="Nama Sekolah / Universitas"
                value={edu.nama}
                onChange={(e) => handleChange(index, "nama", e.target.value)}
                className="input-style w-full"
              />
            </div>
            <input
              type="text"
              placeholder="Jurusan (日本語で)"
              value={edu.jurusan}
              onChange={(e) => handleChange(index, "jurusan", e.target.value)}
              className="input-style"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="month"
                value={edu.mulai}
                onChange={(e) => handleChange(index, "mulai", e.target.value)}
                className="input-style"
              />
              <input
                type="month"
                value={edu.selesai}
                onChange={(e) => handleChange(index, "selesai", e.target.value)}
                className="input-style"
              />
            </div>
            {edu.mulai && edu.selesai && (
              <div className="md:col-span-3 text-sm text-gray-600 mt-1">
                Masa: {formatJapanesePeriod(edu.mulai, edu.selesai)}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Peringatan simpan sebelum lanjut */}
      <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md text-sm font-semibold">
        ⚠️ Simpan halaman Data Pendidikan ini sebelum lanjut ke halaman
        berikutnya.
      </div>

      <div className="text-right">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          <Save size={18} className="stroke-[2.5]" />
          Simpan Data Pendidikan
        </button>
      </div>
    </div>
  );
};

export default PendidikanSection;
