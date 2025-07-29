import React from 'react';
import { Doctor } from '../services/api';

interface DoctorsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterDepartment: string;
  setFilterDepartment: (dept: string) => void;
  filterSpecialization: string;
  setFilterSpecialization: (spec: string) => void;
  doctors: Doctor[];
}

const DoctorsFilters: React.FC<DoctorsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterDepartment,
  setFilterDepartment,
  filterSpecialization,
  setFilterSpecialization,
  doctors,
}) => {
  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.8)',
      padding: '2rem',
      borderRadius: '16px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '2rem',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        alignItems: 'end',
      }}>
        <div>
          <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Search Doctors
          </label>
          <input
            type="text"
            placeholder="Search by name, specialization, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
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
            Department
          </label>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          >
            <option value="all">All Departments</option>
            {Array.from(new Set(doctors.map(d => d.department))).map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Specialization
          </label>
          <select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          >
            <option value="all">All Specializations</option>
            {Array.from(new Set(doctors.map(d => d.specialization))).map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DoctorsFilters; 