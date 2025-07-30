import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { uploadAndProcessFile, getDoctors } from '../services/api';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import { Toaster, toast } from 'react-hot-toast';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<any[] | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [dashboardStats, setDashboardStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    appointmentsToday: 0,
    filesUploaded: 0,
  });
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'upload', message: 'Patient data uploaded', time: '2 minutes ago', icon: '📁' },
    { id: 2, type: 'doctor', message: 'Dr. Sarah Johnson updated schedule', time: '15 minutes ago', icon: '👨‍⚕️' },
    { id: 3, type: 'patient', message: 'New patient registered', time: '1 hour ago', icon: '👥' },
    { id: 4, type: 'appointment', message: 'Appointment scheduled for tomorrow', time: '2 hours ago', icon: '📅' },
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'System maintenance scheduled for tonight', time: '1 hour ago' },
    { id: 2, type: 'warning', message: '3 files pending review', time: '2 hours ago' },
    { id: 3, type: 'success', message: 'Backup completed successfully', time: '3 hours ago' },
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const doctorsData = await getDoctors();
      setDashboardStats({
        totalDoctors: doctorsData.summary.totalDoctors,
        totalPatients: 102,
        appointmentsToday: Math.floor(Math.random() * 20) + 5, // Mock data
        filesUploaded: Math.floor(Math.random() * 50) + 10, // Mock data
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleUpload = async (file: File) => {
    setLoading(true);
    setFeatures(null);
    setFilename(null);
    setError(null);
    
    const loadingToast = toast.loading('Uploading file...', {
      duration: Infinity,
    });
    
    try {
      console.log('Starting upload and processing, calling /patient-info API...');
      const patientInfo = await uploadAndProcessFile(file);
      console.log('Patient info processed:', patientInfo);
      
      toast.dismiss(loadingToast);
      const processingToast = toast.loading('Processing healthcare data...', {
        duration: Infinity,
      });
      
      console.log('Patient info:', patientInfo);
      
      // Store the patient info
      localStorage.setItem('patientInfo', JSON.stringify(patientInfo));
      localStorage.setItem('filename', file.name);
      
      setFilename(file.name);
      
      // Add to recent activity
      setRecentActivity(prev => [{
        id: Date.now(),
        type: 'upload',
        message: `File "${file.name}" uploaded successfully`,
        time: 'Just now',
        icon: '📁'
      }, ...prev.slice(0, 4)]);
      
      setTimeout(() => {
        console.log('Setting loading to false and redirecting to patient dashboard');
        setLoading(false);
        
        toast.dismiss(processingToast);
        toast.success('Data processed successfully! Redirecting to your personalized dashboard...', {
          duration: 2000,
        });
        
        router.push('/patient-info-dashboard');
      }, 3500);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload file. Please try again.');
      setLoading(false);
      
      toast.dismiss(loadingToast);
      toast.error('Upload failed. Please try again.', {
        duration: 4000,
      });
    }
  };

  const handleViewDoctors = () => {
    toast.success('Loading doctors information...', {
      duration: 2000,
    });
    router.push('/doctors');
  };

  const handleViewPatients = () => {
    toast.success('Loading patients information...', {
      duration: 2000,
    });
    router.push('/patients');
  };



  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        html {
          margin: 0;
          padding: 0;
        }
      `}</style>
      <div style={{ 
        minHeight: '100vh', 
        width: '100%', 
        position: 'relative',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
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
        <Navbar />
        
        {/* Hero Component */}
        <Hero 
          dashboardStats={dashboardStats}
          onUpload={handleUpload}
          loading={loading}
          filename={filename}
          error={error}
        />

        {/* Loading Overlay */}
        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Processing your file...</h1>
              <p style={{ color: '#fff', marginBottom: '2rem' }}>Calling healthcare API and preparing your dashboard.</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: '#2563eb',
                      animation: `bounce 0.6s ${i * 0.2}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
              <style>{`
                @keyframes bounce {
                  to { transform: translateY(-16px); opacity: 0.5; }
                }
              `}</style>
            </div>
          </div>
        )}

        {/* Main Content Section (No Background Video) */}
        <div 
          data-section="main-content"
          style={{
            background: '#f1f5f9',
            minHeight: '100vh',
            padding: '4rem 2rem',
            width: '100%',
            margin: 0,
          }}
        >
          <div style={{
            width: '100%',
            padding: '0 2rem',
            margin: 0,
          }}>
            {/* Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginBottom: '4rem',
            }}>
              {[
                { title: 'Total Doctors', value: dashboardStats.totalDoctors, icon: '👨‍⚕️', color: '#3b82f6', bgColor: '#dbeafe' },
                { title: 'Total Patients', value: dashboardStats.totalPatients, icon: '👥', color: '#10b981', bgColor: '#d1fae5' },
                { title: 'Appointments Today', value: dashboardStats.appointmentsToday, icon: '📅', color: '#f59e0b', bgColor: '#fef3c7' },
                { title: 'Files Uploaded', value: dashboardStats.filesUploaded, icon: '📁', color: '#8b5cf6', bgColor: '#ede9fe' },
              ].map((card, idx) => (
                <div
                  key={card.title}
                  style={{
                    background: '#fff',
                    padding: '2rem',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{ 
                    fontSize: '3rem', 
                    marginBottom: '1rem',
                    background: card.bgColor,
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
                    {card.value}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>{card.title}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{
              background: '#fff',
              padding: '2.5rem',
              borderRadius: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0',
              marginBottom: '4rem',
            }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem', textAlign: 'center' }}>
                Quick Actions
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
              }}>
                {[
                  { name: 'View Doctors', action: handleViewDoctors, icon: '👨‍⚕️', description: 'Browse and manage doctor profiles' },
                  { name: 'View Patients', action: handleViewPatients, icon: '👥', description: 'Access patient records and data' },
                ].map((action) => (
                  <button
                    key={action.name}
                    onClick={action.action}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '2rem',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '16px',
                      color: '#1e293b',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f1f5f9';
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 16px 32px rgba(59, 130, 246, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>{action.icon}</span>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {action.name}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.4' }}>
                        {action.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity & Notifications */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
              gap: '2rem',
            }}>
              {/* Recent Activity */}
              <div style={{
                background: '#fff',
                padding: '2.5rem',
                borderRadius: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
              }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>
                  Recent Activity
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1.5rem',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.background = '#f1f5f9';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{activity.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#1e293b', fontSize: '1rem', marginBottom: '0.25rem', fontWeight: '500' }}>
                          {activity.message}
                        </p>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div style={{
                background: '#fff',
                padding: '2.5rem',
                borderRadius: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
              }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>
                  Notifications
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1.5rem',
                        background: notification.type === 'warning' 
                          ? '#fef3c7' 
                          : notification.type === 'success'
                          ? '#d1fae5'
                          : '#dbeafe',
                        borderRadius: '12px',
                        border: `1px solid ${
                          notification.type === 'warning' 
                            ? '#fde68a' 
                            : notification.type === 'success'
                            ? '#a7f3d0'
                            : '#bfdbfe'
                        }`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.borderColor = notification.type === 'warning' 
                          ? '#f59e0b' 
                          : notification.type === 'success'
                          ? '#10b981'
                          : '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = notification.type === 'warning' 
                          ? '#fde68a' 
                          : notification.type === 'success'
                          ? '#a7f3d0'
                          : '#bfdbfe';
                      }}
                    >
                      <span style={{ 
                        fontSize: '1.5rem',
                        color: notification.type === 'warning' 
                          ? '#f59e0b' 
                          : notification.type === 'success'
                          ? '#10b981'
                          : '#3b82f6'
                      }}>
                        {notification.type === 'warning' ? '⚠️' : notification.type === 'success' ? '✅' : 'ℹ️'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#1e293b', fontSize: '1rem', marginBottom: '0.25rem', fontWeight: '500' }}>
                          {notification.message}
                        </p>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 