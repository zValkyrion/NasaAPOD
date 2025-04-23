import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4 mt-auto">
      <p className="text-sm text-textSecondary dark:text-gray-400">
        © {currentYear} NASA App.
      </p>
      {/* Podrías añadir links a redes sociales o políticas aquí */}
    </footer>
  );
};

export default Footer;