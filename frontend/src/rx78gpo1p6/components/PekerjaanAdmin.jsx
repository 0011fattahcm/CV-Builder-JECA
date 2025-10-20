import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { toast } from 'react-toastify';

const defaultForm = {
  pekerjaan: [
    { namaPerusahaan: '', rincianKerja: '', mulai: '', selesai: '' },
    { namaPerusahaan: '', rincianKerja: '', mulai: '', selesai: '' },
    { namaPerusahaan: '', rincianKerja: '', mulai: '', selesai: '' },
    { namaPerusahaan: '', rincianKerja: '', mulai: '', selesai: '' },
  ]
};

const formatJapanesePeriod = (start, end) => {
  if (!start || !end) return '';
  const s = new Date(start);
  const e = new Date(end);
  return `${s.getFullYear()}年 ${s.getMonth() + 1}月 ～ ${e.getFullYear()}年 ${e.getMonth() + 1}月`;
};

const PekerjaanAdmin = ({ userId }) => {
  const [form, setForm] = useState(defaultForm);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rx78gpo1p6/cv/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && Array.isArray(res.data.pekerjaan)) {
          const fixedArray = [...res.data.pekerjaan];
          while (fixedArray.length < 4) {
            fixedArray.push({ namaPerusahaan: '', rincianKerja: '', masa: '' });
          }

          const updated = defaultForm.pekerjaan.map((_, i) => {
            const pekerjaan = fixedArray[i] || {};

            let mulai = '', selesai = '';
            const rawMasa = pekerjaan.masa || pekerjaan.masaKerja;
            if (rawMasa?.includes('～')) {
              const [startStr, endStr] = rawMasa.split('～').map(s => s.trim());
              const parseMonth = (str) => {
                const year = str.match(/(\d{4})年/)?.[1];
                const month = str.match(/(\d{1,2})月/)?.[1].padStart(2, '0');
                return `${year}-${month}`;
              };
              mulai = parseMonth(startStr);
              selesai = parseMonth(endStr);
            }

            return {
              namaPerusahaan: pekerjaan.namaPerusahaan || '',
              rincianKerja: pekerjaan.rincianKerja || '',
              mulai,
              selesai
            };
          });

          setForm({ pekerjaan: updated });
        }
      } catch (err) {
        console.warn('⚠️ Gagal ambil data pekerjaan:', err);
        setForm(defaultForm);
      }
    };

    fetchData();
  }, [userId, token]);

  const handleChange = (index, field, value) => {
    const updated = [...form.pekerjaan];
    updated[index][field] = value;
    setForm({ pekerjaan: updated });
  };

  const handleSave = async () => {
    const dataToSend = form.pekerjaan.map(p => ({
      namaPerusahaan: p.namaPerusahaan.trim(),
      rincianKerja: p.rincianKerja.trim(),
      masaKerja: formatJapanesePeriod(p.mulai, p.selesai)
    }));

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/rx78gpo1p6/cv/${userId}`, { pekerjaan: dataToSend }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('✅ Data Pekerjaan Berhasil Disimpan', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored'
      });
    } catch (err) {
      toast.error('❌ Gagal menyimpan data pekerjaan', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored'
      });
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {form.pekerjaan.map((job, index) => (
        <div key={index} className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">Pekerjaan {index + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor={`namaPerusahaan-${index}`} className="font-semibold text-gray-700 block mb-1">Nama Perusahaan</label>
              <input
                id={`namaPerusahaan-${index}`}
                type="text"
                placeholder="Nama Perusahaan"
                value={job.namaPerusahaan}
                onChange={(e) => handleChange(index, 'namaPerusahaan', e.target.value)}
                className="input-style"
              />
            </div>
            <div>
              <label htmlFor={`rincianKerja-${index}`} className="font-semibold text-gray-700 block mb-1">Rincian Posisi Kerja (日本語で)</label>
              <input
                id={`rincianKerja-${index}`}
                type="text"
                placeholder="Rincian Posisi Kerja (日本語で)"
                value={job.rincianKerja}
                onChange={(e) => handleChange(index, 'rincianKerja', e.target.value)}
                className="input-style"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Periode Kerja</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="month"
                  value={job.mulai}
                  onChange={(e) => handleChange(index, 'mulai', e.target.value)}
                  className="input-style"
                />
                <input
                  type="month"
                  value={job.selesai}
                  onChange={(e) => handleChange(index, 'selesai', e.target.value)}
                  className="input-style"
                />
              </div>
              {job.mulai && job.selesai && (
                <div className="text-sm text-gray-600 mt-1">
                  Masa Kerja: {formatJapanesePeriod(job.mulai, job.selesai)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="text-right">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          💾 Save Pekerjaan
        </button>
      </div>
    </div>
  );
};

export default PekerjaanAdmin;
