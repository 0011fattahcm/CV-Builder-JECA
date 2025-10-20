// /src/rx78gpo1p6/components/AdminLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen ml-16 md:ml-64 p-4">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
