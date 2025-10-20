import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import { Trash2, Edit } from 'lucide-react';
import { toast } from 'react-toastify';

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('/api/rx78gpo1p6/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Gagal ambil data user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin hapus user ini?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/rx78gpo1p6/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User berhasil dihapus');
      fetchUsers();
    } catch (err) {
      toast.error('Gagal hapus user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Data User</h1>
      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">#</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id} className="border-b">
                <td className="py-2">{i + 1}</td>
                <td>{u.nama}</td>
                <td>{u.email}</td>
                <td className="flex gap-2 items-center py-2">
                  <button className="text-blue-600 hover:underline">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:underline">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Tidak ada user ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
