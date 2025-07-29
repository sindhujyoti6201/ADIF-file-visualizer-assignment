import React, { useState, useEffect } from 'react';
import { uploadFile, Feature, getDoctors, DoctorsResponse } from '../services/api';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

const TYPING_TEXT = 'ADIF Healthcare Dashboard';

interface HeroProps {
  dashboardStats: {
    totalDoctors: number;
    totalPatients: number;
    appointmentsToday: number;
    filesUploaded: number;
  };
  onUpload: (file: File) => Promise<void>;
  loading: boolean;
  filename: string | null;
  error: string | null;
}

export default function Hero({ dashboardStats, onUpload, loading, filename, error }: HeroProps) {
  const [typedTitle, setTypedTitle] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isDeleting && titleIndex < TYPING_TEXT.length) {
      timeout = setTimeout(() => {
        setTypedTitle((prev) => prev + TYPING_TEXT[titleIndex]);
        setTitleIndex(titleIndex + 1);
      }, 90);
    } else if (!isDeleting && titleIndex === TYPING_TEXT.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1200);
    } else if (isDeleting && titleIndex > 0) {
      timeout = setTimeout(() => {
        setTypedTitle((prev) => prev.slice(0, -1));
        setTitleIndex(titleIndex - 1);
      }, 40);
    } else if (isDeleting && titleIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 600);
    }
    return () => clearTimeout(timeout);
  }, [titleIndex, isDeleting]);

  useEffect(() => {
    setTypedTitle('');
    setTitleIndex(0);
    setIsDeleting(false);
  }, []);

  const handleScrollDown = () => {
    const mainContent = document.querySelector('[data-section="main-content"]');
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div style={{
      position: 'relative',
      height: '85vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          filter: 'brightness(0.6) blur(1px)'
        }}
      >
        <source src="https://catalyzer-fe-public-assets.s3.us-east-1.amazonaws.com/mixkit-close-up-of-an-iv-drip-46366-hd-ready.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Content Overlay */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1400px',
        padding: '0 4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '3rem',
      }}>
        {/* Left Side - Title and Description */}
        <div style={{
          flex: 1,
          color: '#fff',
          textAlign: 'left',
          maxWidth: '45%',
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '0 2px 16px rgba(0,0,0,0.5)',
            fontFamily: 'monospace',
            lineHeight: '1.1',
          }}>
            {typedTitle}<span style={{borderRight: '3px solid #fff', marginLeft: 2, animation: 'blink 1s steps(1) infinite'}}></span>
            <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#e2e8f0',
            marginBottom: '2rem',
            lineHeight: '1.6',
            maxWidth: '500px',
          }}>
            Comprehensive healthcare analytics and patient management system. Upload patient reports to get detailed disease insights and analytics.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
            }}>
              <span style={{ fontSize: '1.2rem' }}>👨‍⚕️</span>
              <span style={{ fontSize: '0.9rem' }}>{dashboardStats.totalDoctors} Doctors</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
            }}>
              <span style={{ fontSize: '1.2rem' }}>👥</span>
              <span style={{ fontSize: '0.9rem' }}>{dashboardStats.totalPatients} Patients</span>
            </div>
          </div>
        </div>

        {/* Right Side - Upload Card */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.9)',
          padding: '2.5rem',
          borderRadius: '20px',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          minWidth: '400px',
          maxWidth: '500px',
          marginLeft: '-2rem',
          marginRight: '0',
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: '1rem',
            textAlign: 'center',
          }}>
            Upload Patient Report
          </h2>
          <p style={{
            color: '#cbd5e1',
            fontSize: '1rem',
            marginBottom: '2rem',
            textAlign: 'center',
            lineHeight: '1.5',
          }}>
            Upload your patient's medical report to get detailed disease analysis and insights
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="file-upload"
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e293b',
                background: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📁 Choose Patient Report
              <input
                id="file-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    toast.success(`File selected: ${file.name}`, {
                      duration: 2000,
                    });
                    handleUpload(file);
                  }
                }}
                disabled={loading}
              />
            </label>
          </div>
          
          {filename && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
            }}>
              <p style={{ color: '#10b981', fontSize: '0.9rem', textAlign: 'center' }}>
                Selected: {filename}
              </p>
            </div>
          )}
          
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
            }}>
              <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>
                {error}
              </p>
            </div>
          )}
          

        </div>
      </div>

      {/* Scroll Down Button */}
      <button
        onClick={handleScrollDown}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '25px',
          width: '60px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 50,
          animation: 'bounce 2s infinite',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <div style={{
          width: '0',
          height: '0',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '8px solid #fff',
        }} />
        <style>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }
        `}</style>
      </button>
    </div>
  );
} 