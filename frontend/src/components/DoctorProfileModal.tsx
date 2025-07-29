import React from 'react';
import { Doctor } from '../services/api';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  onClose: () => void;
}

const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({ doctor, onClose }) => {
  if (!doctor) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '2rem',
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.95)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>
            {doctor.name} - Doctor Profile
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}>
          {/* Basic Information */}
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
              Basic Information
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '1rem',
              borderRadius: '8px',
            }}>
              <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong>Specialization:</strong> {doctor.specialization}
              </p>
              <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong>Department:</strong> {doctor.department}
              </p>
              <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong>Experience:</strong> {doctor.experience} years
              </p>
              <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong>Education:</strong> {doctor.education}
              </p>
              <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong>Rating:</strong> ⭐ {doctor.rating}
              </p>
              <p style={{ color: '#cbd5e1' }}>
                <strong>Success Rate:</strong> {doctor.successRate}%
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
              Contact Information
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '1rem',
              borderRadius: '8px',
            }}>
              <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong>Email:</strong> {doctor.contact.email}
              </p>
              <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong>Phone:</strong> {doctor.contact.phone}
              </p>
              <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong>Location:</strong> {doctor.location}
              </p>
              <p style={{ color: '#cbd5e1' }}>
                <strong>Availability:</strong> {doctor.availability}
              </p>
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
              Qualifications
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '1rem',
              borderRadius: '8px',
            }}>
              <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong>Languages:</strong> {doctor.languages.join(', ')}
              </p>
              <p style={{ color: '#cbd5e1' }}>
                <strong>Certifications:</strong> {doctor.certifications.join(', ')}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
              Performance Statistics
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '1rem',
              borderRadius: '8px',
            }}>
              <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong>Surgeries Performed:</strong> {doctor.stats.surgeriesPerformed}
              </p>
              <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong>Patients Recovered:</strong> {doctor.stats.patientsRecovered}
              </p>
              <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong>Research Papers:</strong> {doctor.stats.researchPapers}
              </p>
              <p style={{ color: '#cbd5e1' }}>
                <strong>Awards:</strong> {doctor.stats.awards}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal; 