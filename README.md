# CV Builder JECA

**CV Builder JECA** adalah aplikasi web berbasis MERN Stack yang memungkinkan pengguna membuat, mengelola, dan mengekspor CV dalam format profesional Jepang. Aplikasi ini juga dilengkapi sistem pembayaran QRIS, kuota ekspor, dan fitur tambahan seperti gabung PDF dan konversi gambar ke PDF.

---

## 🧱 Teknologi yang Digunakan

- **Frontend**: React.js + Vite + Tailwind CSS  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB + Mongoose  
- **Authentication**: JWT (JSON Web Token)  
- **Pembayaran**: Xendit QRIS  
- **Export File**: ExcelJS, LibreOffice (convert Excel ke PDF)  
- **Realtime**: Socket.io  
- **Email Service**: Nodemailer  

---

## 📦 Library yang Digunakan

### Frontend:
- `axios`, `react-router-dom`, `react-toastify`, `socket.io-client`
- `react-modal`, `date-fns`, `clsx`, `tailwindcss`

### Backend:
- `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`
- `nodemailer`, `exceljs`, `child_process`, `cors`, `uuid`
- `xendit-node`, `socket.io`, `mime-types`, `multer`
- `LibreOffice` CLI untuk konversi Excel ke PDF

---

## 🌐 Deployment

**Frontend**: Niagahoster/Hostinger
**Backend**: Amazon Web Service EC2
**Database**: MongoDB Atlas

---

## 🚀 Fitur Utama

### 👤 Untuk Pengguna
- Register, verifikasi email, login
- Lupa & reset password
- Edit CV (step-by-step):
  - Data Pribadi (dengan format Jepang)
  - Pendidikan, Pekerjaan, Keluarga, Riwayat ke Jepang
- Upload pas foto
- Preview CV sebelum export
- Export CV:
  - Format Excel (dengan styling khusus)
  - Format PDF (konversi via LibreOffice)
- Sistem kuota ekspor:
  - +2 kuota setelah pembayaran QRIS
  - -1 kuota tiap kali export
- Riwayat penggunaan:
  - Cek jumlah export, kuota tersisa, histori pembayaran,
   login, register, merger PDF, convert PDF

### 📄 Fitur Dokumen Tambahan
- **Gabung PDF (PDF Merger)**
  - Upload hingga 10 file PDF
  - Bisa atur urutan sebelum digabung
  - Output bernama otomatis: `Merger_namauser.pdf`
- **Konversi JPG ke PDF**
  - Upload maksimal 10 file JPG
  - Opsi ukuran: A4 atau ukuran asli
  - Bisa memilih untuk gabungkan semua gambar ke satu PDF atau file terpisah

---

### 👑 Untuk Admin
- Login via route aman `/rx78gpo1p6`
- Dashboard admin:
  - Statistik total user, export, pembayaran, dll
- Manajemen data user (CRUD)
- Daftar CV per user, langsung bisa export
- Tabel riwayat pembayaran (50 data per halaman)
- Tabel log aktivitas user
- Mengirim pengumuman ke user
---

## 💰 Sistem Pembayaran
- QRIS via Xendit (integrasi API)
- QR popup muncul jika kuota habis
- Polling otomatis setiap 5 detik hingga status `PAID`
- Kuota ditambahkan +2 jika sukses bayar, auto download aktif
- Proteksi: tidak bisa export jika user tutup modal sebelum bayar

---

## 📌 Fitur Rencana Pengembangan
Fitur berikut **direncanakan** untuk masa depan:
- Pilihan template CV lain (minimalis, modern, dll)
- Multibahasa (Indo, Jepang, Inggris)
- Sistem paket premium & notifikasi email

---

## ✨ Kontribusi
Project ini dikembangkan oleh tim **JECA DEVELOPER**.  
