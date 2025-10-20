// src/pages/LandingPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaCheckCircle,
  FaRocket,
  FaUserPlus,
  FaFileAlt,
  FaDownload,
  FaLaptopCode,
  FaMoneyBillWave,
  FaHandsHelping,
} from "react-icons/fa";

import Logo from "../../src/assets/img/logo.png";
import LogoGiken from "../../src/assets/img/logogiken.png";
import LogoJba from "../../src/assets/img/jba4@4x-8.png";
import LogoNichirin from "../../src/assets/img/nichirin.jpg";
import Ilustration from "../../src/assets/img/ilustrasi.png"; // ganti ke map-japan.png jika sudah ada

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

// ===== ASET ORBIT ONLINE (6 ITEMS) =====
const ORBIT_ASSET_URLS = [
  "https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/file-type-xls.svg", // outer A
  "https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/file-type-jpg.svg", // outer B
  "https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/file-type-pdf.svg", // middle A
  "https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/user.svg", // middle B (profile)
  "https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/shield-lock.svg", // inner A (security)
  "https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/rocket.svg", // inner B
];

const TRANSPARENT_PX =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

const usePreloadedImages = (urls, fallback = TRANSPARENT_PX) => {
  const [srcs, setSrcs] = React.useState(urls);
  React.useEffect(() => {
    urls.forEach((url, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onerror = () =>
        setSrcs((p) => {
          const n = [...p];
          n[i] = fallback;
          return n;
        });
      img.src = url;
    });
  }, [urls, fallback]);
  return srcs;
};

const StatCounter = ({ to = 500, duration = 1.2 }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    const loop = (t) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, [to, duration]);
  return <span>{val}</span>;
};

const LandingPage = () => {
  const navigate = useNavigate();

  // ✅ panggil hook-nya di top-level, bukan di dalam IIFE / kondisi
  const orbitSrcs = usePreloadedImages(ORBIT_ASSET_URLS);
  const year = new Date().getFullYear();
  const featuresContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const featureCard = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen font-sans text-white bg-[#0f1020]"
    >
      {/* NAVBAR */}
      <motion.header
        className="sticky top-0 z-50"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="backdrop-blur-md bg-white/5 border-b border-white/10">
          <div className="container mx-auto px-20 py-5 flex justify-between items-center">
            {/* BRAND: logo + title */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group flex items-center gap-3"
              aria-label="Beranda CV BUILDER JECA"
              title="CV BUILDER JECA"
            >
              <img
                src={Logo}
                alt="Logo JECA"
                className="h-9 w-9 object-contain"
              />
              <span
                className="hidden sm:inline-block text-white font-extrabold tracking-tight
                         text-base md:text-xl group-hover:text-fuchsia-200 transition-colors"
              >
                CV BUILDER JECA
              </span>
            </button>

            {/* Actions */}
            <nav className="flex items-center gap-3">
              <motion.button
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/users/login")}
              >
                Login
              </motion.button>
              <motion.button
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:brightness-110 shadow-lg shadow-fuchsia-600/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/users/register")}
              >
                Register
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* BG gradient — pakai z-0, bukan -z-10 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_20%,rgba(168,85,247,0.45),transparent_60%),radial-gradient(120%_120%_at_80%_30%,rgba(59,130,246,0.35),transparent_60%),radial-gradient(100%_100%_at_50%_90%,rgba(255,255,255,0.06),transparent_70%)]" />
          <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-fuchsia-500/35 blur-[140px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-[32rem] h-[32rem] bg-indigo-500/35 blur-[150px] rounded-full" />
        </div>

        {/* <<< tambahkan wrapper z-10 untuk seluruh isi hero >>> */}
        <div className="relative z-10 container mx-auto px-20 pt-20 pb-24 lg:pt-20 lg:pb-24 grid lg:grid-cols-2 gap-12 items-center">
          {/* Teks kiri */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Bangun CV Standar Jepang{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-300 to-indigo-400">
                dengan akses CV Builder JECA
              </span>
            </h1>
            <p className="mt-5 text-white/80 text-lg">
              Format rapi, siap download, plus fitur pengelolaan dokumen
              built-in.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-start">
              <motion.button
                onClick={() => navigate("/users/register")}
                className="px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-fuchsia-500 to-indigo-500 shadow-lg shadow-fuchsia-600/20"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Mulai Sekarang
              </motion.button>
              <motion.button
                onClick={() =>
                  document
                    .getElementById("manfaat-keuntungan")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/10 transition"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Pelajari Lebih Lanjut
              </motion.button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-white/60 text-sm">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                Export Excel
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                Merger PDF
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                JPG → PDF
              </span>
            </div>
          </motion.div>

          {/* Visual kanan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[420px] md:h-[520px] lg:h-[560px]"
          >
            {/* RINGS */}
            <motion.div
              className="absolute inset-0 m-auto w-[86%] aspect-square rounded-full border border-white/10"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 64, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 m-auto w-[66%] aspect-square rounded-full border border-white/10"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 48, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 m-auto w-[46%] aspect-square rounded-full border border-white/10"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
            />

            {/* ===== ORBITS: 2 ikon per ring, simetris 180° ===== */}
            {[
              // Outer ring: searah jarum jam
              {
                w: "w-[86%]",
                orbit: 360,
                dur: 60,
                angles: [15, 195],
                idx: [0, 1],
              },
              // Middle ring: berlawanan arah
              {
                w: "w-[66%]",
                orbit: -360,
                dur: 45,
                angles: [95, 275],
                idx: [2, 3],
              },
              // Inner ring: searah jarum jam
              {
                w: "w-[46%]",
                orbit: 360,
                dur: 30,
                angles: [175, 355],
                idx: [4, 5],
              },
            ].map(({ w, orbit, dur, angles, idx }, ringI) => (
              <motion.div
                key={ringI}
                className={`absolute inset-0 m-auto ${w} aspect-square`}
                animate={{ rotate: orbit }}
                transition={{ repeat: Infinity, duration: dur, ease: "linear" }}
              >
                {angles.map((angle, j) => {
                  const src = orbitSrcs[idx[j]];
                  const size = ringI === 0 ? 42 : ringI === 1 ? 44 : 42; // variasi kecil
                  const spinDur = ringI === 0 ? 24 : ringI === 1 ? 22 : 20; // spin pelan di tempat
                  return (
                    <div
                      key={j}
                      className="absolute inset-0"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      {/* carrier di tepi kanan: pusat ikon PAS di garis ⇒ -translate-x-1/2 */}
                      <motion.div
                        className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
                        // counter-rotate supaya ikon tetap tegak ketika track berputar
                        animate={{ rotate: -orbit }}
                        transition={{
                          repeat: Infinity,
                          duration: dur,
                          ease: "linear",
                        }}
                      >
                        {/* spin di tempat (pelan) */}
                        <motion.div
                          className="rounded-full bg-white/12 border border-white/20 backdrop-blur-md p-2 shadow-md"
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: spinDur,
                            ease: "linear",
                          }}
                        >
                          <img
                            src={src}
                            alt={`orbit-${idx[j]}`}
                            crossOrigin="anonymous"
                            style={{
                              width: size,
                              height: size,
                              objectFit: "contain",
                              filter: "invert(1) brightness(2)",
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            ))}

            {/* CENTER */}
            <img
              src={Ilustration}
              alt="Ilustrasi"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
               w-[26%] md:w-[22%] lg:w-[20%] object-contain select-none pointer-events-none
               drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            />

            {/* Stat sudut */}
            <motion.div
              className="absolute bottom-4 right-2 md:bottom-6 md:right-8 rounded-2xl px-4 py-2
               bg-white/10 border border-white/10 backdrop-blur-md text-xs md:text-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              500+ pengguna aktif
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== PENGGUNA AKTIF ===== */}
      <section className="relative py-14">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 text-sm mb-4">
                🔥 Bukti Sosial
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">
                  <StatCounter to={500} />+ Pengguna Aktif
                </span>{" "}
                mempercayai CV Builder JECA
              </h2>
              <p className="mt-4 text-white/70">
                Komunitas bertumbuh setiap hari—dari pelajar hingga profesional
                yang sedang mengejar karier ke Jepang.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
                  Rating 4.9/5
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
                  Support cepat
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
                  Update berkala
                </span>
              </div>
            </motion.div>

            {/* Deretan kecil aset (tanpa marquee / variabel undefined) */}
            {/* Deretan kecil aset (ikon putih + bergerak halus) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-4"
            >
              {/* gradient fade kiri/kanan supaya transisi mulus */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#0f1020] to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#0f1020] to-transparent" />

              {(() => {
                // buang fallback transparan kalau ada
                const visible = orbitSrcs.filter(
                  (src) => !/^data:image\/gif/.test(src)
                );
                // gandakan biar loop-nya mulus
                const row = [...visible, ...visible];

                return (
                  <div className="whitespace-nowrap">
                    <div className="flex gap-4 animate-[ticker_26s_linear_infinite] hover:[animation-play-state:paused]">
                      {row.map((url, i) => (
                        <div
                          key={i}
                          className="shrink-0 rounded-full bg-white/10 border border-white/15 p-2 shadow-md"
                        >
                          <motion.img
                            src={url}
                            alt={`asset-${i}`}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 object-contain"
                            // bikin putih tegas, walau sumbernya colored
                            style={{ filter: "invert(1) brightness(2)" }}
                            // spin pelan di tempat
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 18 + (i % 3) * 3,
                              ease: "linear",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* keyframes marquee */}
              <style>{`
    @keyframes ticker {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `}</style>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FITUR UTAMA ===== */}
      <section className="relative py-20 overflow-hidden">
        {/* dekor background halus */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/60 to-[#0f1020]" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="absolute -top-20 -left-28 w-[28rem] h-[28rem] bg-fuchsia-500/25 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -right-28 w-[30rem] h-[30rem] bg-indigo-500/25 blur-[140px] rounded-full" />
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.h2
            className="text-4xl font-semibold mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={2}
          >
            Berbagai Fitur Kami
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={featuresContainer}
          >
            {[
              {
                icon: <FaClipboardList />,
                title: "Edit CV dengan Mudah",
                desc: "Isi dan sesuaikan data CV kamu bertahap & intuitif.",
              },
              {
                icon: <FaFileAlt />,
                title: "Export ke Excel",
                desc: "Styling profesional dengan format standar Jepang.",
              },
              {
                icon: <FaLaptopCode />,
                title: "Convert JPG ke PDF",
                desc: "Satu atau banyak halaman, semua jadi praktis.",
              },
              {
                icon: <FaDownload />,
                title: "Gabungkan File PDF",
                desc: "Merge beberapa berkas & atur urutannya.",
              },
            ].map((it, i) => (
              <motion.div key={i} variants={featureCard}>
                {/* gradient-border + glass card */}
                <div className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                  <div
                    className="rounded-[inherit] h-full bg-white/5 border border-white/10 backdrop-blur-md px-6 py-7
                            transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white/10
                            shadow-[0_10px_25px_-10px_rgba(0,0,0,0.45)]"
                  >
                    {/* badge icon */}
                    <div
                      className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl
                              text-white bg-gradient-to-br from-fuchsia-500 to-indigo-500 shadow-lg shadow-fuchsia-600/25"
                    >
                      <span className="text-2xl">{it.icon}</span>
                    </div>

                    <h3 className="font-bold text-lg">{it.title}</h3>
                    <p className="text-white/70 text-sm mt-1">{it.desc}</p>

                    {/* garis halus */}
                    <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    {/* chip — TENGAH */}
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-white/60">
                      <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                        Stabil
                      </span>
                      <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                        Cepat
                      </span>
                      <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                        Akurat
                      </span>
                    </div>

                    {/* glow saat hover */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition
                              bg-[radial-gradient(60%_60%_at_50%_0%,rgba(236,72,153,0.25),transparent)]"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== MANFAAT & KEUNTUNGAN (UPGRADED) ===== */}
      <section
        id="manfaat-keuntungan"
        className="relative py-20 overflow-hidden"
      >
        {/* BG gradient + dekor */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1020] via-indigo-950/50 to-[#0f1020]" />
          {/* pola titik sangat halus */}
          <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#ffffff_1.1px,transparent_1.1px)] [background-size:22px_22px]" />
          {/* glow kiri/kanan */}
          <div className="absolute -top-24 -left-28 w-[30rem] h-[30rem] bg-fuchsia-500/30 blur-[140px] rounded-full" />
          <div className="absolute -bottom-28 -right-32 w-[34rem] h-[34rem] bg-indigo-500/30 blur-[160px] rounded-full" />
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.h2
            className="text-4xl font-semibold mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={3}
          >
            Manfaat dan Keuntungan
          </motion.h2>

          {/* Manfaat & Keuntungan cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={4}
          >
            {/* Manfaat */}
            <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-fuchsia-400/30 via-white/10 to-white/5">
              <div className="rounded-[inherit] h-full bg-white/5 border border-white/10 backdrop-blur-md px-7 py-6">
                <h3 className="text-2xl font-bold mb-4 text-fuchsia-300 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-500/20 border border-fuchsia-300/30">
                    <FaCheckCircle className="text-fuchsia-300" />
                  </span>
                  Manfaat
                </h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 marker:text-fuchsia-300/80">
                  <li>Proses pembuatan lebih cepat tanpa ribet format.</li>
                  <li>Sesuai standar CV Jepang—rapi & profesional.</li>
                  <li>Solusi end-to-end dari pengisian sampai unduh.</li>
                  <li>Produktif dengan fitur JPG→PDF dan Merge PDF.</li>
                </ul>
              </div>
            </div>

            {/* Keuntungan */}
            <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-indigo-400/30 via-white/10 to-white/5">
              <div className="rounded-[inherit] h-full bg-white/5 border border-white/10 backdrop-blur-md px-7 py-6">
                <h3 className="text-2xl font-bold mb-4 text-fuchsia-300 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-300/30">
                    <FaRocket className="text-indigo-200" />
                  </span>
                  Keuntungan
                </h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 marker:text-indigo-300/80">
                  <li>Mudah dipakai pemula hingga profesional.</li>
                  <li>Akses & edit kapan pun via web.</li>
                  <li>Export Excel siap cetak.</li>
                  <li>UI modern, responsif di semua perangkat.</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Harga + Bonus */}
          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={5}
          >
            {/* Card Harga */}
            <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-amber-300/60 via-fuchsia-400/40 to-indigo-400/40 shadow-[0_8px_30px_-8px_rgba(236,72,153,0.25)]">
              <div className="rounded-[inherit] bg-white/5 border border-amber-200/30 backdrop-blur-md px-8 py-7 text-center transition-all duration-300 group-hover:-translate-y-1">
                <h3 className="text-xl font-extrabold text-amber-300 mb-1 tracking-tight">
                  <span className="text-3xl text-white/50 line-through block mb-1">
                    Rp40.000
                  </span>
                  Hanya{" "}
                  <span className="text-fuchsia-300 drop-shadow-md">
                    Rp9.800
                  </span>
                </h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-4">
                  Untuk{" "}
                  <span className="font-semibold underline underline-offset-2">
                    3 kali ekspor CV
                  </span>{" "}
                  profesional.
                </p>
                <span className="inline-block bg-fuchsia-500/20 text-fuchsia-200 font-semibold text-xs px-4 py-2 rounded-full shadow-sm animate-pulse">
                  DISKON 75% 🔥
                </span>
              </div>
            </div>

            {/* Card Bonus */}
            <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-emerald-300/50 via-cyan-300/40 to-indigo-300/40">
              <div className="rounded-[inherit] bg-white/5 border border-white/10 backdrop-blur-md px-8 py-7 text-center transition-all duration-300 group-hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Bonus Fitur GRATIS 🎁
                </h3>
                <ul className="list-disc mt-1 text-left text-sm text-white/80 pl-6 space-y-1 marker:text-emerald-300/80">
                  <li>Gabungkan beberapa PDF jadi satu</li>
                  <li>Ubah JPG ke PDF instan</li>
                </ul>
                <div className="mt-4">
                  <span className="inline-block bg-emerald-500/20 text-emerald-200 font-semibold text-xs px-4 py-2 rounded-full shadow-sm">
                    Tanpa batas & langsung dipakai!
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CARA MENDAFTAR (UPGRADED TIMELINE) ===== */}
      <section className="relative py-20 overflow-hidden">
        {/* BG gradient + subtle dots */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1020] via-indigo-950/40 to-[#0f1020]" />
          <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="absolute -top-24 -left-28 w-[28rem] h-[28rem] bg-fuchsia-500/30 blur-[140px] rounded-full" />
          <div className="absolute -bottom-24 -right-28 w-[30rem] h-[30rem] bg-indigo-500/30 blur-[140px] rounded-full" />
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.h2
            className="text-4xl font-extrabold mb-12 tracking-tight"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={5}
          >
            Cara Mendaftar & Membuat CV
          </motion.h2>

          {/* ========= MOBILE (garis kiri) ========= */}
          <motion.ol
            className="md:hidden relative border-l-4 border-white/15 max-w-xl mx-auto space-y-8 text-left text-base"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={7}
          >
            {[
              {
                icon: <FaUserPlus />,
                title: "Buat akun",
                desc: "Klik tombol Register di pojok kanan atas.",
              },
              {
                icon: <FaCheckCircle />,
                title: "Verifikasi email",
                desc: "Keamanan & akses penuh fitur.",
              },
              {
                icon: <FaClipboardList />,
                title: "Login",
                desc: "Masuk dengan akun yang sudah dibuat.",
              },
              {
                icon: <FaFileAlt />,
                title: "Isi data pribadi",
                desc: "Lengkap dan akurat pada halaman Edit CV.",
              },
              {
                icon: <FaFileAlt />,
                title:
                  "Lengkapi pendidikan, pekerjaan, keluarga, dan riwayat Jepang.",
                desc: "",
              },
              {
                icon: <FaHandsHelping />,
                title: "Simpan data",
                desc: "Simpan berkala agar aman.",
              },
              {
                icon: <FaDownload />,
                title: "Preview & ekspor",
                desc: "Excel siap pakai.",
              },
              {
                icon: <FaMoneyBillWave />,
                title: "Pembayaran",
                desc: "QRIS semua e-wallet & bank.",
              },
              {
                icon: <FaRocket />,
                title: "Gunakan CV",
                desc: "Siap melamar kerja di Jepang!",
              },
            ].map((step, i) => (
              <motion.li
                key={i}
                className="relative pl-14"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                {/* nomor bulat */}
                <div className="absolute left-[-22px] top-0 w-10 h-10 rounded-full bg-white/10 text-fuchsia-200 flex items-center justify-center font-bold border border-white/20 shadow-md">
                  {i + 1}
                </div>

                <div className="rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="text-xl text-fuchsia-300 bg-white/5 rounded-lg p-1.5 border border-white/10">
                      {step.icon}
                    </div>
                    <h3 className="font-semibold text-white text-lg">
                      {step.title}
                    </h3>
                  </div>
                  {step.desc && <p className="text-white/80">{step.desc}</p>}
                </div>
              </motion.li>
            ))}
          </motion.ol>

          {/* ========= DESKTOP (garis tengah + alternating) ========= */}
          <div className="hidden md:block relative max-w-5xl mx-auto">
            {/* garis tengah */}
            <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[3px] bg-gradient-to-b from-transparent via-white/25 to-transparent" />

            <ol className="space-y-14">
              {[
                {
                  icon: <FaUserPlus />,
                  title: "Buat akun",
                  desc: "Klik tombol Register di pojok kanan atas.",
                },
                {
                  icon: <FaCheckCircle />,
                  title: "Verifikasi email",
                  desc: "Keamanan & akses penuh fitur.",
                },
                {
                  icon: <FaClipboardList />,
                  title: "Login",
                  desc: "Masuk dengan akun yang sudah dibuat.",
                },
                {
                  icon: <FaFileAlt />,
                  title: "Isi data pribadi",
                  desc: "Lengkap dan akurat pada halaman Edit CV.",
                },
                {
                  icon: <FaFileAlt />,
                  title:
                    "Lengkapi pendidikan, pekerjaan, keluarga, dan riwayat Jepang.",
                  desc: "",
                },
                {
                  icon: <FaHandsHelping />,
                  title: "Simpan data",
                  desc: "Simpan berkala agar aman.",
                },
                {
                  icon: <FaDownload />,
                  title: "Preview & ekspor",
                  desc: "Excel siap pakai.",
                },
                {
                  icon: <FaMoneyBillWave />,
                  title: "Pembayaran",
                  desc: "QRIS semua e-wallet & bank.",
                },
                {
                  icon: <FaRocket />,
                  title: "Gunakan CV",
                  desc: "Siap melamar kerja di Jepang!",
                },
              ].map((step, i) => {
                const left = i % 2 === 0;
                return (
                  <motion.li
                    key={i}
                    className={`relative grid grid-cols-2 gap-10 items-start ${
                      left ? "" : ""
                    }`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    {/* node tengah (glow + nomor) */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-3">
                      <div className="relative h-12 w-12">
                        <div className="absolute inset-0 rounded-full bg-fuchsia-500/25 blur-xl" />
                        <div className="absolute inset-0 rounded-full border border-white/25 bg-[#0f1020]/60 backdrop-blur-md flex items-center justify-center text-sm font-bold text-fuchsia-200 shadow-xl">
                          {i + 1}
                        </div>
                      </div>
                    </div>

                    {/* kartu kiri/kanan */}
                    <div
                      className={`col-span-2 md:col-span-1 ${
                        left ? "pr-10" : "order-2 pl-10"
                      }`}
                    >
                      <div className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-white/15 to-white/5">
                        <div className="rounded-[inherit] bg-white/5 border border-white/10 backdrop-blur-md px-6 py-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white/10">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="text-2xl text-fuchsia-300 bg-white/5 rounded-lg p-1.5 border border-white/10">
                              {step.icon}
                            </div>
                            <h3 className="font-semibold text-white text-xl">
                              {step.title}
                            </h3>
                          </div>
                          {step.desc && (
                            <p className="text-white/80">{step.desc}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* spacer sisi seberang */}
                    <div
                      className={`hidden md:block md:col-span-1 ${
                        left ? "order-2" : ""
                      }`}
                    />
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-6 px-6 border-t border-white/10 bg-[#0f1020]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Kiri: teks copyright */}
          <p className="text-xs md:text-sm text-white/60 text-center md:text-left">
            &copy; {year} CV BUILDER JECA. Develop by{" "}
            <strong className="text-white">PT GIKEN KAIZEN EDUCENTER</strong>.
          </p>

          {/* Kanan: logo partner */}
          <div className="flex items-center gap-4">
            <img
              src={LogoGiken}
              alt="Giken Logo"
              className="h-8 object-contain"
            />
            <span className="text-[11px] text-white/40">In associate with</span>
            <img src={LogoJba} alt="JBA Logo" className="h-8 object-contain" />
            <img
              src={LogoNichirin}
              alt="Nichirin Logo"
              className="h-7 object-contain"
            />
          </div>
        </div>

        {/* Baris kedua: Customer service */}
        <div className="text-center mt-3 text-xs text-white/50">
          Customer Service:{" "}
          <a
            href="mailto:jecacreator@gmail.com"
            className="text-cyan-400 hover:underline"
          >
            jecacreator@gmail.com
          </a>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => {
            const btn = document.getElementById("scrollTopBtn");
            if (btn) btn.classList.add("animate-ping");
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => {
              if (btn) btn.classList.remove("animate-ping");
            }, 600);
          }}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xl rounded-full shadow-lg hover:scale-110 transition-all hidden items-center justify-center"
          aria-label="Kembali ke atas"
          id="scrollTopBtn"
        >
          ↑
        </button>
      </footer>
    </motion.div>
  );
};

export default LandingPage;
