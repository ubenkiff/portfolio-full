import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function ATSScore() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/resume/data`);
      setData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-8">Loading ATS version...</div>;
  }

  const { profile = {}, experience = [], education = [], skills = [], projects = [], achievements = [] } = data || {};

  // Group skills by category
  const skillsByCategory = {};
  skills.forEach(s => {
    if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
    skillsByCategory[s.category].push(s);
  });

  return (
    <div>
      {/* Print Button - Hidden when printing */}
      <div className="mb-6 flex justify-between items-center no-print">
        <div>
          <h1 className="text-2xl font-bold text-white">ATS Resume Optimizer</h1>
          <p className="text-slate-400 text-sm mt-1">Simple, single-column format optimized for ATS scanners</p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
        >
          <i className="fas fa-print mr-2"></i> Print ATS Resume
        </button>
      </div>

      {/* ATS-Friendly Resume Preview - Optimized Spacing */}
      <div className="ats-resume-container bg-white" style={{ 
        fontFamily: 'Arial, Calibri, sans-serif',
        fontSize: '11pt',
        lineHeight: '1.4',
        color: '#000000',
        maxWidth: '8.5in',
        margin: '0 auto',
        padding: '0.5in'
      }}>
        
        {/* Header - Reduced spacing */}
        <div style={{ borderBottom: '1px solid #cccccc', paddingBottom: '8px', marginBottom: '12px' }}>
          <h1 style={{ fontSize: '18pt', fontWeight: 'bold', margin: '0 0 4px 0', color: '#000000' }}>
            {profile.name || 'Your Name'}
          </h1>
          <p style={{ fontSize: '12pt', fontWeight: 'bold', margin: '0 0 6px 0', color: '#000000' }}>
            {profile.title || 'Professional Title'}
          </p>
          <div style={{ fontSize: '10pt', color: '#333333', lineHeight: '1.3' }}>
            {profile.email && <div>Email: {profile.email}</div>}
            {profile.phone && <div>Phone: {profile.phone}</div>}
            {profile.location && <div>Location: {profile.location}</div>}
            {profile.linkedin && <div>LinkedIn: {profile.linkedin}</div>}
          </div>
        </div>

        {/* Professional Summary */}
        {profile.bio && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ 
              fontSize: '12pt', 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              borderBottom: '1px solid #cccccc',
              paddingBottom: '3px',
              marginBottom: '8px',
              color: '#000000'
            }}>
              Professional Summary
            </h2>
            <p style={{ fontSize: '10pt', lineHeight: '1.4', margin: '0', color: '#333333' }}>{profile.bio}</p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ 
              fontSize: '12pt', 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              borderBottom: '1px solid #cccccc',
              paddingBottom: '3px',
              marginBottom: '8px',
              color: '#000000'
            }}>
              Work Experience
            </h2>
            {experience.map((exp, idx) => (
              <div key={exp.id} style={{ marginBottom: idx === experience.length - 1 ? '0' : '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '2px' }}>
                  <div>
                    <h3 style={{ fontSize: '11pt', fontWeight: 'bold', margin: '0', color: '#000000' }}>{exp.job_title}</h3>
                    <p style={{ fontSize: '10pt', fontWeight: 'normal', margin: '0', color: '#333333' }}>
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </p>
                  </div>
                  <p style={{ fontSize: '9pt', color: '#555555', margin: '0' }}>
                    {exp.start_date} — {exp.current ? 'Present' : exp.end_date}
                  </p>
                </div>
                {exp.description && (
                  <p style={{ fontSize: '10pt', margin: '4px 0 0 0', color: '#333333' }}>{exp.description}</p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                    {exp.highlights.map((h, i) => (
                      <li key={i} style={{ fontSize: '10pt', marginBottom: '2px', color: '#333333' }}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ 
              fontSize: '12pt', 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              borderBottom: '1px solid #cccccc',
              paddingBottom: '3px',
              marginBottom: '8px',
              color: '#000000'
            }}>
              Skills
            </h2>
            {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
              <div key={cat} style={{ marginBottom: '6px' }}>
                <h3 style={{ fontSize: '10pt', fontWeight: 'bold', margin: '0', color: '#000000' }}>{cat}</h3>
                <p style={{ fontSize: '10pt', margin: '2px 0 0 0', color: '#333333' }}>
                  {catSkills.map(s => s.name).join(', ')}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ 
              fontSize: '12pt', 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              borderBottom: '1px solid #cccccc',
              paddingBottom: '3px',
              marginBottom: '8px',
              color: '#000000'
            }}>
              Key Projects
            </h2>
            {projects.map((p, idx) => (
              <div key={p.id} style={{ marginBottom: idx === projects.length - 1 ? '0' : '10px' }}>
                <h3 style={{ fontSize: '10pt', fontWeight: 'bold', margin: '0', color: '#000000' }}>{p.title}</h3>
                <p style={{ fontSize: '10pt', margin: '2px 0 0 0', color: '#333333' }}>{p.description}</p>
                {p.tech_stack && p.tech_stack.length > 0 && (
                  <p style={{ fontSize: '9pt', margin: '2px 0 0 0', color: '#555555' }}>
                    Technologies: {p.tech_stack.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ 
              fontSize: '12pt', 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              borderBottom: '1px solid #cccccc',
              paddingBottom: '3px',
              marginBottom: '8px',
              color: '#000000'
            }}>
              Education
            </h2>
            {education.map((edu, idx) => (
              <div key={edu.id} style={{ marginBottom: idx === education.length - 1 ? '0' : '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: '10pt', fontWeight: 'bold', margin: '0', color: '#000000' }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </h3>
                    <p style={{ fontSize: '10pt', margin: '0', color: '#333333' }}>
                      {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                    </p>
                  </div>
                  <p style={{ fontSize: '9pt', color: '#555555', margin: '0' }}>
                    {edu.start_year} — {edu.end_year || 'Present'}
                  </p>
                </div>
                {edu.grade && <p style={{ fontSize: '9pt', margin: '2px 0 0 0', color: '#555555' }}>Grade: {edu.grade}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div style={{ marginBottom: '0' }}>
            <h2 style={{ 
              fontSize: '12pt', 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              borderBottom: '1px solid #cccccc',
              paddingBottom: '3px',
              marginBottom: '8px',
              color: '#000000'
            }}>
              Achievements
            </h2>
            {achievements.map((a, idx) => (
              <div key={a.id} style={{ marginBottom: idx === achievements.length - 1 ? '0' : '6px' }}>
                <h3 style={{ fontSize: '10pt', fontWeight: 'bold', margin: '0', color: '#000000' }}>{a.title}</h3>
                <p style={{ fontSize: '9pt', margin: '0', color: '#555555' }}>{a.issuer} — {a.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

            {/* Print-only CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .ats-resume-container, .ats-resume-container * {
            visibility: visible;
          }
          .ats-resume-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            margin: 0;
            padding: 0;  /* Changed from 0.2in to 0 - removes top spacing */
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
          button {
            display: none !important;
          }
          @page {
            size: letter;
            margin: 0.3in;  /* Controls overall page margin */
          }
        }
      `}</style>
    </div>
  );
}

export default ATSScore;