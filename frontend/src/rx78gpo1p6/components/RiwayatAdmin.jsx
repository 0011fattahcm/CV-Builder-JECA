import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { toast } from 'react-toastify';

const defaultRiwayat = {
  pernah: '',
  ijinTinggal: '',
  lamaTinggalMulai: '',
  lamaTinggalSelesai: '',
  perusahaanPenerima: '',
  lokasi: ''
};

const formatLamaTinggal = (start, end) => {
  if (!start || !end) return '';
  const s = new Date(start);
  const e = new Date(end);
  return `${s.getFullYear()}年　${String(s.getMonth() + 1).padStart(2, '0')}月　${String(s.getDate()).padStart(2, '0')}日 ～ ${e.getFullYear()}年　${String(e.getMonth() + 1).padStart(2, '0')}月　${String(e.getDate()).padStart(2, '0')}日`;
};

const parseLamaTinggal = (lamaTinggalStr) => {
  if (!lamaTinggalStr || !lamaTinggalStr.includes('～')) return { start: '', end: '' };

  const [startStr, endStr] = lamaTinggalStr.split('～').map(s => s.trim());

  const parseDate = (str) => {
    const year = str.match(/(\d{4})年/)?.[1];
    const month = str.match(/(\d{1,2})月/)?.[1].padStart(2, '0');
    const day = str.match(/(\d{1,2})日/)?.[1].padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    start: parseDate(startStr),
    end: parseDate(endStr)
  };
};

const RiwayatAdmin = ({ userId }) => {
  const [riwayat, setRiwayat] = useState(defaultRiwayat);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rx78gpo1p6/cv/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && res.data.riwayatJepang?.length > 0) {
          const rj = res.data.riwayatJepang[0];
          const { start, end } = parseLamaTinggal(rj.lamaTinggal || '');

          setRiwayat({
            pernah: rj.pernah || '',
            ijinTinggal: rj.ijinTinggal || '',
            lamaTinggalMulai: start,
            lamaTinggalSelesai: end,
            perusahaanPenerima: rj.perusahaanPenerima || '',
            lokasi: rj.lokasi || ''
          });
        } else {
          setRiwayat(defaultRiwayat);
        }
      } catch (err) {
        console.warn('⚠️ Riwayat Jepang belum ada atau gagal fetch:', err);
        setRiwayat(defaultRiwayat);
      }
    };

    fetchData();
  }, [userId, token]);

  const handleChange = (field, value) => {
    setRiwayat((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const cleanData = {
      riwayatJepang: [{
        pernah: riwayat.pernah,
        ijinTinggal: riwayat.ijinTinggal.trim(),
        lamaTinggal: formatLamaTinggal(riwayat.lamaTinggalMulai, riwayat.lamaTinggalSelesai),
        perusahaanPenerima: riwayat.perusahaanPenerima.trim(),
        lokasi: riwayat.lokasi.trim()
      }]
    };

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/rx78gpo1p6/cv/${userId}`, cleanData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('✅ Riwayat Jepang Berhasil Disimpan', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored'
      });
    } catch (err) {
      toast.error('❌ Gagal menyimpan Riwayat Jepang', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored'
      });
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-700 mb-3">Riwayat ke Jepang</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            name="pernah"
            value={riwayat.pernah}
            onChange={(e) => handleChange('pernah', e.target.value)}
            className="input-style"
          >
            <option value="">Pilih Status</option>
            <option value="無">Belum Pernah 無</option>
            <option value="有">Pernah 有</option>
          </select>
          <select
            name="ijinTinggal"
            value={riwayat.ijinTinggal}
            onChange={(e) => handleChange('ijinTinggal', e.target.value)}
            className="input-style"
          >
            <option value="">Pilih Jenis Izin Tinggal (在留資格)</option>
            <option value="Ginou Jisshu (技能実習)">Ginou Jisshu (技能実習)</option>
            <option value="Tokutei Ginou (特定技能)">Tokutei Ginou (特定技能)</option>
            <option value="Ryugaku (留学)">Ryugaku (留学)</option>
            <option value="Special Activities (特定活動)">Special Activities (特定活動)</option>
            <option value="Temporary Visit (短期滞在)">Temporary Visit (短期滞在)</option>
          </select>

          <div className="grid grid-cols-2 gap-2 col-span-1">
            <input
              type="date"
              name="lamaTinggalMulai"
              value={riwayat.lamaTinggalMulai}
              onChange={(e) => handleChange('lamaTinggalMulai', e.target.value)}
              className="input-style"
            />
            <input
              type="date"
              name="lamaTinggalSelesai"
              value={riwayat.lamaTinggalSelesai}
              onChange={(e) => handleChange('lamaTinggalSelesai', e.target.value)}
              className="input-style"
            />
          </div>
          <input
            type="text"
            placeholder="Perusahaan Penerima / Sekolah"
            name="perusahaanPenerima"
            value={riwayat.perusahaanPenerima}
            onChange={(e) => handleChange('perusahaanPenerima', e.target.value)}
            className="input-style"
          />
          <input
            type="text"
            placeholder="Lokasi di Jepang"
            name="lokasi"
            value={riwayat.lokasi}
            onChange={(e) => handleChange('lokasi', e.target.value)}
            className="input-style"
          />
        </div>
        {riwayat.lamaTinggalMulai && riwayat.lamaTinggalSelesai && (
          <div className="text-sm text-gray-600 mt-1">
            Lama Tinggal: {formatLamaTinggal(riwayat.lamaTinggalMulai, riwayat.lamaTinggalSelesai)}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          💾 Save Riwayat Jepang
        </button>
      </div>
    </div>
  );
};

export default RiwayatAdmin;
