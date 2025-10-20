import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../../assets/img/logo.png";
import AnnouncementBox from "../../components/users/AnnouncementBox.jsx";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("verified") === "true") {
      toast.success("🎉 Email kamu sudah terverifikasi!");
      localStorage.removeItem("verified");
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!form.email || !form.password) {
      setErrorMessage("Email dan password wajib diisi.");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post("/api/users/login", form);
      const { token, user } = res.data || {};

      if (!user?._id) throw new Error("Data user tidak valid");
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userName", user.name || "");
      navigate(`/users/${user._id}/beranda`);
    } catch (err) {
      console.error("❌ Login error:", err?.response?.data || err.message);
      if (err?.response?.data?.message === "Akun Anda telah dinonaktifkan") {
        setErrorMessage(
          "⚠️ Akun Anda telah dinonaktifkan. Silakan hubungi admin."
        );
      } else {
        setErrorMessage("Login gagal, periksa email/password Anda.");
      }
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-300 to-pink-400 animate-gradient flex flex-col justify-center items-center px-4 sm:px-6">
      <AnnouncementBox />

      <div className="text-center mb-6">
        <img
          src={Logo}
          alt="Logo JECA"
          className="w-20 h-20 mx-auto mb-5 rounded-full shadow-lg ring-2 ring-white/60"
        />
        <h1 className="text-3xl font-extrabold text-white drop-shadow">
          JECA CV BUILDER
        </h1>
        <p className="text-white/90 text-sm mt-1">
          Silakan masuk untuk melanjutkan
        </p>
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur p-6 sm:p-8 rounded-2xl shadow-xl border border-white/40">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

          {/* Password */}
          <div>
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
                placeholder="Masukkan password"
                autoComplete="current-password"
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
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            aria-busy={submitting}
          >
            <LogIn className="w-4 h-4" />
            {submitting ? "Memproses…" : "Login"}
          </button>

          <div className="text-sm text-center text-gray-600 space-y-1">
            <p>
              Belum punya akun?{" "}
              <Link
                to="/users/register"
                className="text-blue-700 font-semibold hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
            <p>
              <Link
                to="/lupa-password"
                className="text-blue-700 font-semibold hover:underline"
              >
                Lupa password?
              </Link>
            </p>
          </div>
        </form>

        {errorMessage && (
          <div
            className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-md border border-red-200 text-sm shadow-sm animate-fade-in"
            role="alert"
            aria-live="polite"
          >
            {errorMessage}
          </div>
        )}
      </div>

      <footer className="mt-6 text-sm text-white/90 text-center">
        &copy; {new Date().getFullYear()} PT Giken Kaizen Educenter. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Login;
