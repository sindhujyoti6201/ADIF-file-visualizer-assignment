"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getDoctors, Doctor, DoctorsResponse } from '../services/api';
import { Toaster, toast } from 'react-hot-toast';

const DoctorsDashboard: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [summary, setSummary] = useState<DoctorsResponse['summary'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [focusedCard, setFocusedCard] = useState<number | null>(null);

  // Chart refs
  const specializationChartRef = useRef<SVGSVGElement>(null);
  const experienceChartRef = useRef<SVGSVGElement>(null);
  const ratingChartRef = useRef<SVGSVGElement>(null);
  const departmentChartRef = useRef<SVGSVGElement>(null);

  // Load doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getDoctors();
        setDoctors(data.doctors);
        setSummary(data.summary);
        toast.success(`Loaded ${data.doctors.length} doctors`, {
          duration: 3000,
        });
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors data', {
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Specialization distribution chart
  useEffect(() => {
    if (!specializationChartRef.current || doctors.length === 0) return;

    const svg = d3.select(specializationChartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 80, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const specializationCounts = d3.group(doctors, d => d.specialization);
    const specializationData = Array.from(specializationCounts, ([specialization, doctors]) => ({
      specialization,
      count: doctors.length
    }));

    const x = d3.scaleBand()
      .domain(specializationData.map(d => d.specialization))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(specializationData, d => d.count) || 0])
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
      .data(specializationData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.specialization) || 0)
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
      .text("Specialization Distribution");

  }, [doctors]);

  // Experience vs Success Rate scatter plot
  useEffect(() => {
    if (!experienceChartRef.current || doctors.length === 0) return;

    const svg = d3.select(experienceChartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(doctors, d => d.experience) || 0])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(doctors, d => d.successRate) || 0])
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.selectAll("circle")
      .data(doctors)
      .enter().append("circle")
      .attr("cx", d => x(d.experience))
      .attr("cy", d => y(d.successRate))
      .attr("r", 6)
      .attr("fill", d => d.rating >= 4.5 ? "#10b981" : "#f59e0b")
      .attr("opacity", 0.7);

    g.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Experience vs Success Rate");

  }, [doctors]);

  // Rating distribution
  useEffect(() => {
    if (!ratingChartRef.current || doctors.length === 0) return;

    const svg = d3.select(ratingChartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const ratingGroups = d3.group(doctors, d => Math.floor(d.rating * 10) / 10);
    const ratingData = Array.from(ratingGroups, ([rating, doctors]) => ({
      rating: rating.toFixed(1),
      count: doctors.length
    }));

    const x = d3.scaleBand()
      .domain(ratingData.map(d => d.rating))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(ratingData, d => d.count) || 0])
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.selectAll(".bar")
      .data(ratingData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.rating) || 0)
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.count))
      .attr("fill", "#ec4899")
      .attr("opacity", 0.8);

    g.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Rating Distribution");

  }, [doctors]);

  // Department distribution pie chart
  useEffect(() => {
    if (!departmentChartRef.current || doctors.length === 0) return;

    const svg = d3.select(departmentChartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 300 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const g = svg.append("g").attr("transform", `translate(${width/2 + margin.left},${height/2 + margin.top})`);

    const departmentCounts = d3.group(doctors, d => d.department);
    const departmentData = Array.from(departmentCounts, ([department, doctors]) => ({
      department,
      count: doctors.length
    }));

    const color = d3.scaleOrdinal()
      .domain(departmentData.map(d => d.department))
      .range(["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"]);

    const pie = d3.pie<{department: string, count: number}>()
      .value(d => d.count);

    const arc = d3.arc<d3.PieArcDatum<{department: string, count: number}>>()
      .innerRadius(0)
      .outerRadius(radius);

    g.selectAll("path")
      .data(pie(departmentData))
      .enter().append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.department) as string)
      .attr("opacity", 0.8);

    g.append("text")
      .attr("x", 0)
      .attr("y", -radius - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Department Distribution");

  }, [doctors]);

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
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Loading doctors data...</p>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
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
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>No doctors data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      <Toaster 
        position="top-right"
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
        <source src="https://catalyzer-fe-public-assets.s3.us-east-1.amazonaws.com/mixkit-futuristic-diagrams-of-dna-scans-in-modern-lab-5579-hd-ready.mp4" type="video/mp4" />
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
          Doctors Analytics Dashboard
        </h1>
        <div style={{ height: '1.5rem' }} />
        
        <div style={{
          maxWidth: '1400px',
          width: '100%',
        }}>
          {/* Key Metrics */}
          {summary && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
              position: 'relative',
            }}>
              {[{
                title: 'Total Doctors',
                value: summary.totalDoctors,
                suffix: '',
              }, {
                title: 'Average Experience',
                value: summary.averageExperience,
                suffix: ' years',
              }, {
                title: 'Average Rating',
                value: summary.averageRating,
                suffix: '',
              }, {
                title: 'Average Success Rate',
                value: summary.averageSuccessRate,
                suffix: '%',
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
          )}

          {/* Charts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
            position: 'relative',
          }}>
            {[specializationChartRef, experienceChartRef, ratingChartRef, departmentChartRef].map((ref, idx) => (
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

          {/* Doctors List */}
          <div style={{
            background: '#f3f4f6',
            padding: '2rem',
            borderRadius: '22px',
            boxShadow: '0 8px 32px 0 rgba(30,41,59,0.18), 0 1.5px 8px 0 rgba(30,41,59,0.10)',
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Medical Staff Directory
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1.5rem',
            }}>
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  style={{
                    background: '#fff',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: selectedDoctor?.id === doctor.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
                  }}
                  onClick={() => setSelectedDoctor(selectedDoctor?.id === doctor.id ? null : doctor)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
                        {doctor.name}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        {doctor.specialization} • {doctor.department}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        {doctor.experience} years experience • {doctor.education}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                        ⭐ {doctor.rating}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        {doctor.successRate}% success
                      </div>
                    </div>
                  </div>
                  
                  {selectedDoctor?.id === doctor.id && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <strong>Contact:</strong><br />
                          📧 {doctor.contact.email}<br />
                          📞 {doctor.contact.phone}
                        </div>
                        <div>
                          <strong>Location:</strong><br />
                          📍 {doctor.location}<br />
                          🕒 {doctor.availability}
                        </div>
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong>Languages:</strong> {doctor.languages.join(', ')}
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong>Certifications:</strong> {doctor.certifications.join(', ')}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                        <div>🔪 Surgeries: {doctor.stats.surgeriesPerformed}</div>
                        <div>💚 Recovered: {doctor.stats.patientsRecovered}</div>
                        <div>📚 Research: {doctor.stats.researchPapers}</div>
                        <div>🏆 Awards: {doctor.stats.awards}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsDashboard; 