import React, { useState, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import axios from "../../utils/axios.js";
import DashboardLayout from "../../components/users/DashboardLayout.jsx";
import {
  File,
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";

const MAX_FILES = 10;
const MAX_SIZE_MB = 20; // selaras dengan limit backend

const MergerPdfPage = () => {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [merging, setMerging] = useState(false);
  const fileInputRef = useRef(null);

  const totalSizeMB = useMemo(
    () => (files.reduce((s, f) => s + f.size, 0) / (1024 * 1024)).toFixed(2),
    [files]
  );

  const validateAndAdd = (incoming = []) => {
    const arr = Array.from(incoming);
    const current = [...files];

    // kapasitas
    if (current.length + arr.length > MAX_FILES) {
      toast.error(`Maksimal ${MAX_FILES} file PDF.`);
      return;
    }

    // filter hanya pdf + ukurannya
    const valid = [];
    for (const f of arr) {
      if (f.type !== "application/pdf") {
        toast.warn(`Lewatkan "${f.name}" (bukan PDF).`);
        continue;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.warn(`Lewatkan "${f.name}" (> ${MAX_SIZE_MB}MB).`);
        continue;
      }
      // hindari duplikasi by name+size
      const dup = current
        .concat(valid)
        .some((x) => x.name === f.name && x.size === f.size);
      if (dup) {
        toast.info(`Lewatkan duplikat "${f.name}".`);
        continue;
      }
      valid.push(f);
    }

    if (valid.length) setFiles((prev) => [...prev, ...valid]);
  };

  const handleFileChange = (e) => validateAndAdd(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndAdd(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!dragOver) setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleReorder = (index, dir) => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= files.length) return;
    const next = [...files];
    [next[index], next[target]] = [next[target], next[index]];
    setFiles(next);
  };

  const handleRemove = (i) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  const handleClear = () => setFiles([]);

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.warn("Minimal 2 file untuk digabungkan.");
      return;
    }
    try {
      setMerging(true);
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const token = localStorage.getItem("token");
      const res = await axios.post("/api/pdf/merge", formData, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Gabungan_PDF.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success("Berhasil menggabungkan PDF.");
      setFiles([]);
    } catch (err) {
      console.error("Gagal merge:", err);
      toast.error("Gagal menggabungkan PDF.");
    } finally {
      setMerging(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-extrabold text-blue-700">Gabungkan PDF</h1>
        <p className="text-sm text-gray-600 mt-1">
          Unggah hingga {MAX_FILES} file PDF (maks. {MAX_SIZE_MB}MB per file).
          Atur urutan sesuai kebutuhan, lalu gabungkan.
        </p>

        {/* Upload / Dropzone */}
        <div
          className={`mt-5 rounded-2xl border-2 border-dashed p-8 transition
            ${
              dragOver
                ? "border-blue-400 bg-blue-50/50"
                : "border-gray-300 bg-white"
            }
          `}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            fileInputRef.current?.click()
          }
          aria-label="Klik atau taruh file PDF di sini"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 text-blue-600">
              <Upload size={24} />
            </div>
            <p className="mt-3 font-medium text-gray-800">
              Klik untuk memilih file atau tarik & lepas di area ini
            </p>
            <p className="text-xs text-gray-500">
              PDF saja • Maks. {MAX_FILES} file • ≤ {MAX_SIZE_MB}MB / file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Daftar File */}
        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {files.length} file · total {totalSizeMB} MB
              </span>
              <button
                onClick={handleClear}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Bersihkan
              </button>
            </div>

            <ul className="space-y-3">
              {files.map((file, i) => (
                <li
                  key={`${file.name}-${file.size}-${i}`}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2 ring-1 ring-gray-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white ring-1 ring-gray-200 text-red-600">
                      <File size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleReorder(i, "up")}
                      disabled={i === 0}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300
                                 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Pindah ke atas"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      onClick={() => handleReorder(i, "down")}
                      disabled={i === files.length - 1}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300
                                 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Pindah ke bawah"
                    >
                      <ArrowDown size={18} />
                    </button>
                    <button
                      onClick={() => handleRemove(i)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tombol Merge */}
        <div className="mt-6">
          <button
            onClick={handleMerge}
            disabled={merging || files.length < 2}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500
                       text-white font-semibold py-3 shadow-md hover:shadow-lg transition
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {merging ? <Loader2 className="animate-spin" size={18} /> : null}
            {merging ? "Memproses…" : "Gabungkan PDF"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MergerPdfPage;
