import React from 'react';

const QrisPopup = ({ isOpen, qrUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[360px] shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-center">Scan QRIS untuk Bayar</h2>
        {qrUrl ? (
          <img src={qrUrl} alt="QR Code" className="w-56 h-56 mx-auto" />
        ) : (
          <p className="text-center text-gray-500">Memuat QR Code...</p>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default QrisPopup;
