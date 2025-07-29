import React, { useEffect, useRef } from 'react';
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

  // Chart rendering
  useEffect(() => {
    if (!analytics) return;

    // Specialization distribution chart
    if (specializationChartRef.current && analytics.specialization_distribution) {
      const svg = d3.select(specializationChartRef.current);
      svg.selectAll("*").remove();

      const margin = { top: 20, right: 20, bottom: 80, left: 50 };
      const width = 400 - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;

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

      g.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Specialization Distribution");
    }

    // Experience vs Success Rate scatter plot
    if (experienceChartRef.current && analytics.experience_vs_success) {
      const svg = d3.select(experienceChartRef.current);
      svg.selectAll("*").remove();

      const margin = { top: 20, right: 20, bottom: 40, left: 50 };
      const width = 400 - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;

      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

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

      g.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Experience vs Success Rate");
    }

    // Rating distribution
    if (ratingChartRef.current && analytics.rating_distribution) {
      const svg = d3.select(ratingChartRef.current);
      svg.selectAll("*").remove();

      const margin = { top: 20, right: 20, bottom: 40, left: 50 };
      const width = 400 - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;

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

      g.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Rating Distribution");
    }

    // Department distribution pie chart
    if (departmentChartRef.current && analytics.department_distribution) {
      const svg = d3.select(departmentChartRef.current);
      svg.selectAll("*").remove();

      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const width = 300 - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;
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

      g.append("text")
        .attr("x", 0)
        .attr("y", -radius - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Department Distribution");
    }
  }, [analytics]);

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
            <h3 style={{ color: '#3b82f6', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Doctors</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{analyticsSummary?.totalDoctors || 0}</p>
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}>
            <h3 style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Avg Experience</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{analyticsSummary?.calculated_stats?.average_experience || analyticsSummary?.averageExperience || 0} years</p>
          </div>
          <div style={{
            background: 'rgba(245, 158, 11, 0.2)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}>
            <h3 style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Avg Rating</h3>
            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>⭐ {analyticsSummary?.calculated_stats?.average_rating || analyticsSummary?.averageRating || 0}</p>
          </div>
          <div style={{
            background: 'rgba(236, 72, 153, 0.2)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(236, 72, 153, 0.3)',
          }}>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
        }}>
          {[
            { ref: specializationChartRef, title: 'Specialization Distribution' },
            { ref: experienceChartRef, title: 'Experience vs Success Rate' },
            { ref: ratingChartRef, title: 'Rating Distribution' },
            { ref: departmentChartRef, title: 'Department Distribution' },
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

export default DoctorsAnalytics; 