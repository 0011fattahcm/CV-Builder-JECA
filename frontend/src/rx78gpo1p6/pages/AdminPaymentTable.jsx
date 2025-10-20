import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios.js';
import AdminLayout from '../components/AdminLayout.jsx';

const AdminPaymentTable = () => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');    
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  const fetchPayments = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/payment/histories`, {
        params: {
          page: pageNumber,
          status: statusFilter,
          keyword: search,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data.data);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('❌ Gagal ambil data payment:', err);
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchPayments(page);
  }, [page]);

  const formatDate = (iso) => new Date(iso).toLocaleString('id-ID');

  return (
    <AdminLayout>
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-800">Riwayat Pembayaran CV</h2>
      <div className="flex flex-wrap gap-4 items-center mb-4">
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border border-gray-300 px-3 py-1 rounded"
  >
    <option value="ALL">Semua Status</option>
    <option value="PAID">PAID</option>
    <option value="PENDING">PENDING</option>
  </select>

  <input
    type="text"
    placeholder="Cari email atau ref ID..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border border-gray-300 px-3 py-1 rounded w-64"
  />

  <button
    onClick={() => fetchPayments(1)}
    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
  >
    Terapkan
  </button>
  <button
  onClick={() => {
    setStatusFilter('ALL');
    setSearch('');
    fetchPayments(1);
  }}
  className="text-sm text-gray-500 underline"
>
  Reset Filter
</button>

</div>

      {loading ? (
        <p className="text-gray-600">Memuat data...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-3 py-2 border">No</th>
                  <th className="px-3 py-2 border">Email</th>
                  <th className="px-3 py-2 border">Amount</th>
                  <th className="px-3 py-2 border">Status</th>
                  <th className="px-3 py-2 border">Kuota</th>
                  <th className="px-3 py-2 border">Ref ID</th>
                  <th className="px-3 py-2 border">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay, i) => (
                  <tr key={pay._id} className="text-center">
                    <td className="px-3 py-2 border">{(page - 1) * 50 + i + 1}</td>
                    <td className="px-3 py-2 border">{pay.payerEmail}</td>
                    <td className="px-3 py-2 border">Rp {pay.amount.toLocaleString('id-ID')}</td>
                    <td className={`px-3 py-2 border ${pay.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {pay.paymentStatus}
                    </td>
                    <td className="px-3 py-2 border">{pay.remainingExports}</td>
                    <td className="px-3 py-2 border">{pay.referenceId}</td>
                    <td className="px-3 py-2 border">{formatDate(pay.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <p className="text-sm text-gray-600">Halaman {page} dari {totalPages}</p>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminPaymentTable;
