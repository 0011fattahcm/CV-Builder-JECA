import React, { useState } from "react";
import axios from "../../utils/axios.js";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/img/logo.png";
import Terms from "../../components/users/Terms.jsx";
import AnnouncementBox from "../../components/users/AnnouncementBox.jsx";
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

const Register = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return "Lengkapi formulir pendaftaran.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Format email tidak valid.";
    }
    if (form.password.length < 6) {
      return "Password minimal 6 karakter.";
    }
    if (form.password !== form.confirmPassword) {
      return "Konfirmasi password tidak cocok!";
    }
    if (!agreed) {
      return "Harap menyetujui Syarat & Ketentuan terlebih dahulu.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const err = validate();
    if (err) {
      setErrorMessage(err);
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("/api/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // simpan email sebelum reset form (bugfix navigasi)
      const emailForNext = form.email;

      setSuccessMessage("Registrasi berhasil! Silakan verifikasi email kamu.");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        setSuccessMessage("");
        navigate(`/verifikasi?email=${encodeURIComponent(emailForNext)}`);
      }, 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || "Registrasi gagal";
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-300 to-pink-400 animate-gradient flex flex-col justify-center items-center px-4 sm:px-6">
      <AnnouncementBox />

      <div className="text-center py-5 mb-6">
        <img
          src={Logo}
          alt="Logo JECA"
          className="w-20 h-20 mx-auto mb-5 rounded-full shadow-lg ring-2 ring-white/60"
        />
        <h1 className="text-3xl font-extrabold text-white drop-shadow">
          JECA CV BUILDER
        </h1>
        <p className="text-white/90 text-sm mt-1">
          Buat CV rapi & profesional dalam hitungan menit
        </p>
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur p-6 sm:p-8 rounded-2xl shadow-xl border border-white/40">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Nama */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                autoComplete="name"
                required
                className="w-full rounded-xl pl-10 pr-3 py-2 border border-gray-300 bg-white text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                autoComplete="email"
                required
                className="w-full rounded-xl pl-10 pr-3 py-2 border border-gray-300 bg-white text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-xl pl-10 pr-10 py-2 border border-gray-300 bg-white text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={
                    showPw ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter.</p>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPw2 ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-xl pl-10 pr-10 py-2 border border-gray-300 bg-white text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw2((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={
                    showPw2 ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="mt-1"
            />
            <label htmlFor="terms">
              Saya menyetujui{" "}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-blue-600 underline inline-flex items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4" />
                Syarat & Ketentuan
              </button>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            aria-busy={submitting}
          >
            {submitting ? "Memproses…" : "Register"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/users/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Login di sini
            </Link>
          </p>
        </form>

        {/* Alerts */}
        {errorMessage && (
          <div
            className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-md border border-red-200 text-sm shadow-sm animate-fade-in"
            role="alert"
            aria-live="polite"
          >
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div
            className="mt-4 bg-green-100 text-green-700 px-4 py-2 rounded-md border border-green-200 text-sm shadow-sm animate-fade-in"
            role="status"
            aria-live="polite"
          >
            {successMessage}
          </div>
        )}
      </div>

      <footer className="mt-6 text-sm text-white/90 text-center">
        &copy; {new Date().getFullYear()} PT Giken Kaizen Educenter. All rights
        reserved.
      </footer>

      <Terms isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
};

export default Register;
