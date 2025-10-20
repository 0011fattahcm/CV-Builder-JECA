import React, { useEffect, useMemo, useState } from "react";
import axios from "../../utils/axios.js"; // axios kustom kamu
import AdminLayout from "../components/AdminLayout";
import {
  Trash2,
  Edit,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // opsi: 10 / 20 / 50

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("/api/rx78gpo1p6/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        throw new Error("Data users tidak valid");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal ambil data user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset page saat search atau pageSize berubah
  useEffect(() => {
    setPage(1);
  }, [searchTerm, pageSize]);

  // Filter by nama/email
  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
    );
  }, [users, searchTerm]);

  // Pagination slice
  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  const gotoPrev = () => setPage((p) => Math.max(1, p - 1));
  const gotoNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // Toggle aktif/nonaktif
  const toggleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `/api/rx78gpo1p6/users/${id}/status`,
        { isActive: status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Status pengguna berhasil diperbarui");
      fetchUsers();
    } catch (err) {
      toast.error("Gagal memperbarui status pengguna");
    }
  };

  // Edit
  const handleEditClick = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`/api/rx78gpo1p6/users/${editingUser._id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User berhasil diupdate");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Gagal update user");
    }
  };

  // Add
  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post("/api/rx78gpo1p6/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User berhasil ditambahkan");
      setShowAddModal(false);
      setNewUser({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      toast.error("Gagal menambahkan user");
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/api/rx78gpo1p6/users/${deleteTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User berhasil dihapus");
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error("Gagal hapus user");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-800">Data User</h1>
        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
          title="Reload"
        >
          <RefreshCw className="w-4 h-4" />
          Reload
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        {/* Toolbar: search & page size */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-2 px-4">#</th>
                <th className="px-4">Nama</th>
                <th className="px-4">Email</th>
                <th className="px-4">Status</th>
                <th className="px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {current.length > 0 ? (
                current.map((u, i) => (
                  <tr key={u._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">
                      {(page - 1) * pageSize + i + 1}
                    </td>
                    <td className="px-4">{u.name}</td>
                    <td className="px-4">{u.email}</td>
                    <td className="px-4">
                      <button
                        onClick={() => toggleStatus(u._id, !u.isActive)}
                        className={`px-2 py-1 rounded text-white ${
                          u.isActive
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {u.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(u)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    {searchTerm
                      ? "Tidak ada data yang cocok dengan pencarian"
                      : "Data tidak ditemukan"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: info & pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border-t">
          <div className="text-sm text-gray-600">
            Menampilkan{" "}
            <span className="font-medium">
              {total === 0 ? 0 : (page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, total)}
            </span>{" "}
            dari <span className="font-medium">{total}</span> user
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
              Halaman <span className="font-medium">{page}</span> / {totalPages}
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

      {/* Modal Edit User */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nama</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah User */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Tambah User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nama</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus User */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Hapus User</h2>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus user{" "}
              <strong>{deleteTarget.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
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

export default UsersPage;
