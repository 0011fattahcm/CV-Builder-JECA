import React from 'react';

const ActivityLog = ({ logs = [] }) => {
  if (!Array.isArray(logs)) {
    return <div className="p-4 text-center text-gray-600">Data log tidak valid</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Log Aktivitas</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm">
          <thead className="text-left bg-gray-100">
            <tr>
              <th className="p-2">Waktu</th>
              <th className="p-2">Aksi</th>
              <th className="p-2">User</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  Log kosong
                </td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{log.waktu}</td>
                  <td className="p-2">{log.aksi}</td>
                  <td className="p-2">{log.user}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;
