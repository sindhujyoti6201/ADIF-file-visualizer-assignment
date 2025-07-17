import React from 'react';

const Navbar: React.FC = () => (
  <nav style={{
    width: '100%',
    background: 'rgba(30, 41, 59, 0.92)',
    color: '#fff',
    padding: '2.5rem 2rem',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  }}>
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontWeight: 700,
      fontSize: '2.2rem',
      letterSpacing: '0.01em',
      minHeight: '2.5rem',
    }}>
      <span style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>ADIF</span>
    </div>
  </nav>
);

export default Navbar; 