import React from 'react';
import { Doctor } from '../services/api';

interface DoctorsTableProps {
  doctors: Doctor[];
  onViewProfile: (doctor: Doctor) => void;
  currentPage: number;
  totalPages: number;
  showAll: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageChange: (page: number) => void;
  onShowAll: () => void;
  onShowPaginated: () => void;
  startIndex: number;
  endIndex: number;
  doctorsPerPage: number;
  totalDoctors: number;
}

const DoctorsTable: React.FC<DoctorsTableProps> = ({
  doctors,
  onViewProfile,
  currentPage,
  totalPages,
  showAll,
  onNextPage,
  onPrevPage,
  onPageChange,
  onShowAll,
  onShowPaginated,
  startIndex,
  endIndex,
  doctorsPerPage,
  totalDoctors,
}) => {
  // Debug logging
  console.log('DoctorsTable Debug:', {
    doctorsLength: doctors.length,
    totalDoctors,
    doctorsPerPage,
    totalPages,
    currentPage,
    startIndex,
    endIndex,
    showAll
  });

  return (
    <>
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        padding: '2rem',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '2rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
            Doctors ({doctors.length})
          </h2>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}>
            {!showAll ? (
              <button
                onClick={onShowAll}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                }}
              >
                Show All ({doctors.length})
              </button>
            ) : (
              <button
                onClick={onShowPaginated}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                }}
              >
                Show less
              </button>
            )}
          </div>
        </div>
        
        <div style={{
          overflowX: 'auto',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: '#fff',
          }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Specialization</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Department</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Experience</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Rating</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Success Rate</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td style={{ padding: '1rem' }}>{doctor.name}</td>
                  <td style={{ padding: '1rem' }}>{doctor.specialization}</td>
                  <td style={{ padding: '1rem' }}>{doctor.department}</td>
                  <td style={{ padding: '1rem' }}>{doctor.experience} years</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: doctor.rating >= 4.5 ? '#10b98120' : 
                                 doctor.rating >= 4.0 ? '#f59e0b20' : '#ef444420',
                      color: doctor.rating >= 4.5 ? '#10b981' : 
                             doctor.rating >= 4.0 ? '#f59e0b' : '#ef4444',
                      border: `1px solid ${
                        doctor.rating >= 4.5 ? '#10b98140' : 
                        doctor.rating >= 4.0 ? '#f59e0b40' : '#ef444440'
                      }`,
                    }}>
                      ⭐ {doctor.rating}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: '#3b82f620',
                      color: '#3b82f6',
                      border: '1px solid #3b82f640',
                    }}>
                      {doctor.successRate}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => onViewProfile(doctor)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#2563eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#3b82f6';
                      }}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '2rem',
        padding: '1rem',
        background: 'rgba(30, 41, 59, 0.9)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>
          Showing {startIndex + 1}-{Math.min(endIndex, totalDoctors)} of {totalDoctors} doctors
        </div>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
        }}>
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 0.75rem',
              background: currentPage === 1 ? 'rgba(255, 255, 255, 0.2)' : '#3b82f6',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600',
              opacity: currentPage === 1 ? 0.6 : 1,
            }}
          >
            First
          </button>
          
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              background: currentPage === 1 ? 'rgba(255, 255, 255, 0.2)' : '#3b82f6',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600',
              opacity: currentPage === 1 ? 0.6 : 1,
            }}
          >
            ← Previous
          </button>
          
          {/* Page Numbers */}
          <div style={{
            display: 'flex',
            gap: '0.25rem',
          }}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: currentPage === pageNum ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    minWidth: '2rem',
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <span style={{
            padding: '0.5rem 0.75rem',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: '600',
          }}>
            of {totalPages}
          </span>
          
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              background: currentPage === totalPages ? 'rgba(255, 255, 255, 0.2)' : '#3b82f6',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600',
              opacity: currentPage === totalPages ? 0.6 : 1,
            }}
          >
            Next →
          </button>
          
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 0.75rem',
              background: currentPage === totalPages ? 'rgba(255, 255, 255, 0.2)' : '#3b82f6',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600',
              opacity: currentPage === totalPages ? 0.6 : 1,
            }}
          >
            Last
          </button>
        </div>
      </div>
    </>
  );
};

export default DoctorsTable; 