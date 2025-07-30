"use client";

import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import * as d3 from 'd3';

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

interface DashboardMetrics {
  totalPatients: number;
  averageAge: number;
  activePatients: number;
  recoveryRate: number;
}

interface PatientsInsightsDashboardProps {
  patientsData?: Patient[];
  onViewModeChange?: (mode: 'details' | 'insights') => void;
  currentViewMode?: 'details' | 'insights';
}

const PatientsInsightsDashboard: React.FC<PatientsInsightsDashboardProps> = ({ 
  patientsData
  // onViewModeChange, 
  // currentViewMode = 'insights' 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  // const barChartRef = useRef<SVGSVGElement>(null);
  const scatterPlotRef = useRef<SVGSVGElement>(null);
  const pieChartRef = useRef<SVGSVGElement>(null);

  const [data, setData] = useState<Patient[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPatients: 0,
    averageAge: 0,
    activePatients: 0,
    recoveryRate: 0
  });
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Load data from props or localStorage
  useEffect(() => {
    if (patientsData && patientsData.length > 0) {
      setData(patientsData);
      toast.success(`Loaded ${patientsData.length} patient records`, {
        duration: 3000,
      });
    } else {
      // Fallback to localStorage
      const storedData = localStorage.getItem('healthcareData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData.patients && Array.isArray(parsedData.patients)) {
            setData(parsedData.patients);
            toast.success(`Loaded ${parsedData.patients.length} patient records`, {
              duration: 3000,
            });
          }
        } catch (error) {
          console.error('Error parsing healthcare data:', error);
          toast.error('Error loading healthcare data', {
            duration: 4000,
          });
        }
      } else {
        toast.error('No healthcare data available. Please upload a file first.', {
          duration: 4000,
        });
      }
    }
  }, [patientsData]);

  // Calculate dashboard metrics
  useEffect(() => {
    if (data.length === 0) return;

    const totalPatients = data.length;
    const averageAge = data.reduce((sum, patient) => sum + patient.age, 0) / totalPatients;
    const activePatients = data.filter(p => p.status === 'active').length;
    const dischargedPatients = data.filter(p => p.status === 'discharged').length;
    const recoveryRate = totalPatients > 0 ? (dischargedPatients / totalPatients) * 100 : 0;

    setMetrics({
      totalPatients,
      averageAge: Math.round(averageAge),
      activePatients,
      recoveryRate: Math.round(recoveryRate * 10) / 10
    });
  }, [data]);

  // Department distribution chart
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 10, right: 20, bottom: 60, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left + 90},${margin.top})`);

    const departmentCounts = d3.group(data, d => d.department);
    const departmentData = Array.from(departmentCounts, ([department, patients]) => ({
      department,
      count: patients.length
    }));

    const x = d3.scaleBand()
      .domain(departmentData.map(d => d.department))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(departmentData, d => d.count) || 0])
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g")
      .call(d3.axisLeft(y));

    g.selectAll(".bar")
      .data(departmentData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.department) || 0)
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.count))
      .attr("fill", "#3b82f6")
      .attr("opacity", 0.8);

    // Add axis labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - (margin.left - 5))
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Count");

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 50})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Department");
  }, [data]);

  // Age vs Heart Rate scatter plot
  useEffect(() => {
    if (!scatterPlotRef.current || data.length === 0) return;

    const svg = d3.select(scatterPlotRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 10, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left + 90},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.age) || 0])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("cx", d => x(d.age))
      .attr("cy", d => y(d.vitalSigns.heartRate))
      .attr("r", 6)
      .attr("fill", d => d.status === 'active' ? "#ef4444" : "#10b981")
      .attr("opacity", 0.7);

    // Add axis labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - (margin.left - 5))
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Heart Rate");

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Age");
  }, [data]);

  // Status distribution pie chart
  useEffect(() => {
    if (!pieChartRef.current || data.length === 0) return;

    const svg = d3.select(pieChartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 10, right: 120, bottom: 20, left: 20 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const g = svg.append("g").attr("transform", `translate(${width/2 + margin.left + 120},${height/2 + margin.top})`);

    const statusCounts = d3.group(data, d => d.status);
    const statusData = Array.from(statusCounts, ([status, patients]) => ({
      status,
      count: patients.length
    }));

    const color = d3.scaleOrdinal()
      .domain(statusData.map(d => d.status))
      .range(["#3b82f6", "#10b981", "#f59e0b"]);

    const pie = d3.pie<typeof statusData[0]>()
      .value(d => d.count);

    const arc = d3.arc<d3.PieArcDatum<typeof statusData[0]>>()
      .innerRadius(0)
      .outerRadius(radius);

    g.selectAll("path")
      .data(pie(statusData))
      .enter().append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.status) as string)
      .attr("opacity", 0.8);

    // Add legend
    const legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 9)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(pie(statusData))
      .enter().append("g")
      .attr("transform", (d, i) => `translate(${radius + 15}, ${i * 15 - 60})`);

    legend.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", d => color(d.data.status) as string);

    legend.append("text")
      .attr("x", 14)
      .attr("y", 7)
      .text(d => d.data.status);
  }, [data]);

  // Re-render charts when modal is opened for larger size
  useEffect(() => {
    if (!data || !selectedCard || data.length === 0) return;

    const renderModalChart = () => {
      if (selectedCard === 'department' && svgRef.current) {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 30, right: 30, bottom: 100, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const departmentCounts = d3.group(data, d => d.department);
        const departmentData = Array.from(departmentCounts, ([department, patients]) => ({
          department,
          count: patients.length
        }));

        const x = d3.scaleBand()
          .domain(departmentData.map(d => d.department))
          .range([0, width])
          .padding(0.1);

        const y = d3.scaleLinear()
          .domain([0, d3.max(departmentData, d => d.count) || 0])
          .range([height, 0]);

        g.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end")
          .style("font-size", "12px");

        g.append("g")
          .call(d3.axisLeft(y))
          .selectAll("text")
          .style("font-size", "12px");

        g.selectAll(".bar")
          .data(departmentData)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", d => x(d.department) || 0)
          .attr("y", d => y(d.count))
          .attr("width", x.bandwidth())
          .attr("height", d => height - y(d.count))
          .attr("fill", "#3b82f6")
          .attr("opacity", 0.8);

        // Add axis labels
        g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Count");

        g.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 120})`)
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Department");
      }

      if (selectedCard === 'ageHeartRate' && scatterPlotRef.current) {
        const svg = d3.select(scatterPlotRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 30, right: 30, bottom: 50, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.age) || 0])
          .range([0, width]);

        const y = d3.scaleLinear()
          .domain([0, 100])
          .range([height, 0]);

        g.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
          .style("font-size", "12px");

        g.append("g")
          .call(d3.axisLeft(y))
          .selectAll("text")
          .style("font-size", "12px");

        g.selectAll("circle")
          .data(data)
          .enter().append("circle")
          .attr("cx", d => x(d.age))
          .attr("cy", d => y(d.vitalSigns.heartRate))
          .attr("r", 8)
          .attr("fill", d => d.status === 'active' ? "#ef4444" : "#10b981")
          .attr("opacity", 0.7);

        // Add axis labels
        g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Heart Rate");

        g.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Age");
      }

      if (selectedCard === 'status' && pieChartRef.current) {
        const svg = d3.select(pieChartRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 30, right: 30, bottom: 30, left: 30 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
        const radius = Math.min(width, height) / 2;

        const g = svg.append("g").attr("transform", `translate(${width/2 + margin.left},${height/2 + margin.top})`);

        const statusCounts = d3.group(data, d => d.status);
        const statusData = Array.from(statusCounts, ([status, patients]) => ({
          status,
          count: patients.length
        }));

        const color = d3.scaleOrdinal()
          .domain(statusData.map(d => d.status))
          .range(["#3b82f6", "#10b981", "#f59e0b"]);

        const pie = d3.pie<typeof statusData[0]>()
          .value(d => d.count);

        const arc = d3.arc<d3.PieArcDatum<typeof statusData[0]>>()
          .innerRadius(0)
          .outerRadius(radius);

        g.selectAll("path")
          .data(pie(statusData))
          .enter().append("path")
          .attr("d", arc)
          .attr("fill", d => color(d.data.status) as string)
          .attr("opacity", 0.8);

        // Add legend
        const legend = g.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 12)
          .attr("text-anchor", "start")
          .selectAll("g")
          .data(pie(statusData))
          .enter().append("g")
          .attr("transform", (d, i) => `translate(${radius + 30}, ${i * 25 - 100})`);

        legend.append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", d => color(d.data.status) as string);

        legend.append("text")
          .attr("x", 20)
          .attr("y", 12)
          .text(d => d.data.status);
      }
    };

    // Small delay to ensure the modal is rendered
    setTimeout(renderModalChart, 100);
  }, [selectedCard, data]);

  if (data.length === 0) {
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
          <p>No patient data available. Please upload a file first.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Summary Cards */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        padding: '2rem',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '2rem',
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1.5rem' }}>
          Key Metrics
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}>
          <div 
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setSelectedCard('totalPatients')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ color: '#3b82f6', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Patients</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.totalPatients}</p>
          </div>
          <div 
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setSelectedCard('averageAge')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Average Age</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.averageAge} years</p>
          </div>
          <div 
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setSelectedCard('activePatients')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Patients</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.activePatients}</p>
          </div>
          <div 
            style={{
              background: 'rgba(236, 72, 153, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setSelectedCard('recoveryRate')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ color: '#ec4899', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Recovery Rate</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.recoveryRate}%</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        padding: '2rem',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '2rem',
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1.5rem' }}>
          Analytics Overview
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '2rem',
        }}>
          {[
            { ref: svgRef, title: 'Department Distribution', key: 'department' },
            { ref: scatterPlotRef, title: 'Age vs Heart Rate', key: 'ageHeartRate' },
            { ref: pieChartRef, title: 'Status Distribution', key: 'status' },
          ].map((chart, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '350px',
              }}
              onClick={() => setSelectedCard(chart.key)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem', textAlign: 'center' }}>
                {chart.title}
              </h3>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '250px',
              }}>
                <svg
                  ref={chart.ref}
                  width="100%"
                  height="100%"
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                ></svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for selected card */}
      {selectedCard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={() => setSelectedCard(null)}
        >
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '16px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCard(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#666';
              }}
            >
              ×
            </button>
            
            {selectedCard === 'totalPatients' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Total Patients
                </h2>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  textAlign: 'center',
                }}>
                  <h3 style={{ color: '#3b82f6', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Total Patients</h3>
                  <p style={{ color: '#1e293b', fontSize: '3rem', fontWeight: 'bold' }}>{metrics.totalPatients}</p>
                  <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Registered patients</p>
                </div>
              </div>
            )}
            
            {selectedCard === 'averageAge' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Average Age
                </h2>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  textAlign: 'center',
                }}>
                  <h3 style={{ color: '#10b981', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Average Age</h3>
                  <p style={{ color: '#1e293b', fontSize: '3rem', fontWeight: 'bold' }}>{metrics.averageAge}</p>
                  <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Years old</p>
                </div>
              </div>
            )}
            
            {selectedCard === 'activePatients' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Active Patients
                </h2>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  textAlign: 'center',
                }}>
                  <h3 style={{ color: '#f59e0b', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Active Patients</h3>
                  <p style={{ color: '#1e293b', fontSize: '3rem', fontWeight: 'bold' }}>{metrics.activePatients}</p>
                  <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Currently under care</p>
                </div>
              </div>
            )}
            
            {selectedCard === 'recoveryRate' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Recovery Rate
                </h2>
                <div style={{
                  background: 'rgba(236, 72, 153, 0.1)',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(236, 72, 153, 0.2)',
                  textAlign: 'center',
                }}>
                  <h3 style={{ color: '#ec4899', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Recovery Rate</h3>
                  <p style={{ color: '#1e293b', fontSize: '3rem', fontWeight: 'bold' }}>{metrics.recoveryRate}%</p>
                  <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Successfully discharged</p>
                </div>
              </div>
            )}
            
            {selectedCard === 'department' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Department Distribution
                </h2>
                <svg
                  ref={svgRef}
                  width="800"
                  height="500"
                  style={{
                    display: 'block',
                    margin: '0 auto',
                  }}
                ></svg>
              </div>
            )}
            
            {selectedCard === 'ageHeartRate' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Age vs Heart Rate
                </h2>
                <svg
                  ref={scatterPlotRef}
                  width="800"
                  height="500"
                  style={{
                    display: 'block',
                    margin: '0 auto',
                  }}
                ></svg>
              </div>
            )}
            
            {selectedCard === 'status' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Status Distribution
                </h2>
                <svg
                  ref={pieChartRef}
                  width="800"
                  height="500"
                  style={{
                    display: 'block',
                    margin: '0 auto',
                  }}
                ></svg>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PatientsInsightsDashboard; 