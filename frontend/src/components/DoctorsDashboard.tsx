"use client";

import React, { useEffect, useState } from 'react';
import { getDoctors, getDoctorsAnalytics, getDoctorsSummary, Doctor, DoctorsResponse, DoctorsAnalytics, DoctorsSummary } from '../services/api';
import { Toaster, toast } from 'react-hot-toast';
import DoctorsFilters from './DoctorsFilters';
import DoctorsTable from './DoctorsTable';
import DoctorsAnalyticsComponent from './DoctorsAnalytics';
import DoctorProfileModal from './DoctorProfileModal';

const DoctorsDashboard: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [summary, setSummary] = useState<DoctorsResponse['summary'] | null>(null);
  const [analytics, setAnalytics] = useState<DoctorsAnalytics | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<DoctorsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'board' | 'insights'>('board');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const doctorsPerPage = 10;

  // Load doctors data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [doctorsData, analyticsData, summaryData] = await Promise.all([
          getDoctors(),
          getDoctorsAnalytics(),
          getDoctorsSummary()
        ]);
        setDoctors(doctorsData.doctors);
        setSummary(doctorsData.summary);
        setAnalytics(analyticsData);
        setAnalyticsSummary(summaryData);
        toast.success(`Loaded ${doctorsData.doctors.length} doctors`, {
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

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || doctor.department === filterDepartment;
    const matchesSpecialization = filterSpecialization === 'all' || doctor.specialization === filterSpecialization;
    
    return matchesSearch && matchesDepartment && matchesSpecialization;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const endIndex = showAll ? filteredDoctors.length : startIndex + doctorsPerPage;
  const displayedDoctors = filteredDoctors.slice(startIndex, endIndex);

  // Debug logging
  console.log('Pagination Debug:', {
    totalDoctors: filteredDoctors.length,
    doctorsPerPage,
    totalPages,
    currentPage,
    startIndex,
    endIndex,
    displayedDoctorsLength: displayedDoctors.length,
    showAll
  });

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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setShowAll(false);
  }, [searchTerm, filterDepartment, filterSpecialization]);

  if (loading) {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Loading data...</p>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>No doctors data available.</p>
        </div>
      </div>
    );
  }

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
            duration: 3000,
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
          Doctors Management Dashboard
        </h1>

        {/* View Toggle Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <button
            onClick={() => setViewMode('board')}
            style={{
              padding: '0.75rem 1.5rem',
              background: viewMode === 'board' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (viewMode !== 'board') {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== 'board') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            📋 Medical Team Board
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
            📊 Medical Team Insights
          </button>
        </div>

        <div style={{
          width: '100%',
          maxWidth: '1400px',
        }}>
          {viewMode === 'board' ? (
            <>
              <DoctorsFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterDepartment={filterDepartment}
                setFilterDepartment={setFilterDepartment}
                filterSpecialization={filterSpecialization}
                setFilterSpecialization={setFilterSpecialization}
                doctors={doctors}
              />
              <DoctorsTable
                doctors={displayedDoctors}
                onViewProfile={setSelectedDoctor}
                currentPage={currentPage}
                totalPages={totalPages}
                showAll={showAll}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
                onPageChange={handlePageChange}
                onShowAll={handleShowAll}
                onShowPaginated={handleShowPaginated}
                startIndex={startIndex}
                endIndex={endIndex}
                doctorsPerPage={doctorsPerPage}
                totalDoctors={filteredDoctors.length}
              />
            </>
          ) : (
            <DoctorsAnalyticsComponent
              analytics={analytics}
              analyticsSummary={analyticsSummary}
            />
          )}
        </div>

        {/* Doctor Profile Modal */}
        <DoctorProfileModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      </div>
    </div>
  );
};

export default DoctorsDashboard; 