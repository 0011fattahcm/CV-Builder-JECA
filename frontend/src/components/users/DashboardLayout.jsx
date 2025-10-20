import React from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-pink-50 overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Konten utama */}
      <div className="flex flex-col w-full min-h-screen pl-16">
        <main className="flex-1 p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
