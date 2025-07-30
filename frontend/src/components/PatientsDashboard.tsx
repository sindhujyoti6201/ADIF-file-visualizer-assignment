"use client";

import React, { useEffect, useState } from 'react';
import { getPatients, BackendPatient } from '../services/api';
import { Toaster, toast } from 'react-hot-toast';
import PatientsFilters from './PatientsFilters';
import PatientsTable from './PatientsTable';
import PatientsInsightsDashboard from './PatientsInsightsDashboard';

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

const PatientsDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'details' | 'insights'>('details');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const patientsPerPage = 10;

  // Transform backend patient data to UI format
  const transformBackendPatient = (backendPatient: BackendPatient): Patient => {
    // Generate a name based on ID and gender
    const names = {
      Male: ['John Smith', 'Robert Chen', 'James Anderson', 'Michael Davis', 'David Wilson', 'Thomas Brown', 'Christopher Lee', 'Daniel Garcia', 'Matthew Rodriguez', 'Anthony Martinez'],
      Female: ['Maria Garcia', 'Lisa Thompson', 'Sarah Johnson', 'Emily Davis', 'Jennifer Wilson', 'Jessica Brown', 'Amanda Lee', 'Nicole Garcia', 'Stephanie Rodriguez', 'Rachel Martinez']
    };
    
    const nameList = names[backendPatient.gender as keyof typeof names] || names.Male;
    const nameIndex = parseInt(backendPatient.id.replace(/\D/g, '')) % nameList.length;
    const name = nameList[nameIndex];
    
    // Generate department based on diagnosis
    const diagnosisToDepartment: { [key: string]: string } = {
      'Cardiovascular Disease': 'Cardiology',
      'Diabetes': 'Endocrinology',
      'Respiratory Infection': 'Pulmonology',
      'Hypertension': 'Cardiology',
      'Pneumonia': 'Pulmonology',
      'Heart Failure': 'Cardiology',
      'Stroke': 'Neurology',
      'Cancer': 'Oncology',
      'Kidney Disease': 'Nephrology',
      'Liver Disease': 'Hepatology'
    };
    
    const department = diagnosisToDepartment[backendPatient.diagnosis] || 'General Medicine';
    
    // Generate assigned doctor
    const doctorNames = [
      'Dr. Sarah Johnson', 'Dr. Emily Rodriguez', 'Dr. Michael Brown', 
      'Dr. David Wilson', 'Dr. Jennifer Lee', 'Dr. Christopher Chen',
      'Dr. Amanda Davis', 'Dr. Robert Wilson', 'Dr. Lisa Anderson'
    ];
    const doctorIndex = parseInt(backendPatient.id.replace(/\D/g, '')) % doctorNames.length;
    const assignedDoctor = doctorNames[doctorIndex];
    
    // Determine status based on readmission and length of stay
    let status: 'active' | 'discharged' | 'pending' = 'active';
    if (backendPatient.readmission) {
      status = 'active';
    } else if (backendPatient.lengthOfStay > 10) {
      status = 'discharged';
    } else {
      status = 'pending';
    }

    return {
      id: backendPatient.id,
      name: name,
      age: backendPatient.age,
      gender: backendPatient.gender,
      condition: backendPatient.diagnosis,
      assignedDoctor: assignedDoctor,
      department: department,
      admissionDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: status,
      contact: {
        phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
        address: `${Math.floor(Math.random() * 9999) + 1} Main St, City, State ${Math.floor(Math.random() * 90000) + 10000}`
      },
      medicalHistory: {
        allergies: ['Penicillin', 'Shellfish', 'Dust'].slice(0, Math.floor(Math.random() * 3) + 1),
        chronicConditions: ['Hypertension', 'Diabetes', 'Asthma'].slice(0, Math.floor(Math.random() * 2) + 1),
        surgeries: ['Appendectomy', 'Knee Replacement', 'Cataract Surgery'].slice(0, Math.floor(Math.random() * 2))
      },
      currentMedications: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ],
      vitalSigns: {
        bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 20) + 60} mmHg`,
        heartRate: Math.floor(Math.random() * 40) + 60,
        temperature: 97 + Math.random() * 4,
        oxygenSaturation: Math.floor(Math.random() * 10) + 90
      },
      appointments: [
        {
          date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '09:00 AM',
          type: 'Follow-up',
          doctor: assignedDoctor,
          status: 'scheduled' as const
        }
      ]
    };
  };

  // Load patients data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const patientsData = await getPatients();
        const transformedPatients = patientsData.patients.map(transformBackendPatient);
        setPatients(transformedPatients);
        toast.success(`Loaded ${transformedPatients.length} patients`, {
          duration: 3000,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data', {
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.assignedDoctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || patient.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const startIndex = (currentPage - 1) * patientsPerPage;
  const endIndex = showAll ? filteredPatients.length : startIndex + patientsPerPage;
  const displayedPatients = filteredPatients.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleShowAll = () => {
    setShowAll(true);
    setCurrentPage(1);
  };

  const handleShowPaginated = () => {
    setShowAll(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'discharged': return '#6b7280';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
          <p>Loading patients data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Video */}
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
        <source src="https://catalyzer-fe-public-assets.s3.us-east-1.amazonaws.com/mixkit-futuristic-diagrams-of-dna-scans-in-modern-lab-5579-hd-ready.mp4" type="video/mp4" />
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
        paddingLeft: '2rem',
        paddingRight: '2rem',
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
          Patients Management Dashboard
        </h1>

        {/* View Toggle Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <button
            onClick={() => setViewMode('details')}
            style={{
              padding: '0.75rem 1.5rem',
              background: viewMode === 'details' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (viewMode !== 'details') {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== 'details') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            📋 Patients Details
          </button>
          <button
            onClick={() => setViewMode('insights')}
            style={{
              padding: '0.75rem 1.5rem',
              background: viewMode === 'insights' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (viewMode !== 'insights') {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== 'insights') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            📊 Patients Insights
          </button>
        </div>

        <div style={{
          width: '100%',
          maxWidth: '1400px',
        }}>
          {viewMode === 'details' ? (
            // Patients Details View
            <>
              <PatientsFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterDepartment={filterDepartment}
                setFilterDepartment={setFilterDepartment}
                patients={patients}
              />

              <PatientsTable
                patients={displayedPatients}
                onViewProfile={setSelectedPatient}
                currentPage={currentPage}
                totalPages={totalPages}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
                onPageChange={handlePageChange}
                showAll={showAll}
                onShowAll={handleShowAll}
                onShowPaginated={handleShowPaginated}
                startIndex={startIndex}
                endIndex={endIndex}
                totalPatients={filteredPatients.length}
                patientsPerPage={patientsPerPage}
              />
            </>
          ) : (
            // Patients Insights View (Patients Insights Dashboard)
            <PatientsInsightsDashboard 
              patientsData={patients} 
              onViewModeChange={setViewMode}
              currentViewMode={viewMode}
            />
          )}
        </div>
      </div>
              <Toaster
          position="top-center"
          toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default PatientsDashboard; 