import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios.js'; 
import { toast } from 'react-toastify';
import Logo from '../../assets/img/logo.png';
import { Eye, EyeOff } from 'lucide-react'; // pakai icon library lucide-react (atau ganti)

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/reset-password`, {
        token,
        newPassword
      });
      toast.success('✅ Password berhasil direset, silakan login ulang');
      navigate('/users/login');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Gagal reset password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-300 to-pink-400 animate-gradient flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="text-center mb-6">
        <img src={Logo} alt="Logo JECA" className="w-20 h-20 mx-auto mb-5 rounded-full shadow-lg" />
        <h1 className="text-3xl font-extrabold text-white">JECA CV GENERATOR</h1>
      </div>

      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="space-y-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password Baru</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password baru"
              className="w-full rounded-xl px-4 py-2 border border-gray-300 bg-white text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 hover:brightness-110"
          >
            Simpan Password Baru
          </button>
        </div>
      </div>

      <footer className="mt-6 text-sm text-white opacity-80 text-center">
        &copy; 2025 PT Giken Kaizen Educenter. All rights reserved.
      </footer>
    </div>
  );
};

export default ResetPassword;
