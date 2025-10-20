import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios.js";
import { Mail, Lock } from "lucide-react";
import Logo from "../../assets/img/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/rx78gpo1p6/login", {
        email,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/rx78gpo1p6/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 relative overflow-hidden">
      {/* background grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#1e293b_1px,transparent_1px)] [background-size:22px_22px] opacity-25"
      />
      {/* glowing blobs */}
      <div
        aria-hidden
        className="absolute -top-32 -right-20 h-72 w-72 bg-indigo-500/30 blur-3xl rounded-full"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-20 h-72 w-72 bg-pink-500/20 blur-3xl rounded-full"
      />

      <div className="relative z-10 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px]">
          {/* header logo + title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/10 border border-white/15 shadow-lg overflow-hidden">
              <img
                src={Logo}
                alt="Logo Admin"
                className="h-14 w-14 object-contain"
              />
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl" />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-white">
              Admin Panel — CV Builder JECA
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Silakan masuk untuk mengelola sistem.
            </p>
          </div>

          {/* form card */}
          <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-5 p-6 sm:p-7">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[13px] font-semibold text-slate-200 mb-1.5"
                >
                  Email Admin
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@domain.com"
                    className="w-full rounded-xl border border-white/10 bg-white/10 text-white placeholder:text-slate-400
                               pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/70
                               focus:border-indigo-400/70 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[13px] font-semibold text-slate-200 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/10 text-white placeholder:text-slate-400
                               pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/70
                               focus:border-indigo-400/70 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group relative w-full inline-flex items-center justify-center gap-2
                           rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                           hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
                           text-white font-semibold py-2.5 transition shadow-lg"
              >
                Login
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-xl ring-2 ring-white/0 group-hover:ring-white/10 transition"
                />
              </button>
            </form>

            <div className="px-6 sm:px-7 py-4 border-t border-white/10 text-[11px] text-slate-300/80">
              Akses ini khusus admin. Aktivitas anda mungkin dicatat untuk
              alasan keamanan.
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-300/80">
            © {new Date().getFullYear()} CV Builder JECA — Admin
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
