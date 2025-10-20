import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const pekerjaanOptions = [
  '理容師',
  '未就労',
  '電気技師',
  '学生',
  '家事',
  '石工',
  '定年',
  '大工',
  '公務員',
  '記者',
  '軍人',
  '牧師',
  '農家',
  '教師',
  '畜産',
  '運転手',
  '会社員',
  '商人',
  'アルバイト',
  '役人',
  '農民',
  '村長',
  '家事手伝い',
  '自営業',
];

const defaultForm = {
  keluarga: Array(6).fill().map(() => ({
    urutan: '',
    nama: '',
    pekerjaan: '',
    usia: ''
  }))
};

const KeluargaAdmin = ({ userId }) => {
  const [form, setForm] = useState(defaultForm);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rx78gpo1p6/cv/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && Array.isArray(res.data.keluarga)) {
          const fixedArray = [...res.data.keluarga];
          while (fixedArray.length < 6) {
            fixedArray.push({ urutan: '', nama: '', pekerjaan: '', usia: '' });
          }

          const updated = fixedArray.map(item => ({
            urutan: item.urutan || '',
            nama: item.nama || '',
            pekerjaan: item.pekerjaan || '',
            usia: item.usia?.toString() || ''
          }));

          setForm({ keluarga: updated });
        } else {
          setForm(defaultForm);
        }
      } catch (err) {
        console.warn('⚠️ Data keluarga belum ada atau gagal fetch:', err);
        setForm(defaultForm);
      }
    };

    fetchData();
  }, [userId, token]);

  const handleChange = (index, field, value) => {
    const updated = [...form.keluarga];
    updated[index][field] = value;
    setForm({ keluarga: updated });
  };

  const handleSave = async () => {
    const dataToSend = form.keluarga
      .filter(k => k.urutan || k.nama || k.pekerjaan || k.usia)
      .map(({ urutan, nama, pekerjaan, usia }) => ({
        urutan: urutan.trim(),
        nama: nama.trim(),
        pekerjaan: pekerjaan.trim(),
        usia: usia.toString().trim()
      }));

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/rx78gpo1p6/cv/${userId}`, { keluarga: dataToSend }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('✅ Data Keluarga Berhasil Disimpan', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored'
      });
    } catch (err) {
      toast.error('❌ Gagal menyimpan data keluarga', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored'
      });
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {form.keluarga.map((item, index) => (
        <div key={index} className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">Anggota Keluarga {index + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={item.urutan}
              onChange={(e) => handleChange(index, 'urutan', e.target.value)}
              className="input-style"
            >
              <option value="">Pilih Urutan</option>
              <option value="父">Ayah 父</option>
              <option value="母">Ibu 母</option>
              <option value="兄">Kakak Laki-laki 兄</option>
              <option value="姉">Kakak Perempuan 姉</option>
              <option value="弟">Adik Laki-laki 弟</option>
              <option value="妹">Adik Perempuan 妹</option>
              <option value="子供">Anak 子供</option>
              <option value="夫">Suami 夫</option>
              <option value="妻">Istri 妻</option>
            </select>
            <input
              type="text"
              placeholder="Nama"
              value={item.nama}
              onChange={(e) => handleChange(index, 'nama', e.target.value)}
              className="input-style"
            />
            <select
              value={item.pekerjaan}
              onChange={(e) => handleChange(index, 'pekerjaan', e.target.value)}
              className="input-style"
            >
              <option value="">Pilih Pekerjaan</option>
              {pekerjaanOptions.map((job, i) => (
                <option key={i} value={job}>{job}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Usia"
              value={item.usia}
              onChange={(e) => handleChange(index, 'usia', e.target.value)}
              className="input-style"
              min="0"
            />
          </div>
          {item.usia && (
            <div className="text-sm text-gray-600 mt-1">{item.usia} 歳</div>
          )}
        </div>
      ))}

      <div className="text-right">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          💾 Simpan Data Keluarga
        </button>
      </div>
    </div>
  );
};

export default KeluargaAdmin;
