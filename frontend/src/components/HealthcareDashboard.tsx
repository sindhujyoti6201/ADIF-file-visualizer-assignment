"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface PatientData {
  id: string;
  age: number;
  gender: string;
  diagnosis: string;
  lengthOfStay: number;
  readmission: boolean;
  vitalSigns: {
    heartRate: number;
    bloodPressure: number;
    temperature: number;
    oxygenSaturation: number;
  };
}

interface DashboardMetrics {
  totalPatients: number;
  averageAge: number;
  readmissionRate: number;
  averageLengthOfStay: number;
}

const HealthcareDashboard: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const barChartRef = useRef<SVGSVGElement>(null);
  const lineChartRef = useRef<SVGSVGElement>(null);
  const pieChartRef = useRef<SVGSVGElement>(null);
  const scatterPlotRef = useRef<SVGSVGElement>(null);

  const [data, setData] = useState<PatientData[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPatients: 0,
    averageAge: 0,
    readmissionRate: 0,
    averageLengthOfStay: 0
  });

  // Load data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('healthcareData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.patients && Array.isArray(parsedData.patients)) {
          setData(parsedData.patients);
        }
      } catch (error) {
        console.error('Error parsing healthcare data:', error);
      }
    }
  }, []);

  // Calculate dashboard metrics
  useEffect(() => {
    if (data.length === 0) return;

    const totalPatients = data.length;
    const averageAge = data.reduce((sum, patient) => sum + patient.age, 0) / totalPatients;
    const readmissionRate = (data.filter(p => p.readmission).length / totalPatients) * 100;
    const averageLengthOfStay = data.reduce((sum, patient) => sum + patient.lengthOfStay, 0) / totalPatients;

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

    const diagnosisCounts = d3.group(data, d => d.diagnosis);
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
      .domain([0, d3.max(data, d => d.lengthOfStay) || 0])
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
      .attr("cy", d => y(d.lengthOfStay))
      .attr("r", 4)
      .attr("fill", d => d.readmission ? "#ef4444" : "#10b981")
      .attr("opacity", 0.7);

    g.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Age vs Length of Stay");

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
    <div style={{
      padding: '2rem',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Healthcare Analytics Dashboard
        </h1>

        {/* Key Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #3b82f6'
          }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Patients</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{metrics.totalPatients}</p>
          </div>
          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #10b981'
          }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Average Age</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{metrics.averageAge} years</p>
          </div>
          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #f59e0b'
          }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Readmission Rate</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{metrics.readmissionRate}%</p>
          </div>
          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #ef4444'
          }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Avg Length of Stay</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{metrics.averageLengthOfStay} days</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <svg ref={svgRef} width="400" height="250"></svg>
          </div>
          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <svg ref={barChartRef} width="400" height="250"></svg>
          </div>
          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <svg ref={lineChartRef} width="400" height="250"></svg>
          </div>
          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <svg ref={pieChartRef} width="300" height="250"></svg>
          </div>
          <div style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <svg ref={scatterPlotRef} width="400" height="250"></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareDashboard; 