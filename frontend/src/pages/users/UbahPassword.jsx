// src/pages/users/UbahPassword.jsx
import React, { useRef, useState } from "react";
import DashboardLayout from "../../components/users/DashboardLayout.jsx";
import axios from "../../utils/axios.js";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff } from "lucide-react";

const UbahPassword = () => {
  const currentRef = useRef(null);
  const newRef = useRef(null);
  const confirmRef = useRef(null);

  // state khusus untuk kontrol tipe input (text/password)
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const validate = (curr, next, confirm) => {
    if (!curr || !next || !confirm) return "Lengkapi semua kolom.";
    if (next.length < 6) return "Password baru minimal 6 karakter.";
    if (next === curr)
      return "Password baru tidak boleh sama dengan password lama.";
    if (next !== confirm) return "Konfirmasi password baru tidak cocok.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const curr = currentRef.current?.value || "";
    const next = newRef.current?.value || "";
    const conf = confirmRef.current?.value || "";

    const err = validate(curr, next, conf);
    if (err) {
      toast.warn(err);
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/users/update-password",
        { currentPassword: curr, newPassword: next },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password berhasil diubah.");
      if (currentRef.current) currentRef.current.value = "";
      if (newRef.current) newRef.current.value = "";
      if (confirmRef.current) confirmRef.current.value = "";
      setShow({ current: false, next: false, confirm: false });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal mengubah password.");
    } finally {
      setSubmitting(false);
    }
  };

  const Input = ({ id, label, refEl, visible, onToggle, autoComplete }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          id={id}
          ref={refEl}
          // KUNCI PERBAIKAN: tipe dikontrol oleh state
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          className="w-full rounded-xl pl-10 pr-10 py-2 border border-gray-300 bg-white text-gray-800 shadow-sm
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          placeholder={label}
          required
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // cegah kehilangan fokus saat klik
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          title={visible ? "Sembunyikan password" : "Tampilkan password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-md px-4 py-8">
        <header className="mb-5">
          <h1 className="text-2xl font-extrabold text-blue-700">
            Ubah Password
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Demi keamanan, gunakan password minimal 6 karakter dan berbeda dari
            yang sebelumnya.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="space-y-4 bg-white/95 backdrop-blur p-5 rounded-2xl shadow border border-gray-200"
        >
          <Input
            id="old-password"
            label="Password Lama"
            refEl={currentRef}
            visible={show.current}
            onToggle={() => setShow((s) => ({ ...s, current: !s.current }))}
            autoComplete="current-password"
          />
          <Input
            id="new-password"
            label="Password Baru"
            refEl={newRef}
            visible={show.next}
            onToggle={() => setShow((s) => ({ ...s, next: !s.next }))}
            autoComplete="new-password"
          />
          <Input
            id="confirm-password"
            label="Konfirmasi Password Baru"
            refEl={confirmRef}
            visible={show.confirm}
            onToggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500
                       text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg transition
                       disabled:opacity-60 disabled:cursor-not-allowed"
            aria-busy={submitting}
          >
            {submitting ? "Memproses…" : "Simpan Password Baru"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-3">
          Tips: gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol
          untuk membuat password lebih kuat.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default UbahPassword;
