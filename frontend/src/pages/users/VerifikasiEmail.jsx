import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../utils/axios.js'; 
import { toast } from 'react-toastify';
import Logo from '../../assets/img/logo.png';

const VerifikasiEmail = () => {
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
  const [kode, setKode] = useState('');
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/verify-code`, {
        email,
        code: kode,
      });
      toast.success('✅ Email kamu berhasil diverifikasi! Sekarang kamu bisa login.');
      localStorage.setItem('verified', 'true');

      setTimeout(() => {
        navigate('/users/login');
      }, 2000); // kasih delay biar user lihat toast-nya dulu
      
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Verifikasi gagal');
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/resend-code`, { email });
      toast.success('✅ Kode verifikasi telah dikirim ulang ke email kamu');
  
      // Disable tombol dan mulai hitung mundur
      setResendDisabled(true);
      setCountdown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Gagal kirim ulang kode');
    }
  };
  
  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, countdown]);  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-300 to-pink-400 animate-gradient flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="text-center mb-6">
        <img src={Logo} alt="Logo JECA" className="w-20 h-20 mx-auto mb-5 rounded-full shadow-lg" />
        <h1 className="text-3xl font-extrabold text-white">JECA CV GENERATOR</h1>
        <p className="text-white text-sm mt-2">Masukkan kode verifikasi yang dikirim ke <strong>{email}</strong></p>
      </div>

      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kode Verifikasi</label>
            <input
              type="text"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              maxLength={6}
              placeholder="Contoh: 123456"
              className="w-full rounded-xl px-4 py-2 border border-gray-300 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 hover:brightness-110"
          >
            Verifikasi Email
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
  Belum menerima kode?{' '}
  <button
    type="button"
    onClick={handleResend}
    disabled={resendDisabled}
    className={`font-semibold hover:underline ${
      resendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-700'
    }`}
  >
    Kirim Ulang Kode {resendDisabled && `(${countdown}s)`}
  </button>
</p>

      </div>

      <footer className="mt-6 text-sm text-white opacity-80 text-center">
        &copy; 2025 PT Giken Kaizen Educenter. All rights reserved.
      </footer>
    </div>
  );
};

export default VerifikasiEmail;
