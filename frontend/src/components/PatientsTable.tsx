import React from 'react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  assignedDoctor: string;
  department: string;
  admissionDate: string;
  status: 'active' | 'discharged' | 'pending';
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  medicalHistory: {
    allergies: string[];
    chronicConditions: string[];
    surgeries: string[];
  };
  currentMedications: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
  }[];
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
  };
  appointments: {
    date: string;
    time: string;
    type: string;
    doctor: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }[];
}

interface PatientsTableProps {
  patients: Patient[];
  onViewProfile: (patient: Patient) => void;
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
  patientsPerPage: number;
  totalPatients: number;
}

const PatientsTable: React.FC<PatientsTableProps> = ({
  patients,
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
  // patientsPerPage,
  totalPatients,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'discharged': return '#6b7280';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

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
            Patients ({patients.length})
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
                Show All ({patients.length})
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
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Age</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Condition</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Assigned Doctor</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Department</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.id}
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
                  <td style={{ padding: '1rem' }}>{patient.name}</td>
                  <td style={{ padding: '1rem' }}>{patient.age}</td>
                  <td style={{ padding: '1rem' }}>{patient.condition}</td>
                  <td style={{ padding: '1rem' }}>{patient.assignedDoctor}</td>
                  <td style={{ padding: '1rem' }}>{patient.department}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: `${getStatusColor(patient.status)}20`,
                      color: getStatusColor(patient.status),
                      border: `1px solid ${getStatusColor(patient.status)}40`,
                    }}>
                      {patient.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => onViewProfile(patient)}
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
          Showing {startIndex + 1}-{Math.min(endIndex, totalPatients)} of {totalPatients} patients
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

export default PatientsTable; 