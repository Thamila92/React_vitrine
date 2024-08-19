// HeaderLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar'; // Assure-toi que le chemin vers ton Navbar est correct

const HeaderLayout = () => {
  return (
    <div className="layout">
      <Navbar />
      <div className="main-content">
        {/* Outlet va rendre le contenu des sous-routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default HeaderLayout;
