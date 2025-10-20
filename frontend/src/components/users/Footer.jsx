import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full text-center text-sm text-gray-500 py-4 border-t bg-white">
      &copy; {new Date().getFullYear()} PT Giken Kaizen Educenter. All rights reserved.
    </footer>
  );
};

export default Footer;
