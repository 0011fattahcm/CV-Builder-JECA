import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SswInput from '../../components/users/SswInput';

const formatJapaneseDate = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const DataPribadiAdmin = ({ userId }) => {
  const [form, setForm] = useState({
    foto: '',
    nama: '',
    namaKatakana: '',
    panggilan: '',
    panggilanKatakana: '',
    tanggalLahir: '',
    usia: '',
    jenisKelamin: '',
    tempatLahir: '',
    email: '',
    telp: '',
    alamatLengkap: '',
    tinggiBadan: '',
    beratBadan: '',
    statusPernikahan: '',
    agama: '',
    golonganDarah: '',
    alkohol: '',
    merokok: '',
    butaWarna: '',
    levelBahasa: '',
    sswDimiliki: '',
    nomorPaspor: '',
    masaBerlakuPasporJp: '',
    promosiDiri: '',
  });

  const [masaBerlakuPasporDate, setMasaBerlakuPasporDate] = useState('');
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchCV = async () => {
      if (!token || !userId) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rx78gpo1p6/cv/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          let isoDate = '';
          if (res.data.masaBerlakuPaspor) {
            const match = res.data.masaBerlakuPaspor.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日/);
            if (match) {
              const y = match[1];
              const m = match[2].padStart(2, '0');
              const d = match[3].padStart(2, '0');
              isoDate = `${y}-${m}-${d}`;
            }
          }

          setForm((prev) => ({
            ...prev,
            ...res.data,
            tanggalLahir: res.data.tanggalLahir ? new Date(res.data.tanggalLahir).toISOString().split('T')[0] : '',
            masaBerlakuPasporJp: res.data.masaBerlakuPaspor || '',
          }));

          setMasaBerlakuPasporDate(isoDate);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          toast.warn('⚠️ CV belum dibuat untuk user ini');
        } else {
          toast.error('❌ Error ambil CV: ' + err.message);
        }
      }
    };

    fetchCV();
  }, [token, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'masaBerlakuPaspor') {
      setMasaBerlakuPasporDate(value);
      if (value) {
        const d = new Date(value);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const formatted = `${year}年 ${month}月 ${day}日 まで`;
        setForm((prev) => ({ ...prev, masaBerlakuPasporJp: formatted }));
      } else {
        setForm((prev) => ({ ...prev, masaBerlakuPasporJp: '' }));
      }
      return;
    }

    if (name === 'tanggalLahir') {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      const finalAge = m < 0 || (m === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
      setForm((prev) => ({
        ...prev,
        tanggalLahir: value,
        usia: finalAge,
      }));
      return;
    }

    if (['nama', 'panggilan', 'tempatLahir', 'sswDimiliki'].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
      return;
    }

    if (['namaKatakana', 'panggilanKatakana'].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        foto: reader.result,
      }));
    };

    if (file) reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const dataToSend = { ...form, masaBerlakuPaspor: form.masaBerlakuPasporJp };

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/rx78gpo1p6/cv/${userId}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Data Pribadi Berhasil Disimpan', { position: 'top-right', autoClose: 3000, theme: 'colored' });
    } catch (error) {
      toast.error('❌ Gagal menyimpan data', { position: 'top-right', autoClose: 3000, theme: 'colored' });
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pas Foto */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-700 mb-3">Pas Foto</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {form.foto && <img src={form.foto} alt="Preview" className="h-32 w-32 rounded-xl object-cover border shadow" />}
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm w-full sm:w-auto" />
        </div>
      </div>

      {/* Form Data Pribadi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="nama" className="mb-1 font-semibold text-gray-700">Nama Lengkap</label>
          <input
            id="nama"
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Nama Lengkap"
            className="input-style"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="namaKatakana" className="mb-1 font-semibold text-gray-700">Nama Lengkap (Katakana)</label>
          <input
            id="namaKatakana"
            type="text"
            name="namaKatakana"
            value={form.namaKatakana}
            onChange={handleChange}
            placeholder="Nama Katakana"
            className="input-style"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="panggilan" className="mb-1 font-semibold text-gray-700">Nama Panggilan</label>
          <input
            id="panggilan"
            type="text"
            name="panggilan"
            value={form.panggilan}
            onChange={handleChange}
            placeholder="Nama Panggilan"
            className="input-style"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="panggilanKatakana" className="mb-1 font-semibold text-gray-700">Nama Panggilan (Katakana)</label>
          <input
            id="panggilanKatakana"
            type="text"
            name="panggilanKatakana"
            value={form.panggilanKatakana}
            onChange={handleChange}
            placeholder="Panggilan Katakana"
            className="input-style"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="tanggalLahir" className="mb-1 font-semibold text-gray-700">Tanggal Lahir</label>
          <input
            id="tanggalLahir"
            type="date"
            name="tanggalLahir"
            value={form.tanggalLahir}
            onChange={handleChange}
            className="input-style"
          />
          {form.tanggalLahir && (
            <div className="text-sm text-gray-500 mt-1">Format Jepang: {formatJapaneseDate(form.tanggalLahir)}</div>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="usia" className="mb-1 font-semibold text-gray-700">Usia (Otomatis)</label>
          <input
            id="usia"
            type="text"
            name="usia"
            value={form.usia ? `${form.usia}歳` : ''}
            readOnly
            placeholder="Usia"
            className="input-style"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="jenisKelamin" className="mb-1 font-semibold text-gray-700">Jenis Kelamin</label>
          <select
            id="jenisKelamin"
            name="jenisKelamin"
            value={form.jenisKelamin}
            onChange={handleChange}
            className="input-style"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="男">男 Laki-Laki</option>
            <option value="女">女 Perempuan</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="tempatLahir" className="mb-1 font-semibold text-gray-700">Tempat Lahir</label>
          <input
            id="tempatLahir"
            type="text"
            name="tempatLahir"
            value={form.tempatLahir}
            onChange={handleChange}
            placeholder="Tempat Lahir"
            className="input-style"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-semibold text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-style"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="telp" className="mb-1 font-semibold text-gray-700">No. Telepon</label>
          <input
            id="telp"
            type="text"
            name="telp"
            value={form.telp}
            onChange={handleChange}
            placeholder="No. Telepon"
            className="input-style"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label htmlFor="alamatLengkap" className="mb-1 font-semibold text-gray-700">Alamat Lengkap</label>
          <input
            id="alamatLengkap"
            type="text"
            name="alamatLengkap"
            value={form.alamatLengkap}
            onChange={handleChange}
            placeholder="Alamat Lengkap"
            className="input-style"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="tinggiBadan" className="mb-1 font-semibold text-gray-700">Tinggi Badan (cm)</label>
          <input
            id="tinggiBadan"
            type="number"
            name="tinggiBadan"
            value={form.tinggiBadan}
            onChange={handleChange}
            placeholder="Tinggi Badan (cm)"
            className="input-style"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="beratBadan" className="mb-1 font-semibold text-gray-700">Berat Badan (kg)</label>
          <input
            id="beratBadan"
            type="number"
            name="beratBadan"
            value={form.beratBadan}
            onChange={handleChange}
            placeholder="Berat Badan (kg)"
            className="input-style"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="statusPernikahan" className="mb-1 font-semibold text-gray-700">Status Pernikahan</label>
          <select
            id="statusPernikahan"
            name="statusPernikahan"
            value={form.statusPernikahan}
            onChange={handleChange}
            className="input-style"
          >
            <option value="">Pilih Status Pernikahan</option>
            <option value="無">無 Belum Menikah</option>
            <option value="有">有 Sudah Menikah</option>
            <option value="離婚">離婚 Cerai</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="agama" className="mb-1 font-semibold text-gray-700">Agama (Katakana)</label>
          <select
            id="agama"
            name="agama"
            value={form.agama}
            onChange={handleChange}
            className="input-style"
          >
            <option value="">-Pilih Agama-</option>
            <option value="イスラム教">イスラム教</option>
            <option value="プロテスタント">プロテスタント</option>
            <option value="カトリック">カトリック</option>
            <option value="ヒンドゥー教">ヒンドゥー教</option>
            <option value="仏教">仏教</option>
            <option value="儒教">儒教</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="golonganDarah" className="mb-1 font-semibold text-gray-700">Golongan Darah</label>
          <select
            id="golonganDarah"
            name="golonganDarah"
            value={form.golonganDarah}
            onChange={handleChange}
            className="input-style"
          >
            <option value="">Pilih Golongan Darah</option>
            <option value="A型">A型</option>
            <option value="B型">B型</option>
            <option value="AB型">AB型</option>
            <option value="O型">O型</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="alkohol" className="mb-1 font-semibold text-gray-700">Konsumsi Alkohol</label>
          <select
            id="alkohol"
            name="alkohol"
            value={form.alkohol}
            onChange={handleChange}
            className="input-style"
          >
            <option value="">Konsumsi Alkohol</option>
            <option value="いいえ">いいえ Tidak</option>
            <option value="はい">はい Ya</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="merokok" className="mb-1 font-semibold text-gray-700">Merokok</label>
          <select
            id="merokok"
            name="merokok"
            value={form.merokok}
            onChange={handleChange}
            className="input-style"
          >
            <option value="">Merokok</option>
            <option value="いいえ">いいえ Tidak</option>
            <option value="はい">はい Ya</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="butaWarna" className="mb-1 font-semibold text-gray-700">Buta Warna</label>
          <select
            id="butaWarna"
            name="butaWarna"
            value={form.butaWarna}
            onChange={handleChange}
            className="input-style"
          >
            <option value="">Buta Warna</option>
            <option value="いいえ">いいえ Tidak</option>
            <option value="はい">はい Ya</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="levelBahasa" className="mb-1 font-semibold text-gray-700">Level Bahasa Jepang</label>
          <select
            id="levelBahasa"
            name="levelBahasa"
            value={form.levelBahasa}
            onChange={handleChange}
            className="input-style"
          >
            <option value="">-Pilih Level Bahasa-</option>
            <option value="Tidak Ada">Tidak Ada</option>
            <option value="JFT Basic A2">JFT Basic A2</option>
            <option value="JLPT N5">JLPT N5</option>
            <option value="JLPT N4">JLPT N4</option>
            <option value="JLPT N3">JLPT N3</option>
            <option value="JLPT N2">JLPT N2</option>
            <option value="JLPT N1">JLPT N1</option>
          </select>
        </div>

        <SswInput
          value={form.sswDimiliki}
          onChange={(val) => setForm((prev) => ({ ...prev, sswDimiliki: val }))}
        />

        <div className="flex flex-col">
          <label htmlFor="nomorPaspor" className="mb-1 font-semibold text-gray-700">Nomor Paspor</label>
          <input
            id="nomorPaspor"
            type="text"
            name="nomorPaspor"
            value={form.nomorPaspor}
            onChange={handleChange}
            placeholder="Nomor Paspor"
            className="input-style"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="masaBerlakuPaspor" className="mb-1 font-semibold text-gray-700">Masa Berlaku Paspor</label>
          <input
            id="masaBerlakuPaspor"
            type="date"
            name="masaBerlakuPaspor"
            value={masaBerlakuPasporDate}
            onChange={handleChange}
            className="input-style"
            placeholder="例：2026年4月30日まで"
          />
          {form.masaBerlakuPasporJp && (
            <div className="text-sm text-gray-500 mt-1">Format Jepang: {form.masaBerlakuPasporJp}</div>
          )}
        </div>

        <div className="flex flex-col md:col-span-2">
          <label htmlFor="promosiDiri" className="mb-1 font-semibold text-gray-700">自己PR (Promosi Diri dalam bahasa Jepang)</label>
          <textarea
            id="promosiDiri"
            name="promosiDiri"
            value={form.promosiDiri}
            onChange={handleChange}
            placeholder="自己PR Promosi Diri（日本語で）"
            className="input-style md:col-span-2"
          />
        </div>
      </div>

      <div className="text-right mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          💾 Save Data Pribadi
        </button>
      </div>
    </div>
  );
};

export default DataPribadiAdmin;
