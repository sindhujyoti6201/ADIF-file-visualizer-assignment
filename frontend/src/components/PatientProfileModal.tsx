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

interface PatientProfileModalProps {
  patient: Patient | null;
  onClose: () => void;
}

const PatientProfileModal: React.FC<PatientProfileModalProps> = ({ patient, onClose }) => {
  if (!patient) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'discharged': return '#6b7280';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

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
      zIndex: 1000,
      padding: '2rem',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Header */}
        <div style={{
          padding: '2rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0,
          }}>
            Patient Profile
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.5rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {/* Basic Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Basic Information
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Name</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.name}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Age</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.age} years</p>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Gender</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.gender}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Status</label>
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
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Medical Information
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Condition</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.condition}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Department</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.department}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Assigned Doctor</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.assignedDoctor}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Admission Date</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.admissionDate}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Contact Information
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Phone</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.contact.phone}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Email</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.contact.email}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Address</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.contact.address}</p>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Vital Signs
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
            }}>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Blood Pressure</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.vitalSigns.bloodPressure}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Heart Rate</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.vitalSigns.heartRate} bpm</p>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Temperature</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.vitalSigns.temperature}°F</p>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Oxygen Saturation</label>
                <p style={{ fontSize: '1rem', color: '#1f2937', margin: '0.25rem 0' }}>{patient.vitalSigns.oxygenSaturation}%</p>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Medical History
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Allergies</label>
                <div style={{ margin: '0.25rem 0' }}>
                  {patient.medicalHistory.allergies.length > 0 ? (
                    patient.medicalHistory.allergies.map((allergy, index) => (
                      <span key={index} style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        background: '#fef3c7',
                        color: '#92400e',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        margin: '0.125rem',
                      }}>
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>None</p>
                  )}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>Chronic Conditions</label>
                <div style={{ margin: '0.25rem 0' }}>
                  {patient.medicalHistory.chronicConditions.length > 0 ? (
                    patient.medicalHistory.chronicConditions.map((condition, index) => (
                      <span key={index} style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        background: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        margin: '0.125rem',
                      }}>
                        {condition}
                      </span>
                    ))
                  ) : (
                    <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>None</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Medications */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Current Medications
            </h3>
            {patient.currentMedications.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
              }}>
                {patient.currentMedications.map((medication, index) => (
                  <div key={index} style={{
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
                      {medication.name}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0.25rem 0' }}>
                      <strong>Dosage:</strong> {medication.dosage}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0.25rem 0' }}>
                      <strong>Frequency:</strong> {medication.frequency}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0.25rem 0' }}>
                      <strong>Start Date:</strong> {medication.startDate}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '1rem', color: '#6b7280' }}>No current medications</p>
            )}
          </div>

          {/* Appointments */}
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Recent Appointments
            </h3>
            {patient.appointments.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
              }}>
                {patient.appointments.map((appointment, index) => (
                  <div key={index} style={{
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
                      {appointment.type}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0.25rem 0' }}>
                      <strong>Date:</strong> {appointment.date}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0.25rem 0' }}>
                      <strong>Time:</strong> {appointment.time}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0.25rem 0' }}>
                      <strong>Doctor:</strong> {appointment.doctor}
                    </p>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: appointment.status === 'completed' ? '#d1fae5' : 
                                appointment.status === 'scheduled' ? '#dbeafe' : '#fef3c7',
                      color: appointment.status === 'completed' ? '#065f46' : 
                             appointment.status === 'scheduled' ? '#1e40af' : '#92400e',
                    }}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '1rem', color: '#6b7280' }}>No recent appointments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileModal; 