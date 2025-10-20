// src/pages/users/PreviewCV.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react"; // <- ExternalLink dihapus
import DashboardLayout from "../../components/users/DashboardLayout.jsx";
import Preview1 from "../../assets/img/preview1.jpg";

const PreviewCV = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleSelectModel = (model) => {
    if (model === "basic") {
      navigate(`/users/${userId}/edit-cv`);
    }
  };

  const models = [
    { id: "basic", name: "Basic CV", img: Preview1, comingSoon: false },
    {
      id: "v2",
      name: "Model CV 2",
      img: "https://dummyimage.com/300x425/cccccc/000000&text=Coming+Soon",
      comingSoon: true,
    },
    {
      id: "v3",
      name: "Model CV 3",
      img: "https://dummyimage.com/300x425/cccccc/000000&text=Coming+Soon",
      comingSoon: true,
    },
  ];

  const Card = ({ m }) => {
    const disabled = m.comingSoon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: disabled ? 0 : -4 }}
        className={`group relative rounded-2xl ring-1 ring-gray-200 bg-white overflow-hidden shadow-sm transition
          ${
            disabled
              ? "opacity-60 cursor-not-allowed"
              : "cursor-pointer hover:shadow-md"
          }`}
        onClick={() => !disabled && handleSelectModel(m.id)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " "))
            handleSelectModel(m.id);
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label={disabled ? `${m.name} (segera hadir)` : `Pilih ${m.name}`}
      >
        {/* strip gradient di atas */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500" />

        {/* badge status */}
        <div className="absolute right-3 top-3 z-10">
          {disabled ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 text-xs px-2 py-1 ring-1 ring-amber-200">
              <Clock className="w-3.5 h-3.5" /> Segera Hadir
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-xs px-2 py-1 ring-1 ring-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tersedia
            </span>
          )}
        </div>

        {/* preview A4 */}
        <div className="relative bg-gray-50">
          <img
            src={m.img}
            alt={`Preview ${m.name}`}
            className="w-full object-cover"
            style={{ aspectRatio: "1 / 1.4142", height: "auto" }}
            loading="lazy"
          />
          {!disabled && (
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/20 to-transparent" />
          )}
        </div>

        {/* info & actions */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {m.name}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Format bersih dan mudah dibaca. Cocok untuk pengajuan dokumen
                standar.
              </p>
            </div>

            {/* Hanya tampilkan tombol jika tersedia */}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectModel(m.id);
                }}
                className="shrink-0 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition"
              >
                Pilih
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-extrabold text-blue-700">
              Pilih Model CV
            </h1>
            <p className="text-gray-600 mt-1">
              Pilih salah satu template yang tersedia. Template lain segera
              menyusul.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((m) => (
              <Card key={m.id} m={m} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PreviewCV;
