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
  patientsData, 
  onViewModeChange, 
  currentViewMode = 'insights' 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const barChartRef = useRef<SVGSVGElement>(null);
  const scatterPlotRef = useRef<SVGSVGElement>(null);
  const pieChartRef = useRef<SVGSVGElement>(null);

  const [data, setData] = useState<Patient[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPatients: 0,
    averageAge: 0,
    activePatients: 0,
    recoveryRate: 0
  });
  const [focusedCard, setFocusedCard] = useState<number | null>(null);

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

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

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
      .style("fill", "#e2e8f0")
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "#e2e8f0")
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

    g.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#e2e8f0")
      .text("Department Distribution");
  }, [data]);

  // Age vs Heart Rate scatter plot
  useEffect(() => {
    if (!scatterPlotRef.current || data.length === 0) return;

    const svg = d3.select(scatterPlotRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

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
      .style("fill", "#e2e8f0")
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "#e2e8f0")
      .style("font-size", "12px");

    g.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("cx", d => x(d.age))
      .attr("cy", d => y(d.vitalSigns.heartRate))
      .attr("r", 4)
      .attr("fill", d => d.status === 'active' ? "#ef4444" : "#10b981")
      .attr("opacity", 0.7);

    g.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#e2e8f0")
      .text("Age vs Heart Rate");
  }, [data]);

  // Status distribution pie chart
  useEffect(() => {
    if (!pieChartRef.current || data.length === 0) return;

    const svg = d3.select(pieChartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 20 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const g = svg.append("g").attr("transform", `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

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
      .attr("fill", d => color(d.data.status))
      .attr("opacity", 0.8);

    g.selectAll("text")
      .data(pie(statusData))
      .enter().append("text")
      .attr("transform", (d: any) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#fff")
      .text((d: any) => d.data.status);

    g.append("text")
      .attr("x", 0)
      .attr("y", -radius - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#e2e8f0")
      .text("Status Distribution");
  }, [data]);

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
          <div style={{
            background: 'rgba(59, 130, 246, 0.2)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}>
            <h3 style={{ color: '#3b82f6', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Patients</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.totalPatients}</p>
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}>
            <h3 style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Average Age</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.averageAge} years</p>
          </div>
          <div style={{
            background: 'rgba(245, 158, 11, 0.2)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}>
            <h3 style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Patients</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.activePatients}</p>
          </div>
          <div style={{
            background: 'rgba(236, 72, 153, 0.2)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(236, 72, 153, 0.3)',
          }}>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
        }}>
          {[
            { ref: svgRef, title: 'Department Distribution' },
            { ref: scatterPlotRef, title: 'Age vs Heart Rate' },
            { ref: pieChartRef, title: 'Status Distribution' },
            { ref: barChartRef, title: 'Patient Analytics' },
          ].map((chart, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem', textAlign: 'center' }}>
                {chart.title}
              </h3>
              <svg
                ref={chart.ref}
                width="100%"
                height="250"
                style={{
                  display: 'block',
                  margin: '0 auto',
                }}
              ></svg>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PatientsInsightsDashboard; 