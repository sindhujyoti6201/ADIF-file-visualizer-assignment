import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { uploadFile, Feature } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TYPING_TEXT = 'ADIF Patient Insights Dashboard';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<Feature[] | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHover, setIsHover] = useState(false);
  const router = useRouter();
  const [typedTitle, setTypedTitle] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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
      }, 1200); // Pause before deleting
    } else if (isDeleting && titleIndex > 0) {
      timeout = setTimeout(() => {
        setTypedTitle((prev) => prev.slice(0, -1));
        setTitleIndex(titleIndex - 1);
      }, 40);
    } else if (isDeleting && titleIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 600); // Pause before re-typing
    }
    return () => clearTimeout(timeout);
  }, [titleIndex, isDeleting]);

  useEffect(() => {
    setTypedTitle('');
    setTitleIndex(0);
    setIsDeleting(false);
  }, []);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setFeatures(null);
    setFilename(null);
    setError(null);
    
    try {
      console.log('Starting upload, calling /upload API...');
      const response = await uploadFile(file);
      console.log('API response received:', response);
      
      // Store the healthcare data in localStorage
      localStorage.setItem('healthcareData', JSON.stringify(response));
      localStorage.setItem('features', JSON.stringify(response.features || []));
      localStorage.setItem('filename', response.filename || file.name);
      
      setFeatures(response.features || []);
      setFilename(response.filename || file.name);
      
      // Keep loading state true for 3.5 seconds to show animation
      console.log('Upload successful, keeping loading for 3.5 seconds');
      setTimeout(() => {
        console.log('Setting loading to false and redirecting to healthcare');
        setLoading(false);
        // Redirect to healthcare dashboard after 3.5 seconds
        router.push('/healthcare');
      }, 3500); // 3.5 seconds delay
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload file. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
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
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          zIndex: 100,
        }}>
          <div style={{ marginTop: '15vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>Processing your file...</h1>
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
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: '8rem',
        paddingBottom: '7rem',
        paddingRight: '6vw',
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          maxWidth: '600px',
          width: '100%',
          background: 'rgba(30, 41, 59, 0.72)',
          padding: '2.5rem 2.5rem 2.5rem 3.5rem',
          borderRadius: '2rem',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
          backdropFilter: 'blur(2px)',
          boxSizing: 'border-box',
          overflow: 'hidden',
          wordBreak: 'break-word',
        }}>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 'bold',
            marginBottom: '2.2rem',
            textAlign: 'right',
            color: '#fff',
            letterSpacing: '0.02em',
            textShadow: '0 2px 16px rgba(0,0,0,0.25)',
            padding: 0,
            fontFamily: 'monospace',
            whiteSpace: 'normal', // allow wrapping
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%',
          }}>
            {typedTitle}<span style={{borderRight: '3px solid #fff', marginLeft: 2, animation: 'blink 1s steps(1) infinite'}}></span>
            <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            @media (max-width: 700px) {
              .adif-card { max-width: 95vw !important; padding: 1.2rem !important; }
              .adif-title { font-size: 1.2rem !important; }
            }`}</style>
          </h1>
          <div style={{ marginBottom: '2.2rem', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
            <label
              htmlFor="file-upload"
              style={isHover ? {
                display: 'inline-block',
                padding: '0.95rem 2.5rem',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1e293b',
                background: '#fff',
                border: 'none',
                borderRadius: '1.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(30,41,59,0.18)',
                transition: 'background 0.2s, transform 0.2s',
                marginBottom: '0',
                outline: '2px solid #cbd5e1',
                outlineOffset: '2px',
                transform: 'scale(1.06)',
                filter: 'brightness(0.95)',
              } : {
                display: 'inline-block',
                padding: '0.95rem 2.5rem',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1e293b',
                background: '#fff',
                border: 'none',
                borderRadius: '1.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(30,41,59,0.18)',
                transition: 'background 0.2s, transform 0.2s',
                marginBottom: '0',
              }}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              Choose File
              <input
                id="file-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
                disabled={loading}
              />
            </label>
            {filename && (
              <span style={{ color: '#fff', marginLeft: '1.2rem', fontSize: '1.1rem' }}>{filename}</span>
            )}
          </div>
          {error && (
            <div style={{ color: '#dc2626', fontWeight: 600, marginTop: '0.5rem', textAlign: 'right', width: '100%' }}>{error}</div>
          )}
          {!loading && (
            <div style={{ color: '#e0e7ef', fontSize: '1.08rem', textAlign: 'right', marginTop: '0.5rem', width: '100%' }}>
              Upload any file to view healthcare analytics dashboard
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 