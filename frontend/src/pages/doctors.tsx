import React from 'react';
import Navbar from '../components/Navbar';
import DoctorsDashboard from '../components/DoctorsDashboard';

export default function DoctorsPage() {
  return (
    <div>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
      <Navbar />
      <DoctorsDashboard />
    </div>
  );
} 