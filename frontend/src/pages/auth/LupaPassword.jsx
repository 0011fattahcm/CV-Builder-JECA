import React, { useState } from 'react';
import axios from '../../utils/axios.js'; 
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Logo from '../../assets/img/logo.png';

const LupaPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/forgot-password`, { email });
      toast.success('📧 Link reset password telah dikirim ke email kamu');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Gagal mengirim email reset');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-300 to-pink-400 animate-gradient flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="text-center mb-6">
        <img src={Logo} alt="Logo JECA" className="w-20 h-20 mx-auto mb-5 rounded-full shadow-lg" />
        <h1 className="text-3xl font-extrabold text-white">JECA CV GENERATOR</h1>
      </div>

      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email kamu"
              className="w-full rounded-xl px-4 py-2 border border-gray-300 bg-white text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 hover:brightness-110"
          >
            Kirim Link Reset Password
          </button>

          <p className="text-sm text-center text-gray-600">
            Ingat passwordmu?{' '}
            <Link to="/users/login" className="text-blue-700 font-semibold hover:underline">
              Kembali ke login
            </Link>
          </p>
        </form>
      </div>

      <footer className="mt-6 text-sm text-white opacity-80 text-center">
        &copy; 2025 PT Giken Kaizen Educenter. All rights reserved.
      </footer>
    </div>
  );
};

export default LupaPassword;
