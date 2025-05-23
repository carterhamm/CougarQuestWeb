import React from 'react';
import logo from '../assets/FathersandSonsLogo.png';

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#fff',
    }}>
      <img
        src={logo}
        alt="Loading"
        style={{
          width: '20rem'
        }}
      />
    </div>
  );
}
