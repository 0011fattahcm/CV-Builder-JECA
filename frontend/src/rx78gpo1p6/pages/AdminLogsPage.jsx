import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios.js'; 
import AdminLayout from '../components/AdminLayout.jsx';
import { toast } from 'react-toastify';

const AdminLogsPage = () => {
  const [logsData, setLogsData] = useState({
    logs: [],
    total: 0,
    page: 1,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState(new Set());

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`/api/rx78gpo1p6/logs?page=${page}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Debugging log data
      console.log('Data logs:', res.data.logs);

      setLogsData({
        logs: res.data.logs || [],
        total: res.data.total || 0,
        page: res.data.page || 1,
        pages: res.data.pages || 1,
      });

      setSelectedLogs(new Set()); // reset pilihan saat pindah halaman
    } catch (err) {
      toast.error('Gagal ambil data log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Toggle checkbox pilih 1 log
  const toggleSelectLog = (id) => {
    setSelectedLogs((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  // Toggle checkbox pilih semua di halaman ini
  const toggleSelectAll = () => {
    if (
      selectedLogs.size === (logsData.logs?.length || 0) &&
      (logsData.logs?.length || 0) > 0
    ) {
      setSelectedLogs(new Set());
    } else {
      setSelectedLogs(new Set(logsData.logs.map((log) => log._id)));
    }
  };

  // Hapus log yang dipilih
  const handleDeleteConfirmed = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete('/api/rx78gpo1p6/logs', {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: Array.from(selectedLogs) },
      });
      toast.success('Log berhasil dihapus');
      setShowDeleteModal(false);
      fetchLogs(logsData.page);
    } catch (err) {
      toast.error('Gagal hapus log');
    }
  };  

  // Ganti halaman pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > logsData.pages) return;
    fetchLogs(newPage);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteSelected = () => {
    if (selectedLogs.size === 0) {
      toast.info('Pilih log yang ingin dihapus');
      return;
    }
    setShowDeleteModal(true); // tampilkan modal
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Log Aktivitas User</h1>

        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={handleDeleteSelected}
            disabled={selectedLogs.size === 0}
            className={`px-4 py-2 rounded ${
              selectedLogs.size === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Hapus yang dipilih ({selectedLogs.size})
          </button>

          <div>
            <button
              onClick={() => handlePageChange(logsData.page - 1)}
              disabled={logsData.page <= 1}
              className="px-3 py-1 border rounded mr-2 disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Halaman {logsData.page} dari {logsData.pages}
            </span>
            <button
              onClick={() => handlePageChange(logsData.page + 1)}
              disabled={logsData.page >= logsData.pages}
              className="px-3 py-1 border rounded ml-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading data log...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedLogs.size === (logsData.logs?.length || 0) && (logsData.logs?.length || 0) > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="border border-gray-300 p-2">Waktu</th>
                <th className="border border-gray-300 p-2">Email User</th>
                <th className="border border-gray-300 p-2">Aktivitas</th>
              </tr>
            </thead>
            <tbody>
              {logsData.logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    Log kosong
                  </td>
                </tr>
              ) : (
                logsData.logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedLogs.has(log._id)}
                        onChange={() => toggleSelectLog(log._id)}
                      />
                    </td>
                    <td className="border p-2">{new Date(log.waktu).toLocaleString()}</td>
                    <td className="border p-2">{log.user}</td>
                    <td className="border p-2">{log.aksi}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Hapus Log</h2>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus <strong>{selectedLogs.size}</strong> log?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminLogsPage;
