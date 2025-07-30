import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { DoctorsAnalytics, DoctorsSummary } from '../services/api';

interface DoctorsAnalyticsProps {
  analytics: DoctorsAnalytics | null;
  analyticsSummary: DoctorsSummary | null;
}

const DoctorsAnalytics: React.FC<DoctorsAnalyticsProps> = ({ analytics, analyticsSummary }) => {
  const specializationChartRef = useRef<SVGSVGElement>(null);
  const experienceChartRef = useRef<SVGSVGElement>(null);
  const ratingChartRef = useRef<SVGSVGElement>(null);
  const departmentChartRef = useRef<SVGSVGElement>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Chart rendering
  useEffect(() => {
    if (!analytics) return;

    // Specialization distribution chart
    if (specializationChartRef.current && analytics.specialization_distribution) {
      const svg = d3.select(specializationChartRef.current);
      svg.selectAll("*").remove();

      const margin = { top: 10, right: 20, bottom: 60, left: 50 };
      const width = 400 - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;

      const g = svg.append("g").attr("transform", `translate(${margin.left + 90},${margin.top})`);

      const x = d3.scaleBand()
        .domain(analytics.specialization_distribution.map(d => d.specialization))
        .range([0, width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(analytics.specialization_distribution, d => d.count) || 0])
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
        .data(analytics.specialization_distribution)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.specialization) || 0)
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
        .text("Specialization");
    }

    // Experience vs Success Rate scatter plot
    if (experienceChartRef.current && analytics.experience_vs_success) {
      const svg = d3.select(experienceChartRef.current);
      svg.selectAll("*").remove();

      const margin = { top: 10, right: 20, bottom: 40, left: 50 };
      const width = 400 - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;

      const g = svg.append("g").attr("transform", `translate(${margin.left + 90},${margin.top})`);

      const x = d3.scaleLinear()
        .domain([0, d3.max(analytics.experience_vs_success, d => d.experience) || 0])
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(analytics.experience_vs_success, d => d.successRate) || 0])
        .range([height, 0]);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .call(d3.axisLeft(y));

      g.selectAll("circle")
        .data(analytics.experience_vs_success)
        .enter().append("circle")
        .attr("cx", d => x(d.experience))
        .attr("cy", d => y(d.successRate))
        .attr("r", 6)
        .attr("fill", d => d.rating >= 4.5 ? "#10b981" : "#f59e0b")
        .attr("opacity", 0.7);

      // Add axis labels
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - (margin.left - 5))
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Success Rate (%)");

      g.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Experience (Years)");
    }

    // Rating distribution
    if (ratingChartRef.current && analytics.rating_distribution) {
      const svg = d3.select(ratingChartRef.current);
      svg.selectAll("*").remove();

      const margin = { top: 10, right: 20, bottom: 40, left: 50 };
      const width = 400 - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;

      const g = svg.append("g").attr("transform", `translate(${margin.left + 90},${margin.top})`);

      const x = d3.scaleBand()
        .domain(analytics.rating_distribution.map(d => d.rating))
        .range([0, width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(analytics.rating_distribution, d => d.count) || 0])
        .range([height, 0]);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .call(d3.axisLeft(y));

      g.selectAll(".bar")
        .data(analytics.rating_distribution)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.rating) || 0)
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", "#ec4899")
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
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Rating");
    }

    // Department distribution pie chart
    if (departmentChartRef.current && analytics.department_distribution) {
      const svg = d3.select(departmentChartRef.current);
      svg.selectAll("*").remove();

      const margin = { top: 10, right: 120, bottom: 20, left: 20 };
      const width = 400 - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;
      const radius = Math.min(width, height) / 2;

      const g = svg.append("g").attr("transform", `translate(${width/2 + margin.left + 120},${height/2 + margin.top})`);

      const color = d3.scaleOrdinal()
        .domain(analytics.department_distribution.map(d => d.department))
        .range(["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"]);

      const pie = d3.pie<{department: string, count: number}>()
        .value(d => d.count);

      const arc = d3.arc<d3.PieArcDatum<{department: string, count: number}>>()
        .innerRadius(0)
        .outerRadius(radius);

      g.selectAll("path")
        .data(pie(analytics.department_distribution))
        .enter().append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.department) as string)
        .attr("opacity", 0.8);

      // Add legend
      const legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 9)
        .attr("text-anchor", "start")
        .selectAll("g")
        .data(pie(analytics.department_distribution))
        .enter().append("g")
        .attr("transform", (d, i) => `translate(${radius + 15}, ${i * 15 - 60})`);

      legend.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => color(d.data.department) as string);

      legend.append("text")
        .attr("x", 14)
        .attr("y", 7)
        .text(d => d.data.department);
    }
  }, [analytics]);

  // Re-render charts when modal is opened for larger size
  useEffect(() => {
    if (!analytics || !selectedCard) return;

    const renderModalChart = () => {
      if (selectedCard === 'specialization' && specializationChartRef.current && analytics.specialization_distribution) {
        const svg = d3.select(specializationChartRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 30, right: 30, bottom: 100, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
          .domain(analytics.specialization_distribution.map(d => d.specialization))
          .range([0, width])
          .padding(0.1);

        const y = d3.scaleLinear()
          .domain([0, d3.max(analytics.specialization_distribution, d => d.count) || 0])
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
          .data(analytics.specialization_distribution)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", d => x(d.specialization) || 0)
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
          .style("font-size", "14px")
          .text("Count");

        g.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 120})`)
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Specialization");
      }

      if (selectedCard === 'experience' && experienceChartRef.current && analytics.experience_vs_success) {
        const svg = d3.select(experienceChartRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 30, right: 30, bottom: 50, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
          .domain([0, d3.max(analytics.experience_vs_success, d => d.experience) || 0])
          .range([0, width]);

        const y = d3.scaleLinear()
          .domain([0, d3.max(analytics.experience_vs_success, d => d.successRate) || 0])
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
          .data(analytics.experience_vs_success)
          .enter().append("circle")
          .attr("cx", d => x(d.experience))
          .attr("cy", d => y(d.successRate))
          .attr("r", 8)
          .attr("fill", d => d.rating >= 4.5 ? "#10b981" : "#f59e0b")
          .attr("opacity", 0.7);

        // Add axis labels
        g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - (margin.left - 5))
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Success Rate (%)");

        g.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Experience (Years)");
      }

      if (selectedCard === 'rating' && ratingChartRef.current && analytics.rating_distribution) {
        const svg = d3.select(ratingChartRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 30, right: 30, bottom: 50, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
          .domain(analytics.rating_distribution.map(d => d.rating))
          .range([0, width])
          .padding(0.1);

        const y = d3.scaleLinear()
          .domain([0, d3.max(analytics.rating_distribution, d => d.count) || 0])
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

        g.selectAll(".bar")
          .data(analytics.rating_distribution)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", d => x(d.rating) || 0)
          .attr("y", d => y(d.count))
          .attr("width", x.bandwidth())
          .attr("height", d => height - y(d.count))
          .attr("fill", "#ec4899")
          .attr("opacity", 0.8);

        // Add axis labels
        g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - (margin.left - 15))
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Count");

        g.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Rating");
      }

      if (selectedCard === 'department' && departmentChartRef.current && analytics.department_distribution) {
        const svg = d3.select(departmentChartRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 30, right: 30, bottom: 30, left: 30 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
        const radius = Math.min(width, height) / 2;

        const g = svg.append("g").attr("transform", `translate(${width/2 + margin.left},${height/2 + margin.top})`);

        const color = d3.scaleOrdinal()
          .domain(analytics.department_distribution.map(d => d.department))
          .range(["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"]);

        const pie = d3.pie<{department: string, count: number}>()
          .value(d => d.count);

        const arc = d3.arc<d3.PieArcDatum<{department: string, count: number}>>()
          .innerRadius(0)
          .outerRadius(radius);

        g.selectAll("path")
          .data(pie(analytics.department_distribution))
          .enter().append("path")
          .attr("d", arc)
          .attr("fill", d => color(d.data.department) as string)
          .attr("opacity", 0.8);

        // Add legend
        const legend = g.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 12)
          .attr("text-anchor", "start")
          .selectAll("g")
          .data(pie(analytics.department_distribution))
          .enter().append("g")
          .attr("transform", (d, i) => `translate(${radius + 30}, ${i * 25 - 100})`);

        legend.append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", d => color(d.data.department) as string);

        legend.append("text")
          .attr("x", 20)
          .attr("y", 12)
          .text(d => d.data.department);
      }
    };

    // Small delay to ensure the modal is rendered
    setTimeout(renderModalChart, 100);
  }, [selectedCard, analytics]);

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
            onClick={() => setSelectedCard('totalDoctors')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ color: '#3b82f6', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Doctors</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{analyticsSummary?.totalDoctors || 0}</p>
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
            onClick={() => setSelectedCard('avgExperience')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Avg Experience</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{analyticsSummary?.calculated_stats?.average_experience || analyticsSummary?.averageExperience || 0} years</p>
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
            onClick={() => setSelectedCard('avgRating')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Avg Rating</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>⭐ {analyticsSummary?.calculated_stats?.average_rating || analyticsSummary?.averageRating || 0}</p>
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
            onClick={() => setSelectedCard('successRate')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ color: '#ec4899', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Success Rate</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{analyticsSummary?.calculated_stats?.average_success_rate || analyticsSummary?.averageSuccessRate || 0}%</p>
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
            { ref: specializationChartRef, title: 'Specialization Distribution', key: 'specialization' },
            { ref: experienceChartRef, title: 'Experience vs Success Rate', key: 'experience' },
            { ref: ratingChartRef, title: 'Rating Distribution', key: 'rating' },
            { ref: departmentChartRef, title: 'Department Distribution', key: 'department' },
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
            
            {selectedCard === 'totalDoctors' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Total Doctors
                </h2>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  textAlign: 'center',
                }}>
                  <h3 style={{ color: '#3b82f6', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Total Doctors</h3>
                  <p style={{ color: '#1e293b', fontSize: '3rem', fontWeight: 'bold' }}>{analyticsSummary?.totalDoctors || 0}</p>
                  <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Registered healthcare professionals</p>
                </div>
              </div>
            )}
            
            {selectedCard === 'avgExperience' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Average Experience
                </h2>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  textAlign: 'center',
                }}>
                  <h3 style={{ color: '#10b981', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Average Experience</h3>
                  <p style={{ color: '#1e293b', fontSize: '3rem', fontWeight: 'bold' }}>{analyticsSummary?.calculated_stats?.average_experience || analyticsSummary?.averageExperience || 0}</p>
                  <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Years of professional experience</p>
                </div>
              </div>
            )}
            
            {selectedCard === 'avgRating' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Average Rating
                </h2>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  textAlign: 'center',
                }}>
                  <h3 style={{ color: '#f59e0b', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Average Rating</h3>
                  <p style={{ color: '#1e293b', fontSize: '3rem', fontWeight: 'bold' }}>⭐ {analyticsSummary?.calculated_stats?.average_rating || analyticsSummary?.averageRating || 0}</p>
                  <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Patient satisfaction score</p>
                </div>
              </div>
            )}
            
            {selectedCard === 'successRate' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Success Rate
                </h2>
                <div style={{
                  background: 'rgba(236, 72, 153, 0.1)',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(236, 72, 153, 0.2)',
                  textAlign: 'center',
                }}>
                  <h3 style={{ color: '#ec4899', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Success Rate</h3>
                  <p style={{ color: '#1e293b', fontSize: '3rem', fontWeight: 'bold' }}>{analyticsSummary?.calculated_stats?.average_success_rate || analyticsSummary?.averageSuccessRate || 0}%</p>
                  <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Treatment success percentage</p>
                </div>
              </div>
            )}
            
            {selectedCard === 'specialization' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Specialization Distribution
                </h2>
                <svg
                  ref={specializationChartRef}
                  width="800"
                  height="500"
                  style={{
                    display: 'block',
                    margin: '0 auto',
                  }}
                ></svg>
              </div>
            )}
            
            {selectedCard === 'experience' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Experience vs Success Rate
                </h2>
                <svg
                  ref={experienceChartRef}
                  width="800"
                  height="500"
                  style={{
                    display: 'block',
                    margin: '0 auto',
                  }}
                ></svg>
              </div>
            )}
            
            {selectedCard === 'rating' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Rating Distribution
                </h2>
                <svg
                  ref={ratingChartRef}
                  width="800"
                  height="500"
                  style={{
                    display: 'block',
                    margin: '0 auto',
                  }}
                ></svg>
              </div>
            )}
            
            {selectedCard === 'department' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  Department Distribution
                </h2>
                <svg
                  ref={departmentChartRef}
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

export default DoctorsAnalytics; 