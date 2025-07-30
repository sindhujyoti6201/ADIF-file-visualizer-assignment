import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { uploadAndProcessFile, Feature, bookAppointment } from '../services/api';
import Navbar from '../components/Navbar';
import { Toaster, toast } from 'react-hot-toast';

export default function BookDoctorsAppointment() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const router = useRouter();

  const doctors = [
    { id: 'DOC001', name: 'Dr. Sarah Johnson', specialization: 'Cardiology' },
    { id: 'DOC002', name: 'Dr. Michael Chen', specialization: 'Neurology' },
    { id: 'DOC003', name: 'Dr. Emily Rodriguez', specialization: 'Pediatrics' },
    { id: 'DOC004', name: 'Dr. James Wilson', specialization: 'Orthopedics' },
    { id: 'DOC005', name: 'Dr. Lisa Thompson', specialization: 'Dermatology' },
  ];

  const fileTypes = [
    'Prescription',
    'Diagnosis Report',
    'Lab Results',
    'Medical Certificate',
    'Other Medical Document'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`Document selected: ${file.name}`, {
        duration: 2000,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please upload prescription or diagnosis details', {
        duration: 4000,
      });
      return;
    }

    if (!selectedDoctor) {
      toast.error('Please select a doctor', {
        duration: 4000,
      });
      return;
    }

    if (!patientName || !patientPhone || !appointmentDate || !appointmentTime) {
      toast.error('Please fill in all required fields', {
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Create appointment data
      const appointmentData = {
        patientName,
        patientPhone,
        selectedDoctor,
        appointmentDate,
        appointmentTime,
        notes,
        documentName: selectedFile.name,
        documentSize: selectedFile.size,
        bookingDate: new Date().toISOString(),
      };

      // Call the book appointment API
      const response = await bookAppointment(appointmentData);

      setUploadProgress(100);
      clearInterval(progressInterval);

      toast.success('Doctor\'s Appointment booked successfully!', {
        duration: 4000,
      });

      // Reset form
      setSelectedFile(null);
      setSelectedDoctor('');
      setPatientName('');
      setPatientPhone('');
      setAppointmentDate('');
      setAppointmentTime('');
      setNotes('');

      // Stay on the current page after successful booking

    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Failed to book appointment. Please try again.', {
        duration: 4000,
      });
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`Document dropped: ${file.name}`, {
        duration: 2000,
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
              <Toaster
          position="top-center"
          toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar />
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
          filter: 'brightness(0.7) blur(1px)'
        }}
      >
        <source src="https://catalyzer-fe-public-assets.s3.us-east-1.amazonaws.com/mixkit-close-up-of-an-iv-drip-46366-hd-ready.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '8rem',
        paddingBottom: '7rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '2rem',
          textAlign: 'center',
          textShadow: '0 2px 16px rgba(0,0,0,0.25)',
        }}>
          Book Doctor's Appointment
        </h1>

        <div style={{
          width: '100%',
          maxWidth: '900px',
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            padding: '2rem',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <form onSubmit={handleSubmit}>
              {/* Upload Prescription/Diagnosis Section */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
                  Upload Prescription or Diagnosis Details
                </h2>
                
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{
                    border: '2px dashed rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '3rem',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <p style={{ color: '#cbd5e1', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    Drag and drop your medical documents here, or click to browse
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Upload prescription, diagnosis reports, lab results, etc.
                  </p>
                  
                  <label
                    htmlFor="file-upload"
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      background: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    Choose Document
                    <input
                      id="file-upload"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileSelect}
                      disabled={loading}
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.dcm,.txt,.doc,.docx,.xls,.xlsx"
                    />
                  </label>
                </div>

                {selectedFile && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}>
                    <p style={{ color: '#10b981', fontSize: '0.9rem' }}>
                      <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}

                {/* Upload Progress */}
                {loading && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        background: '#3b82f6',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      Processing... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>

              {/* Patient Information */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
                  Patient Information
                </h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '2rem',
                }}>
                  <div>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter patient name"
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="Enter phone number"
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Doctor Selection */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
                  Select Doctor
                </h2>
                
                <div>
                  <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    Choose Doctor *
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="">-- Select Doctor --</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Appointment Details */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
                  Appointment Details
                </h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '2rem',
                }}>
                  <div>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Appointment Date *
                    </label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Appointment Time *
                    </label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
                  Additional Notes
                </h2>
                
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes about the appointment..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  disabled={loading || !selectedFile || !selectedDoctor || !patientName || !patientPhone || !appointmentDate || !appointmentTime}
                  style={{
                    padding: '1rem 3rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#fff',
                    background: loading || !selectedFile || !selectedDoctor || !patientName || !patientPhone || !appointmentDate || !appointmentTime ? 'rgba(255, 255, 255, 0.2)' : '#3b82f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading || !selectedFile || !selectedDoctor || !patientName || !patientPhone || !appointmentDate || !appointmentTime ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: loading || !selectedFile || !selectedDoctor || !patientName || !patientPhone || !appointmentDate || !appointmentTime ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && selectedFile && selectedDoctor && patientName && patientPhone && appointmentDate && appointmentTime) {
                      e.currentTarget.style.background = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && selectedFile && selectedDoctor && patientName && patientPhone && appointmentDate && appointmentTime) {
                      e.currentTarget.style.background = '#3b82f6';
                    }
                  }}
                >
                  {loading ? 'Booking Appointment...' : 'Book Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 