import React from 'react';
// FIX: Removed unused import of 'Link' to resolve member not found error.

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto py-8 px-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} SuniMed. All rights reserved.</p>
        <p className="text-sm mt-2">Nền tảng học tập y khoa hàng đầu.</p>
      </div>
    </footer>
  );
};

export default Footer;
