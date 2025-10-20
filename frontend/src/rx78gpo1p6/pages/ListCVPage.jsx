import React, { useEffect, useMemo, useState } from "react";
import axios from "../../utils/axios.js";
import AdminLayout from "../components/AdminLayout";
import {
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "react-toastify";

const ListCVPage = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportingId, setExportingId] = useState(null);

  // UI state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // bisa diganti 10/20/50 dari dropdown

  const fetchCVs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("/api/rx78gpo1p6/cv", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // filter CV yang punya user
      const filtered = res.data.filter((cv) => cv.user);
      setCvs(filtered);
    } catch (err) {
      console.error(err);
      toast.error("Gagal ambil data CV");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  // reset ke page 1 saat search atau pageSize berubah
  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  // filter by nama/email
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cvs;
    return cvs.filter((cv) => {
      const name = cv.user?.name || "";
      const email = cv.user?.email || "";
      return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
    });
  }, [cvs, search]);

  // paginate
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Yakin ingin hapus CV user ini?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/api/rx78gpo1p6/cv/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("CV berhasil dihapus");
      fetchCVs();
    } catch (err) {
      console.error(err);
      toast.error("Gagal hapus CV");
    }
  };

  const handleExport = async (userId, type = "excel") => {
    try {
      setExportingId(userId);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        `/api/rx78gpo1p6/export/excel/${userId}?type=${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const fileName = type === "pdf" ? "CV_Export.pdf" : "CV_Export.xlsx";
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error(`Gagal export ${type.toUpperCase()}`);
    } finally {
      setExportingId(null);
    }
  };

  const gotoPrev = () => setPage((p) => Math.max(1, p - 1));
  const gotoNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-800">CV User</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCVs}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
            title="Reload"
          >
            <RefreshCw className="w-4 h-4" />
            Reload
          </button>
        </div>
      </div>

      {/* Toolbar: search & page size */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>Tampilkan</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded-md px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>per halaman</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16" />
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-300">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terakhir Update
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {current.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    {search
                      ? "Tidak ada data yang cocok dengan pencarian"
                      : "Data CV kosong"}
                  </td>
                </tr>
              ) : (
                current.map((cv, i) => (
                  <tr key={cv._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {(page - 1) * pageSize + i + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {cv.user?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {cv.user?.email || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {cv.updatedAt
                        ? new Date(cv.updatedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleExport(cv.user?._id, "excel")}
                          disabled={exportingId === cv.user?._id}
                          title="Export Excel"
                          className={`inline-flex items-center gap-1 text-green-600 hover:text-green-800 ${
                            exportingId === cv.user?._id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          XLSX
                        </button>
                        {/* Kalau butuh tombol PDF lagi, tinggal aktifkan:
                        <button
                          onClick={() => handleExport(cv.user?._id, 'pdf')}
                          disabled={exportingId === cv.user?._id}
                          title="Export PDF"
                          className={`inline-flex items-center gap-1 text-red-600 hover:text-red-800 ${
                            exportingId === cv.user?._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          PDF
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer: info & pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border-t">
            <div className="text-sm text-gray-600">
              Menampilkan{" "}
              <span className="font-medium">
                {total === 0 ? 0 : (page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, total)}
              </span>{" "}
              dari <span className="font-medium">{total}</span> data
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={gotoPrev}
                disabled={page === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-sm">
                Halaman <span className="font-medium">{page}</span> /{" "}
                {totalPages}
              </span>
              <button
                onClick={gotoNext}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm disabled:opacity-50"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .loader { border-top-color: #3498db; animation: spinner 1s linear infinite; }
        @keyframes spinner { to { transform: rotate(360deg); } }
      `}</style>
    </AdminLayout>
  );
};

export default ListCVPage;
