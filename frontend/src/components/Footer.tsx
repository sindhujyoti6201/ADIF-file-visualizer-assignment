import React from 'react';

const Footer: React.FC = () => (
  <footer style={{
    width: '100%',
    background: 'rgba(30, 41, 59, 0.92)',
    color: '#e0e7ef',
    padding: '2.5rem 0', // Increased height
    position: 'fixed',
    left: 0,
    bottom: 0,
    zIndex: 1000,
    textAlign: 'center',
    fontSize: '1.5rem', // Larger font
    letterSpacing: '0.01em',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.08)'
  }}>
    <span>&copy; {new Date().getFullYear()} Auto Distribution of Implant Fixtures (ADIF). All rights reserved.</span>
  </footer>
);

export default Footer; 