import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { Toaster, toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'admin' | 'nurse';
  department: string;
  specialization?: string;
  avatar: string;
  phone: string;
  address: string;
  joinDate: string;
  status: 'active' | 'inactive';
  permissions: string[];
  recentActivity: {
    id: string;
    action: string;
    timestamp: string;
    details: string;
  }[];
  stats: {
    patientsSeen: number;
    appointmentsToday: number;
    filesUploaded: number;
    lastLogin: string;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview');

  // Mock user profile data
  const mockProfile: UserProfile = useMemo(() => ({
    id: 'USR001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    role: 'doctor',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    avatar: '👨‍⚕️',
    phone: '+1-555-0101',
    address: '123 Medical Center Dr, City, State 12345',
    joinDate: '2020-03-15',
    status: 'active',
    permissions: [
      'View Patients',
      'Edit Patient Records',
      'Upload Files',
      'View Analytics',
      'Manage Appointments'
    ],
    recentActivity: [
      {
        id: '1',
        action: 'Patient Consultation',
        timestamp: '2024-01-20 10:30 AM',
        details: 'Consulted with John Smith for hypertension follow-up'
      },
      {
        id: '2',
        action: 'File Upload',
        timestamp: '2024-01-20 09:15 AM',
        details: 'Uploaded ECG report for patient Maria Garcia'
      },
      {
        id: '3',
        action: 'Appointment Scheduled',
        timestamp: '2024-01-19 02:45 PM',
        details: 'Scheduled follow-up appointment for Robert Chen'
      },
      {
        id: '4',
        action: 'Patient Record Updated',
        timestamp: '2024-01-19 11:20 AM',
        details: 'Updated medication list for Lisa Thompson'
      },
      {
        id: '5',
        action: 'Login',
        timestamp: '2024-01-20 08:00 AM',
        details: 'Logged into the system'
      }
    ],
    stats: {
      patientsSeen: 127,
      appointmentsToday: 8,
      filesUploaded: 45,
      lastLogin: '2024-01-20 08:00 AM'
    }
  }), []);

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      setProfile(mockProfile);
      setLoading(false);
      toast.success('Profile loaded successfully', {
        duration: 3000,
      });
    }, 1000);
  }, [mockProfile]);

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully', {
      duration: 3000,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    toast('Changes cancelled', {
      duration: 2000,
    });
  };

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
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
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
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
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
          User Profile
        </h1>

        <div style={{
          width: '100%',
          maxWidth: '1200px',
        }}>
          {/* Profile Header */}
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
              alignItems: 'center',
              gap: '2rem',
              marginBottom: '2rem',
            }}>
              <div style={{
                fontSize: '4rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {profile.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>
                  {profile.name}
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} • {profile.department}
                </p>
                {profile.specialization && (
                  <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
                    {profile.specialization}
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  background: profile.status === 'active' ? '#10b98120' : '#ef444420',
                  color: profile.status === 'active' ? '#10b981' : '#ef4444',
                  border: `1px solid ${profile.status === 'active' ? '#10b98140' : '#ef444440'}`,
                }}>
                  {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              {[
                { label: 'Patients Seen', value: profile.stats.patientsSeen, icon: '👥' },
                { label: 'Appointments Today', value: profile.stats.appointmentsToday, icon: '📅' },
                { label: 'Files Uploaded', value: profile.stats.filesUploaded, icon: '📁' },
                { label: 'Last Login', value: profile.stats.lastLogin, icon: '🕒' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {stat.value}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            padding: '2rem',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            {/* Tab Navigation */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              {[
                { key: 'overview', label: 'Overview', icon: '📊' },
                { key: 'activity', label: 'Recent Activity', icon: '📝' },
                { key: 'settings', label: 'Settings', icon: '⚙️' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'overview' | 'activity' | 'settings')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem 1.5rem',
                    background: activeTab === tab.key ? '#3b82f6' : 'transparent',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1.5rem' }}>
                  Profile Information
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem',
                }}>
                  {/* Contact Information */}
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
                      Contact Information
                    </h4>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '1.5rem',
                      borderRadius: '8px',
                    }}>
                      <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                        <strong>Email:</strong> {profile.email}
                      </p>
                      <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                        <strong>Phone:</strong> {profile.phone}
                      </p>
                      <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                        <strong>Address:</strong> {profile.address}
                      </p>
                      <p style={{ color: '#cbd5e1' }}>
                        <strong>Join Date:</strong> {profile.joinDate}
                      </p>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
                      Permissions
                    </h4>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '1.5rem',
                      borderRadius: '8px',
                    }}>
                      {profile.permissions.map((permission, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <span style={{ color: '#10b981' }}>✓</span>
                          <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1.5rem' }}>
                  Recent Activity
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}>
                  {profile.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '0.5rem',
                      }}>
                        <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '600' }}>
                          {activity.action}
                        </h4>
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                          {activity.timestamp}
                        </span>
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                        {activity.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1.5rem' }}>
                  Profile Settings
                </h3>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2rem',
                  borderRadius: '8px',
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                  }}>
                    <div>
                      <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={profile.name}
                        disabled={!isEditing}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: isEditing ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          color: '#fff',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={profile.email}
                        disabled={!isEditing}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: isEditing ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          color: '#fff',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue={profile.phone}
                        disabled={!isEditing}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: isEditing ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          color: '#fff',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        Address
                      </label>
                      <textarea
                        defaultValue={profile.address}
                        disabled={!isEditing}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: isEditing ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          color: '#fff',
                          fontSize: '0.9rem',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '2rem',
                  }}>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: '#3b82f6',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
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
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveProfile}
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#059669';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#10b981';
                          }}
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 