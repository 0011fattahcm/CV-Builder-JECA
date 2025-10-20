import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../utils/axios.js";
import DashboardLayout from "../../components/users/DashboardLayout.jsx";
import { motion } from "framer-motion";
import AnnouncementBox from "../../components/users/AnnouncementBox.jsx";
import {
  Edit3,
  FileSpreadsheet,
  Puzzle,
  Image as ImageIcon,
  Lightbulb,
} from "lucide-react";

const Beranda = () => {
  const { userId } = useParams();
  const [userName, setUserName] = useState("...");
  const [progress, setProgress] = useState(0);
  const [quote, setQuote] = useState("");

  const dailyMotivation = useMemo(
    () => [
      "七転び八起き – Bangkit setelah tujuh kali jatuh.",
      "継続は力なり – Ketekunan adalah kekuatan.",
      "努力は必ず報われる – Usaha tidak akan mengkhianati hasil.",
      "雨が降っても、必ず晴れる – Setelah hujan, pasti ada cerah.",
      "急がば回れ – Lebih baik lambat asal selamat.",
      "石の上にも三年 – Bersabarlah, bahkan batu pun akan menghangat.",
      "習うより慣れろ – Lebih baik terbiasa daripada sekadar belajar teori.",
      "千里の道も一歩から – Perjalanan seribu mil dimulai dengan satu langkah.",
    ],
    []
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        setUserName(res.data?.name || "User");
      } catch {
        setUserName("User");
      }
    };

    const fetchCVProgress = async () => {
      try {
        const res = await axios.get("/api/cv", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          timeout: 20000,
        });

        const cv = res.data.cv || res.data;
        let filled = 0;
        const total = 5;

        if (cv?.nama) filled++;
        if (Array.isArray(cv?.pendidikan) && cv.pendidikan.length > 0) filled++;
        if (Array.isArray(cv?.pekerjaan) && cv.pekerjaan.length > 0) filled++;
        if (Array.isArray(cv?.keluarga) && cv.keluarga.length > 0) filled++;
        if (Array.isArray(cv?.riwayatJepang) && cv.riwayatJepang.length > 0)
          filled++;

        setProgress(Math.round((filled / total) * 100));
      } catch {
        setProgress(0);
      }
    };

    if (userId) {
      fetchUser();
      fetchCVProgress();
    }

    setQuote(
      dailyMotivation[Math.floor(Math.random() * dailyMotivation.length)]
    );
  }, [userId, dailyMotivation]);

  return (
    <DashboardLayout>
      <AnnouncementBox />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-8"
      >
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700">
            Selamat Datang, {userName}
          </h1>
          <p className="mt-2 text-gray-600">
            Kelola CV Anda dengan mudah untuk keperluan kerja ke Jepang (Tokutei
            Ginou/Gijinkoku).
          </p>
        </header>

        {/* Progress */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">
              Progress CV
            </span>
            <span className="text-sm font-semibold text-blue-700">
              {progress}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link to={`/users/${userId}/choose-cv`} className="group">
            <motion.div
              whileHover={{ y: -2 }}
              className="relative overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/60 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-white shadow border border-blue-100 text-blue-700">
                  <Edit3 size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-blue-700">
                    Isi / Edit CV
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Lengkapi data pribadi, pendidikan, pekerjaan, keluarga, dan
                    riwayat di Jepang.
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link to={`/users/${userId}/choose-cv`} className="group">
            <motion.div
              whileHover={{ y: -2 }}
              className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-white shadow border border-emerald-100 text-emerald-700">
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-emerald-700">
                    Export CV
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Ekspor CV siap pakai dalam format Excel.
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link to={`/users/${userId}/merger-pdf`} className="group">
            <motion.div
              whileHover={{ y: -2 }}
              className="relative overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/60 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-white shadow border border-violet-100 text-violet-700">
                  <Puzzle size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-violet-700">
                    Gabungkan PDF
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Satukan beberapa file PDF menjadi satu berkas.
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link to={`/users/${userId}/jpg-convert-pdf`} className="group">
            <motion.div
              whileHover={{ y: -2 }}
              className="relative overflow-hidden rounded-2xl border border-pink-100 bg-pink-50/60 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-white shadow border border-pink-100 text-pink-700">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-pink-700">
                    Konversi JPG ke PDF
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Ubah gambar JPG menjadi PDF ukuran A4 atau sesuai gambar.
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        </section>

        {/* Motivasi Harian */}
        <section className="mt-8">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white border border-amber-100 text-amber-700">
                <Lightbulb size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">
                  Motivasi Harian
                </h3>
                <p className="text-sm text-amber-800/90 mt-1">{quote}</p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </DashboardLayout>
  );
};

export default Beranda;
