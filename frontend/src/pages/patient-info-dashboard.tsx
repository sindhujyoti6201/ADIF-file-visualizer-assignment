import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { Toaster, toast } from 'react-hot-toast';

interface PatientData {
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  height: string;
  weight: string;
  allergies: string[];
  currentMedications: string[];
  disorders: Disorder[];
  recommendedDoctors: Doctor[];
  recentTests: Test[];
  riskFactors: string[];
}

interface Disorder {
  name: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  symptoms: string[];
  treatment: string;
  progress: number;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  rating: number;
  experience: string;
  availability: string[];
  contact: string;
  image: string;
}

interface Test {
  name: string;
  date: string;
  result: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
}

export default function PatientDashboard() {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load patient data from localStorage (from uploaded file)
    const loadPatientData = () => {
      const storedData = localStorage.getItem('healthcareData');
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          
          // Check if patientInfo exists in the uploaded data
          if (data.patientInfo && data.patientInfo.patient) {
            setPatientData(data.patientInfo.patient);
          } else {
            // Fallback to mock data if patientInfo is not available
            const mockPatientData: PatientData = {
              name: "Sarah Johnson",
              age: 34,
              gender: "Female",
              bloodType: "O+",
              height: "5&apos;6&quot;",
              weight: "145 lbs",
              allergies: ["Penicillin", "Shellfish", "Dust"],
              currentMedications: ["Metformin", "Vitamin D", "Omega-3"],
              disorders: [
                {
                  name: "Type 2 Diabetes",
                  severity: "Medium",
                  description: "A chronic condition affecting how your body metabolizes glucose.",
                  symptoms: ["Increased thirst", "Frequent urination", "Fatigue"],
                  treatment: "Lifestyle changes, medication, regular monitoring",
                  progress: 75
                },
                {
                  name: "Hypertension",
                  severity: "Low",
                  description: "High blood pressure requiring monitoring and management.",
                  symptoms: ["Headaches", "Shortness of breath", "Chest pain"],
                  treatment: "Medication, diet changes, exercise",
                  progress: 90
                }
              ],
              recommendedDoctors: [
                {
                  id: "1",
                  name: "Dr. Michael Chen",
                  specialization: "Endocrinologist",
                  hospital: "City General Hospital",
                  rating: 4.8,
                  experience: "15 years",
                  availability: ["Mon", "Wed", "Fri"],
                  contact: "+1 (555) 123-4567",
                  image: "👨‍⚕️"
                },
                {
                  id: "2",
                  name: "Dr. Emily Rodriguez",
                  specialization: "Cardiologist",
                  hospital: "Heart Care Center",
                  rating: 4.9,
                  experience: "12 years",
                  availability: ["Tue", "Thu", "Sat"],
                  contact: "+1 (555) 234-5678",
                  image: "👩‍⚕️"
                },
                {
                  id: "3",
                  name: "Dr. James Wilson",
                  specialization: "Primary Care Physician",
                  hospital: "Family Medical Group",
                  rating: 4.7,
                  experience: "18 years",
                  availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                  contact: "+1 (555) 345-6789",
                  image: "👨‍⚕️"
                }
              ],
              recentTests: [
                {
                  name: "Blood Glucose Test",
                  date: "2024-01-15",
                  result: "140 mg/dL",
                  status: "Abnormal"
                },
                {
                  name: "Blood Pressure",
                  date: "2024-01-15",
                  result: "135/85 mmHg",
                  status: "Normal"
                },
                {
                  name: "HbA1c Test",
                  date: "2024-01-10",
                  result: "7.2%",
                  status: "Abnormal"
                }
              ],
              riskFactors: ["Family history of diabetes", "Sedentary lifestyle", "Obesity"]
            };
            setPatientData(mockPatientData);
          }
        } catch (error) {
          console.error('Error parsing patient data:', error);
          toast.error('Failed to load patient data');
        }
      } else {
        toast.error('No patient data found. Please upload a file first.');
        router.push('/');
      }
      setLoading(false);
    };

    loadPatientData();
  }, [router]);

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentModal(true);
  };

  const handleConfirmAppointment = () => {
    if (!appointmentDate || !appointmentTime) {
      toast.error('Please select date and time');
      return;
    }

    toast.success(`Appointment booked with ${selectedDoctor?.name} for ${appointmentDate} at ${appointmentTime}`);
    setShowAppointmentModal(false);
    setAppointmentDate('');
    setAppointmentTime('');
    setSelectedDoctor(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f59e0b';
      case 'Medium': return '#3b82f6';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return '#ef4444';
      case 'Abnormal': return '#f59e0b';
      case 'Normal': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
          <p>Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p>No patient data available. Please upload a file first.</p>
          <button 
            onClick={() => router.push('/')}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
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
      <Toaster
        position="top-center"
        containerStyle={{
          top: 80,
          left: 20,
          bottom: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            marginTop: '1rem',
          },
        }}
      />
      <Navbar />
      
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '3rem 2rem',
        color: '#fff',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Welcome back, {patientData.name}! 👋
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Here&apos;s your personalized health analysis and recommendations
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Patient Overview */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e293b' }}>
            Patient Overview
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Age & Gender</h3>
              <p>{patientData.age} years old, {patientData.gender}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🩸</div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Blood Type</h3>
              <p>{patientData.bloodType}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📏</div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Height & Weight</h3>
              <p>{patientData.height}, {patientData.weight}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Allergies</h3>
              <p>{patientData.allergies.length} known allergies</p>
            </div>
          </div>
        </div>

        {/* Disorders Analysis */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e293b' }}>
            Health Conditions & Progress
          </h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {patientData.disorders.map((disorder, index) => (
              <div key={index} style={{
                border: `2px solid ${getSeverityColor(disorder.severity)}`,
                borderRadius: '12px',
                padding: '1.5rem',
                background: `${getSeverityColor(disorder.severity)}10`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1e293b' }}>
                    {disorder.name}
                  </h3>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    background: getSeverityColor(disorder.severity),
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                  }}>
                    {disorder.severity}
                  </span>
                </div>
                <p style={{ marginBottom: '1rem', color: '#64748b' }}>{disorder.description}</p>
                
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Symptoms:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {disorder.symptoms.map((symptom, idx) => (
                      <span key={idx} style={{
                        padding: '0.25rem 0.5rem',
                        background: '#f1f5f9',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                      }}>
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Treatment:</h4>
                  <p style={{ color: '#64748b' }}>{disorder.treatment}</p>
                </div>

                <div>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Progress:</h4>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${disorder.progress}%`,
                      height: '100%',
                      background: getSeverityColor(disorder.severity),
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                    {disorder.progress}% improvement
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Doctors */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e293b' }}>
            Recommended Doctors
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {patientData.recommendedDoctors.map((doctor) => (
              <div key={doctor.id} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                background: '#fff',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '3rem', marginRight: '1rem' }}>{doctor.image}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {doctor.name}
                    </h3>
                    <p style={{ color: '#64748b', marginBottom: '0.25rem' }}>{doctor.specialization}</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{doctor.hospital}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Experience: {doctor.experience}</p>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Rating: ⭐ {doctor.rating}/5</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Contact:</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{doctor.contact}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Available:</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {doctor.availability.map((day, idx) => (
                      <span key={idx} style={{
                        padding: '0.25rem 0.5rem',
                        background: '#3b82f6',
                        color: '#fff',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                      }}>
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleBookAppointment(doctor)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tests */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e293b' }}>
            Recent Test Results
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {patientData.recentTests.map((test, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                border: `1px solid ${getStatusColor(test.status)}`,
                borderRadius: '8px',
                background: `${getStatusColor(test.status)}10`,
              }}>
                <div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{test.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Date: {test.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{test.result}</p>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    background: getStatusColor(test.status),
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                  }}>
                    {test.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e293b' }}>
            Risk Factors
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {patientData.riskFactors.map((factor, index) => (
              <span key={index} style={{
                padding: '0.75rem 1rem',
                background: '#fef3c7',
                color: '#92400e',
                borderRadius: '12px',
                border: '1px solid #f59e0b',
                fontWeight: '500',
              }}>
                ⚠️ {factor}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && selectedDoctor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Book Appointment with {selectedDoctor.name}
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Date:
              </label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Time:
              </label>
              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
              >
                <option value="">Select a time</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleConfirmAppointment}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Confirm Appointment
              </button>
              <button
                onClick={() => setShowAppointmentModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#6b7280',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 