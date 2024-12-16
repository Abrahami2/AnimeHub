// src/components/SharinganLoader.jsx
import React from 'react';
import './SharinganLoader.css'; // This will be your CSS file for the loader

const SharinganLoader = () => {
  return (
    <div className="iris">
      <div className="pupil"></div>
      <div className="tomoes">
        <div className="tomoe-area"></div>
        <div className="tomoe-area"></div>
        <div className="tomoe-area"></div>
      </div>
    </div>
  );
};

export default SharinganLoader;
