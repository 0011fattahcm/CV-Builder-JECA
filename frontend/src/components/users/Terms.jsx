import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Terms = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto text-gray-800"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-xl font-bold text-blue-700">
                Syarat & Ketentuan Penggunaan JECA CV Builder
              </h1>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-red-500 text-sm"
              >
                Tutup
              </button>
            </div>

            <p className="mb-4 text-sm">
              Harap membaca dengan saksama sebelum menggunakan layanan kami.
              Dengan mendaftar dan menggunakan JECA CV Builder, Anda dianggap
              telah membaca, memahami, dan menyetujui seluruh isi dari Syarat &
              Ketentuan berikut ini:
            </p>

            <h2 className="text-base font-semibold mt-6 mb-2">
              1. Pengumpulan dan Penggunaan Data
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                Data yang Anda masukkan akan digunakan untuk menyusun CV sesuai
                dengan format standar Jepang.
              </li>
              <li>
                Data pribadi seperti nama, alamat, riwayat pendidikan, dan
                pekerjaan akan disimpan secara aman di server kami.
              </li>
              <li>
                Kami tidak akan membagikan data Anda kepada pihak ketiga tanpa
                persetujuan eksplisit dari Anda.
              </li>
            </ul>

            <h2 className="text-base font-semibold mt-6 mb-2">
              2. Tanggung Jawab Pengguna
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                Anda bertanggung jawab penuh atas keakuratan dan kebenaran data
                yang Anda input.
              </li>
              <li>
                Penggunaan data palsu, menyesatkan, atau tidak sah dapat
                menyebabkan penangguhan akun atau pelaporan ke pihak berwenang.
              </li>
              <li>
                Anda tidak diperkenankan menyalahgunakan sistem untuk tujuan
                yang melanggar hukum atau etika.
              </li>
            </ul>

            <h2 className="text-base font-semibold mt-6 mb-2">
              3. Keamanan dan Privasi
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                Kami menggunakan teknologi enkripsi dan proteksi server untuk
                menjaga data Anda tetap aman.
              </li>
              <li>
                Namun, Anda juga berkewajiban menjaga kerahasiaan akun dan tidak
                membagikan kredensial login ke pihak lain.
              </li>
              <li>
                Jika terjadi aktivitas mencurigakan, segera laporkan kepada tim
                kami.
              </li>
            </ul>

            <h2 className="text-base font-semibold mt-6 mb-2">
              4. Perubahan dan Penghentian Layanan
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                Kami berhak melakukan perubahan terhadap fitur, struktur, atau
                isi layanan tanpa pemberitahuan sebelumnya.
              </li>
              <li>
                Anda juga berhak untuk menghapus akun Anda kapan saja, dan kami
                akan menghapus data Anda dari sistem sesuai permintaan.
              </li>
            </ul>

            <h2 className="text-base font-semibold mt-6 mb-2">
              5. Hak Kekayaan Intelektual
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                Seluruh konten visual, logo, desain CV, dan sistem merupakan
                milik eksklusif JECA dan tidak boleh digunakan tanpa izin.
              </li>
              <li>
                Anda diperbolehkan menggunakan hasil CV untuk keperluan pribadi
                dan profesional Anda sendiri.
              </li>
            </ul>

            <h2 className="text-base font-semibold mt-6 mb-2">6. Kontak</h2>
            <p className="text-sm">
              Untuk pertanyaan, laporan, atau permintaan khusus terkait data dan
              penggunaan layanan, silakan hubungi kami melalui email di{" "}
              <strong>jecacreator@gmail.com</strong>.
            </p>

            <p className="text-sm mt-6 text-gray-600">
              Terima kasih telah menggunakan JECA CV Builder. Dengan
              melanjutkan, Anda dianggap telah menyetujui ketentuan ini.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Terms;
