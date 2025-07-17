import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { uploadFile, Feature } from '../services/api';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<Feature[] | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHover, setIsHover] = useState(false);
  const router = useRouter();

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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          textAlign: 'center',
          color: '#fff',
          letterSpacing: '0.02em',
          textShadow: '0 2px 16px rgba(0,0,0,0.25)',
          padding: '0.5rem 1.5rem',
        }}>
          ADIF File Inference Demo
        </h1>
        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <label
            htmlFor="file-upload"
            style={isHover ? {
              display: 'inline-block',
              padding: '0.85rem 2.2rem',
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#1e293b',
              background: '#fff',
              border: 'none',
              borderRadius: '1.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(30,41,59,0.18)',
              transition: 'background 0.2s, transform 0.2s',
              marginBottom: '1rem',
              outline: '2px solid #cbd5e1',
              outlineOffset: '2px',
              transform: 'scale(1.06)',
              filter: 'brightness(0.95)',
            } : {
              display: 'inline-block',
              padding: '0.85rem 2.2rem',
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#1e293b',
              background: '#fff',
              border: 'none',
              borderRadius: '1.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(30,41,59,0.18)',
              transition: 'background 0.2s, transform 0.2s',
              marginBottom: '1rem',
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
            <span style={{ color: '#fff', marginLeft: '1rem', fontSize: '1.1rem' }}>{filename}</span>
          )}
        </div>
        {error && (
          <div style={{ color: '#dc2626', fontWeight: 600, marginTop: '1rem' }}>{error}</div>
        )}
        {!loading && (
          <div style={{ color: '#e0e7ef', fontSize: '0.95rem', textAlign: 'center', marginTop: '1rem' }}>
            Upload any file to view healthcare analytics dashboard
          </div>
        )}
      </div>
    </div>
  );
} 