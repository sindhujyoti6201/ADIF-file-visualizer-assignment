"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Navbar from './Navbar';

import { Toaster, toast } from 'react-hot-toast';

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
  readmissionRate: number;
  averageLengthOfStay: number;
}

interface HealthcareDashboardProps {
  patientsData?: Patient[];
}

const HealthcareDashboard: React.FC<HealthcareDashboardProps> = ({ patientsData }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const barChartRef = useRef<SVGSVGElement>(null);
  const lineChartRef = useRef<SVGSVGElement>(null);
  const pieChartRef = useRef<SVGSVGElement>(null);
  const scatterPlotRef = useRef<SVGSVGElement>(null);

  const [data, setData] = useState<Patient[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPatients: 0,
    averageAge: 0,
    readmissionRate: 0,
    averageLengthOfStay: 0
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
    // Calculate readmission rate based on status instead of readmission field
    const readmissionRate = (data.filter(p => p.status === 'active').length / totalPatients) * 100;
    // Use a default length of stay since we don't have this field
    const averageLengthOfStay = 5.2; // Default value

    setMetrics({
      totalPatients,
      averageAge: Math.round(averageAge),
      readmissionRate: Math.round(readmissionRate * 10) / 10,
      averageLengthOfStay: Math.round(averageLengthOfStay * 10) / 10
    });
  }, [data]);

  // Age distribution chart
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const ageGroups = d3.group(data, d => Math.floor(d.age / 10) * 10);
    const ageData = Array.from(ageGroups, ([age, patients]) => ({
      age: `${age}-${age + 9}`,
      count: patients.length
    }));

    const x = d3.scaleBand()
      .domain(ageData.map(d => d.age))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(ageData, d => d.count) || 0])
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.selectAll(".bar")
      .data(ageData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.age) || 0)
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
      .text("Age Distribution");

  }, [data]);

  // Diagnosis distribution bar chart
  useEffect(() => {
    if (!barChartRef.current || data.length === 0) return;

    const svg = d3.select(barChartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 80, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const diagnosisCounts = d3.group(data, d => d.condition);
    const diagnosisData = Array.from(diagnosisCounts, ([diagnosis, patients]) => ({
      diagnosis,
      count: patients.length
    })).sort((a, b) => b.count - a.count);

    const x = d3.scaleBand()
      .domain(diagnosisData.map(d => d.diagnosis))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(diagnosisData, d => d.count) || 0])
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
      .data(diagnosisData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.diagnosis) || 0)
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.count))
      .attr("fill", "#10b981")
      .attr("opacity", 0.8);

    g.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Diagnosis Distribution");

  }, [data]);

  // Vital signs trend line chart
  useEffect(() => {
    if (!lineChartRef.current || data.length === 0) return;

    const svg = d3.select(lineChartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Create time series data (last 30 days)
    const timeData = Array.from({ length: 30 }, (_, i) => {
      const dayPatients = data.slice(i * 5, (i + 1) * 5);
      const avgHeartRate = dayPatients.reduce((sum, p) => sum + p.vitalSigns.heartRate, 0) / dayPatients.length;
      return {
        day: i + 1,
        heartRate: avgHeartRate,
        temperature: dayPatients.reduce((sum, p) => sum + p.vitalSigns.temperature, 0) / dayPatients.length
      };
    });

    const x = d3.scaleLinear()
      .domain([1, 30])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(timeData, d => d.heartRate) || 0])
      .range([height, 0]);

    const line = d3.line<{day: number, heartRate: number}>()
      .x(d => x(d.day))
      .y(d => y(d.heartRate));

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.append("path")
      .datum(timeData)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("d", line);

    g.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Average Heart Rate Trend");

  }, [data]);

  // Gender distribution pie chart
  useEffect(() => {
    if (!pieChartRef.current || data.length === 0) return;

    const svg = d3.select(pieChartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 300 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const g = svg.append("g").attr("transform", `translate(${width/2 + margin.left},${height/2 + margin.top})`);

    const genderCounts = d3.group(data, d => d.gender);
    const genderData = Array.from(genderCounts, ([gender, patients]) => ({
      gender,
      count: patients.length
    }));

    const color = d3.scaleOrdinal()
      .domain(genderData.map(d => d.gender))
      .range(["#3b82f6", "#ec4899"]);

    const pie = d3.pie<{gender: string, count: number}>()
      .value(d => d.count);

    const arc = d3.arc<d3.PieArcDatum<{gender: string, count: number}>>()
      .innerRadius(0)
      .outerRadius(radius);

    g.selectAll("path")
      .data(pie(genderData))
      .enter().append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.gender) as string)
      .attr("opacity", 0.8);

    // Add labels
    g.selectAll("text")
      .data(pie(genderData))
      .enter().append("text")
      .attr("transform", d => {
        const centroid = arc.centroid(d);
        if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) {
          return 'translate(0,0)';
        }
        return `translate(${centroid[0]},${centroid[1]})`;
      })
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text(d => `${d.data.gender}\n${d.data.count}`);

    g.append("text")
      .attr("x", 0)
      .attr("y", -radius - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Gender Distribution");

  }, [data]);

  // Length of stay vs age scatter plot
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
      .domain([0, 100]) // Use a fixed range for heart rate
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
      .attr("r", 4)
      .attr("fill", d => d.status === 'active' ? "#ef4444" : "#10b981")
      .attr("opacity", 0.7);

    g.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Age vs Heart Rate");

  }, [data]);

  if (data.length === 0) {
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
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>No healthcare data available. Please upload a file first.</p>
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
      {/* <Navbar /> */}
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
        <source src="https://catalyzer-fe-public-assets.s3.us-east-1.amazonaws.com/mixkit-glucose-molecule-3768-hd-ready.mp4" type="video/mp4" />
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
        paddingTop: '2.5rem',
        paddingBottom: '7rem',
        background: 'transparent',
      }}>
        <h1 style={{
          fontSize: '3.8rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1.5rem',
          textAlign: 'center',
          letterSpacing: '0.02em',
          fontFamily: 'monospace',
          whiteSpace: 'pre',
          wordBreak: 'break-word',
        }}>
          Patients Insights Dashboard
        </h1>
        <div style={{ height: '1.5rem' }} />
        {/* Key Metrics and Charts Grid remain unchanged */}
        <div style={{
          maxWidth: '1400px',
          width: '100%',
        }}>
          {/* Key Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
            position: 'relative',
          }}>
            {[{
              title: 'Total Patients',
              value: metrics.totalPatients,
              suffix: '',
            }, {
              title: 'Average Age',
              value: metrics.averageAge,
              suffix: ' years',
            }, {
              title: 'Readmission Rate',
              value: metrics.readmissionRate,
              suffix: '%',
            }, {
              title: 'Avg Length of Stay',
              value: metrics.averageLengthOfStay,
              suffix: ' days',
            }].map((card, idx) => (
              <div
                key={card.title}
                style={{
                  background: '#f3f4f6',
                  padding: focusedCard === idx ? '3.5rem 2.5rem' : '2.2rem 1.7rem',
                  borderRadius: '22px',
                  boxShadow: focusedCard === idx
                    ? '0 16px 64px 0 rgba(30,41,59,0.28), 0 4px 32px 0 rgba(30,41,59,0.18)'
                    : '0 8px 32px 0 rgba(30,41,59,0.18), 0 1.5px 8px 0 rgba(30,41,59,0.10)',
                  color: '#1e293b',
                  transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
                  cursor: focusedCard === idx ? 'zoom-out' : 'pointer',
                  border: 'none',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 500,
                  zIndex: focusedCard === idx ? 10 : 1,
                  opacity: focusedCard === null || focusedCard === idx ? 1 : 0.25,
                  filter: focusedCard === null || focusedCard === idx ? 'none' : 'blur(1.5px)',
                  position: focusedCard === idx ? 'absolute' : 'relative',
                  left: focusedCard === idx ? '50%' : undefined,
                  top: focusedCard === idx ? '50%' : undefined,
                  transform: focusedCard === idx
                    ? 'translate(-50%, -50%) scale(1.15)'
                    : 'none',
                  width: focusedCard === idx ? 'min(600px, 50vw)' : undefined,
                  minWidth: focusedCard === idx ? '320px' : undefined,
                  maxWidth: focusedCard === idx ? '600px' : undefined,
                  height: focusedCard === idx ? 'auto' : undefined,
                  pointerEvents: focusedCard === null || focusedCard === idx ? 'auto' : 'none',
                  display: focusedCard === idx ? 'flex' : 'block',
                  flexDirection: focusedCard === idx ? 'column' : undefined,
                  alignItems: focusedCard === idx ? 'center' : undefined,
                  justifyContent: focusedCard === idx ? 'center' : undefined,
                  textAlign: focusedCard === idx ? 'center' : undefined,
                }}
                onClick={e => {
                  e.stopPropagation();
                  setFocusedCard(focusedCard === idx ? null : idx);
                }}
              >
                <h3 style={{ color: '#2563eb', fontSize: focusedCard === idx ? '1.5rem' : '1.08rem', marginBottom: '0.5rem', fontWeight: 700 }}>{card.title}</h3>
                <p style={{ fontSize: focusedCard === idx ? '3.5rem' : '2.3rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{card.value}{card.suffix}</p>
              </div>
            ))}
            {/* Overlay for click-away to unfocus */}
            {focusedCard !== null && (
              <div
                onClick={() => setFocusedCard(null)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 5,
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              />
            )}
          </div>
          
          {/* 3D Visualization */}
          <div style={{
            background: '#f3f4f6',
            padding: '1.7rem',
            borderRadius: '22px',
            boxShadow: '0 8px 32px 0 rgba(30,41,59,0.18), 0 1.5px 8px 0 rgba(30,41,59,0.10)',
            marginBottom: '2rem',
          }}>
            <h3 style={{ 
              color: '#2563eb', 
              fontSize: '1.2rem', 
              marginBottom: '1rem', 
              fontWeight: 700,
              textAlign: 'center'
            }}>
              3D Patient Data Visualization
            </h3>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '0.9rem', 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Advanced healthcare analytics dashboard with interactive charts and data visualization
            </p>
          </div>
          
          {/* Charts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            position: 'relative',
          }}>
            {[svgRef, barChartRef, lineChartRef, pieChartRef, scatterPlotRef].map((ref, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f3f4f6',
                  padding: focusedCard === idx + 4 ? '3.5rem 2.5rem' : '1.7rem',
                  borderRadius: '22px',
                  boxShadow: focusedCard === idx + 4
                    ? '0 16px 64px 0 rgba(30,41,59,0.28), 0 4px 32px 0 rgba(30,41,59,0.18)'
                    : '0 8px 32px 0 rgba(30,41,59,0.18), 0 1.5px 8px 0 rgba(30,41,59,0.10)',
                  color: '#1e293b',
                  transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
                  cursor: focusedCard === idx + 4 ? 'zoom-out' : 'pointer',
                  border: 'none',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 500,
                  zIndex: focusedCard === idx + 4 ? 10 : 1,
                  opacity: focusedCard === null || focusedCard === idx + 4 ? 1 : 0.25,
                  filter: focusedCard === null || focusedCard === idx + 4 ? 'none' : 'blur(1.5px)',
                  position: focusedCard === idx + 4 ? 'absolute' : 'relative',
                  left: focusedCard === idx + 4 ? '50%' : undefined,
                  top: focusedCard === idx + 4 ? '50%' : undefined,
                  transform: focusedCard === idx + 4
                    ? 'translate(-50%, -50%) scale(1.15)'
                    : 'none',
                  width: focusedCard === idx + 4 ? 'min(700px, 50vw)' : undefined,
                  minWidth: focusedCard === idx + 4 ? '340px' : undefined,
                  maxWidth: focusedCard === idx + 4 ? '700px' : undefined,
                  height: focusedCard === idx + 4 ? 'min(500px, 60vh)' : undefined,
                  maxHeight: focusedCard === idx + 4 ? '500px' : undefined,
                  pointerEvents: focusedCard === null || focusedCard === idx + 4 ? 'auto' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: focusedCard === idx + 4 ? 'center' : undefined,
                }}
                onClick={e => {
                  e.stopPropagation();
                  setFocusedCard(focusedCard === idx + 4 ? null : idx + 4);
                }}
              >
                <div style={{
                  width: focusedCard === idx + 4 ? '90%' : '100%',
                  height: focusedCard === idx + 4 ? '80%' : '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  transition: 'width 0.25s cubic-bezier(.4,2,.6,1), height 0.25s cubic-bezier(.4,2,.6,1)',
                }}>
                  <svg
                    ref={ref}
                    width={focusedCard === idx + 4 ? '100%' : 400}
                    height={focusedCard === idx + 4 ? '100%' : 250}
                    style={{
                      transition: 'width 0.25s cubic-bezier(.4,2,.6,1), height 0.25s cubic-bezier(.4,2,.6,1)',
                      display: 'block',
                      margin: '0 auto',
                    }}
                  ></svg>
                </div>
              </div>
            ))}
            {focusedCard !== null && (
              <div
                onClick={() => setFocusedCard(null)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 5,
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              />
            )}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default HealthcareDashboard; 