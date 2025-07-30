import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Doctors', href: '/doctors' },
    { name: 'Patients', href: '/patients' },
    { name: 'Book Appointment', href: '/book-doctors-appointment' },
    { name: 'Visualization', href: '/visualization' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1rem 0',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '0 2rem',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: '#fff',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}>
          <span style={{ marginRight: '0.5rem' }}>🏥</span>
          <span>ADIF Healthcare</span>
        </Link>

        {/* Desktop Navigation - Individual Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginLeft: '25%',
        }}>
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              style={{
                textDecoration: 'none',
                color: isActive(item.href) ? '#3b82f6' : '#e2e8f0',
                fontWeight: isActive(item.href) ? '600' : '500',
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: isActive(item.href) ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                fontSize: '0.9rem',
                border: isActive(item.href) ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isActive(item.href) ? '0 4px 12px rgba(59, 130, 246, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.color = '#3b82f6';
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.color = '#e2e8f0';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Profile Button - Circular */}
        <Link
          href="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: isActive('/profile') ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            border: isActive('/profile') ? '2px solid #3b82f6' : '2px solid rgba(255, 255, 255, 0.2)',
            color: isActive('/profile') ? '#3b82f6' : '#fff',
            textDecoration: 'none',
            fontSize: '1.2rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            marginRight: '5%',
          }}
          onMouseEnter={(e) => {
            if (!isActive('/profile')) {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/profile')) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          👤
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(30, 41, 59, 0.98)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1rem',
        }}>
          {[...mainNavItems, { name: 'Profile', href: '/profile' }].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: isActive(item.href) ? '#3b82f6' : '#e2e8f0',
                fontWeight: isActive(item.href) ? '600' : '400',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                background: isActive(item.href) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                fontSize: '1rem',
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      {/* Responsive Design */}
      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-button {
            display: block;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-button {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 