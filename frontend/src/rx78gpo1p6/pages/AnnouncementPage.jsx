import { useEffect, useState } from 'react';
import axios from '../../utils/axios.js';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';

const PengumumanPage = () => {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const res = await axios.get('/api/announcement/all');
    setList(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/announcement/${editId}`, { message });
        toast.success("Berhasil update pengumuman");
      } else {
        await axios.post('/api/announcement', { message });
        toast.success("Pengumuman ditambahkan");
      }
      setMessage("");
      setEditId(null);
      fetchData();
    } catch (err) {
      toast.error("Gagal simpan");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setMessage(item.message);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin mau hapus?")) return;
    await axios.delete(`/api/announcement/${id}`);
    toast.success("Dihapus");
    fetchData();
  };

  const handleActivate = async (id) => {
    await axios.patch(`/api/announcement/activate/${id}`);
    toast.success("Pengumuman diaktifkan");
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">📢 Manajemen Pengumuman</h1>

        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded shadow">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            {editId ? "✏️ Edit Pengumuman" : "➕ Tambah Pengumuman"}
          </label>
          <textarea
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Isi pengumuman..."
          ></textarea>
          <div className="flex items-center mt-3 gap-2">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              type="submit"
            >
              {editId ? "💾 Simpan Perubahan" : "📤 Tambah"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setMessage(""); }}
                className="text-gray-500 hover:underline text-sm"
              >
                Batal Edit
              </button>
            )}
          </div>
        </form>

        <ul className="space-y-4">
          {list.map((item) => (
            <li
              key={item._id}
              className={`border p-4 rounded shadow transition-all ${
                item.isActive ? "bg-green-50 border-green-400" : "bg-white"
              }`}
            >
              <div className="text-sm text-gray-800 max-h-[120px] overflow-auto whitespace-pre-line">
                {item.message}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  🗑️ Hapus
                </button>
                {item.isActive ? (
                  <button
                    onClick={async () => {
                      await axios.patch(`/api/announcement/deactivate-all`);
                      toast.success("Pengumuman dinonaktifkan");
                      fetchData();
                    }}
                    className="text-yellow-600 hover:underline text-sm"
                  >
                    🚫 Nonaktifkan
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(item._id)}
                    className="text-green-600 hover:underline text-sm"
                  >
                    ✅ Aktifkan
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
};

export default PengumumanPage;
