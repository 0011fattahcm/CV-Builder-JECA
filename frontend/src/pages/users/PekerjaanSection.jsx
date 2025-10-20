import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";
import { toast } from "react-toastify";
import { Save } from "lucide-react";

const defaultForm = {
  pekerjaan: [
    { namaPerusahaan: "", rincianKerja: "", mulai: "", selesai: "" },
    { namaPerusahaan: "", rincianKerja: "", mulai: "", selesai: "" },
    { namaPerusahaan: "", rincianKerja: "", mulai: "", selesai: "" },
    { namaPerusahaan: "", rincianKerja: "", mulai: "", selesai: "" },
  ],
};

const formatJapanesePeriod = (start, end, isCurrent) => {
  if (isCurrent) {
    // Jika pekerjaan masih berlangsung, tampilkan tanggal mulai dengan format Jepang
    const s = new Date(start);
    return `${s.getFullYear()}年 ${s.getMonth() + 1}月 ～ 現在に至る`;
  }

  if (!start || !end) return "";

  // Jika pekerjaan berakhir, proses tanggal mulai dan akhir dengan format Jepang
  const s = new Date(start);
  const e = new Date(end);

  return `${s.getFullYear()}年 ${s.getMonth() + 1}月 ～ ${e.getFullYear()}年 ${
    e.getMonth() + 1
  }月`;
};

const PekerjaanSection = () => {
  const [form, setForm] = useState(defaultForm);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cv`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && Array.isArray(res.data.pekerjaan)) {
          const fixedArray = [...res.data.pekerjaan];
          while (fixedArray.length < 4) {
            fixedArray.push({
              namaPerusahaan: "",
              rincianKerja: "",
              masa: "",
              isCurrent: false,
            });
          }

          const updated = defaultForm.pekerjaan.map((_, i) => {
            const pekerjaan = fixedArray[i] || {};
            const rawMasa = pekerjaan.masa || pekerjaan.masaKerja;
            let mulai = "",
              selesai = "";
            if (rawMasa?.includes("～")) {
              const [startStr, endStr] = rawMasa
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
              namaPerusahaan: pekerjaan.namaPerusahaan || "",
              rincianKerja: pekerjaan.rincianKerja || "",
              mulai,
              selesai,
              isCurrent: pekerjaan.isCurrent || false, // Menyimpan status isCurrent
            };
          });

          setForm({ pekerjaan: updated });
        }
      } catch (err) {
        console.warn("⚠️ Gagal ambil data pekerjaan:", err);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (index, field, value) => {
    const updated = [...form.pekerjaan];
    updated[index][field] = value;
    setForm({ pekerjaan: updated });
  };

  const handleCheckboxChange = (index) => {
    const updated = [...form.pekerjaan];
    updated[index].isCurrent = !updated[index].isCurrent; // Toggle status pekerjaan
    if (updated[index].isCurrent) {
      updated[index].selesai = ""; // Hapus tanggal selesai jika pekerjaan masih berlangsung
    }
    setForm({ pekerjaan: updated });
  };

  const handleSave = async () => {
    const dataToSend = form.pekerjaan.map((p) => ({
      namaPerusahaan: p.namaPerusahaan.trim(),
      rincianKerja: p.rincianKerja.trim(),
      masaKerja: formatJapanesePeriod(p.mulai, p.selesai, p.isCurrent), // Menyertakan isCurrent
    }));

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cv`,
        { pekerjaan: dataToSend },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Data Pekerjaan Berhasil Disimpan", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (err) {
      toast.error("❌ Gagal menyimpan data pekerjaan", {
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
        ⚠️ Jika berpengalaman di Jepang, nama perushaan gunakan Kanji. Semua
        rincian Posisi gunakan bahasa Jepang.
      </div>

      {form.pekerjaan.map((job, index) => (
        <div key={index} className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            Pekerjaan {index + 1}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor={`namaPerusahaan-${index}`}
                className="font-semibold text-gray-700 block mb-1"
              >
                Nama Perusahaan
              </label>
              <input
                id={`namaPerusahaan-${index}`}
                type="text"
                placeholder="Nama Perusahaan"
                value={job.namaPerusahaan}
                onChange={(e) =>
                  handleChange(index, "namaPerusahaan", e.target.value)
                }
                className="input-style"
              />
            </div>
            <div>
              <label
                htmlFor={`rincianKerja-${index}`}
                className="font-semibold text-gray-700 block mb-1"
              >
                Rincian Posisi Kerja (日本語で)
              </label>
              <input
                id={`rincianKerja-${index}`}
                type="text"
                placeholder="Rincian Posisi Kerja (日本語で)"
                value={job.rincianKerja}
                onChange={(e) =>
                  handleChange(index, "rincianKerja", e.target.value)
                }
                className="input-style"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                Periode Kerja
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="month"
                  value={job.mulai}
                  onChange={(e) => handleChange(index, "mulai", e.target.value)}
                  className="input-style"
                />
                <input
                  type="month"
                  value={job.selesai}
                  onChange={(e) =>
                    handleChange(index, "selesai", e.target.value)
                  }
                  className="input-style"
                  disabled={job.isCurrent} // Disable jika pekerjaan masih berlangsung
                />
              </div>
              <div className="mt-2">
                <label>
                  <input
                    type="checkbox"
                    checked={job.isCurrent}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  Masih Bekerja (現在に至る)
                </label>
              </div>
              {job.mulai && job.selesai && (
                <div className="text-sm text-gray-600 mt-1">
                  Masa Kerja:{" "}
                  {formatJapanesePeriod(job.mulai, job.selesai, job.isCurrent)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Peringatan simpan sebelum lanjut */}
      <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md text-sm font-semibold">
        ⚠️ Simpan halaman Data Pekerjaan ini sebelum lanjut ke halaman
        berikutnya.
      </div>

      <div className="text-right">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          <Save size={18} className="stroke-[2.5]" />
          Simpan Data Pekerjaan
        </button>
      </div>
    </div>
  );
};

export default PekerjaanSection;
