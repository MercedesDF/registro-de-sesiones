import React from 'react';

// Colores del Tema Azul (subconjunto usado en el Header)
const HEADER_BG_COLOR = '#2563EB'; // blue-600
const TEXT_ON_HEADER_COLOR = 'white';

const Header: React.FC = () => {
  return (
    <header style={{ backgroundColor: HEADER_BG_COLOR }} className="shadow-md p-3 sm:p-4 flex-shrink-0">
      <div className="container mx-auto flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8 mr-2 sm:mr-3" style={{ color: TEXT_ON_HEADER_COLOR }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6-2.292m0 0V21M12 6.042A8.967 8.967 0 0 1 6 3.75m6 2.292A8.966 8.966 0 0 0 18 3.75m0 14.25V6.369" />
        </svg>
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: TEXT_ON_HEADER_COLOR }}>
          Registro de Sesiones
        </h1>
      </div>
    </header>
  );
};

export default Header;