import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function ResumePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/resume/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100">Loading resume...</div>;
  }

  const { profile = {}, experience = [], education = [], skills = [], projects = [], achievements = [] } = data || {};

  const skillsByCategory = {};
  skills.forEach(s => {
    if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
    skillsByCategory[s.category].push(s);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Toolbar */}
      <div className="no-print bg-slate-800 text-white px-6 py-3 flex justify-between sticky top-0 z-10">
        <a href="/" className="text-slate-300 hover:text-white">← Back to Portfolio</a>
        <button onClick={() => window.print()} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white">🖨️ Print / Download PDF</button>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto bg-white my-8 p-10 shadow-lg print:shadow-none">
        {/* Header with Avatar */}
        <div className="border-b-2 border-blue-500 pb-4 mb-6">
          <div className="flex gap-6">
            {profile?.avatar_url && (
              <div className="flex-shrink-0">
                <img 
                  src={profile.avatar_url} 
                  alt={profile.name} 
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 print:border-gray-300"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{profile?.name || 'Uddi Benkiff Awinda'}</h1>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mt-1">{profile?.title || 'PM | Civil Projects Engineer | Structural Design Engineer'}</p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-3">
                {profile?.email && <span>📧 {profile.email}</span>}
                {profile?.phone && <span>📞 {profile.phone}</span>}
                {profile?.location && <span>📍 {profile.location}</span>}
                {profile?.linkedin && <span>🔗 {profile.linkedin}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-5">
            {/* Personal Statement */}
            {profile?.bio && (
              <div>
                <h2 className="text-xs font-bold text-blue-600 uppercase border-b pb-1">Personal Statement</h2>
                <p className="text-xs text-gray-700 mt-2 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-blue-600 uppercase border-b pb-1">Professional Experience</h2>
                <div className="space-y-4 mt-3">
                  {experience.map((exp, index) => (
                    <div key={exp.id}>
                      <div className="flex justify-between flex-wrap">
                        <h3 className="text-sm font-bold text-gray-800">{exp.job_title}</h3>
                        <span className="text-xs text-gray-500">{exp.start_date} — {exp.current ? 'Present' : exp.end_date}</span>
                      </div>
                      <p className="text-xs text-blue-600 font-medium">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
                      <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="mt-2 space-y-0.5">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                              <span className="text-blue-500">•</span> {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      {index < experience.length - 1 && <div className="border-b border-gray-200 mt-4"></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-blue-600 uppercase border-b pb-1">Education</h2>
                <div className="space-y-3 mt-3">
                  {education.map((edu, index) => (
                    <div key={edu.id}>
                      <div className="flex justify-between flex-wrap">
                        <h3 className="text-sm font-bold text-gray-800">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                        <span className="text-xs text-gray-500">{edu.start_year} — {edu.end_year || 'Present'}</span>
                      </div>
                      <p className="text-xs text-gray-600">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                      {edu.grade && <p className="text-xs text-yellow-600 mt-0.5">Grade: {edu.grade}</p>}
                      {index < education.length - 1 && <div className="border-b border-gray-200 mt-3"></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="w-48 shrink-0 space-y-5">
            {Object.keys(skillsByCategory).map(cat => (
              <div key={cat}>
                <h2 className="text-xs font-bold text-blue-600 uppercase border-b pb-1">{cat}</h2>
                <ul className="mt-2 space-y-1">
                  {skillsByCategory[cat].map(s => (
                    <li key={s.id} className="text-xs text-gray-700 flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-blue-500"></span> {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {achievements.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-blue-600 uppercase border-b pb-1">Achievements</h2>
                <div className="mt-2 space-y-2">
                  {achievements.map((a, index) => (
                    <div key={a.id}>
                      <p className="text-xs font-semibold text-gray-800">{a.title}</p>
                      <p className="text-xs text-gray-500">{a.issuer}</p>
                      {index < achievements.length - 1 && <div className="border-b border-gray-200 mt-2"></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Projects Section with Thumbnails - at the bottom */}
        {projects.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-bold text-blue-600 uppercase border-b pb-1 mb-3">Key Projects</h2>
            <div className="space-y-3">
              {projects.map((project, index) => (
                <div key={project.id} className="flex gap-3 items-start">
                  {project.image_urls && project.image_urls[0] && (
                    <img 
                      src={project.image_urls[0]} 
                      alt={project.title} 
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-800">{project.title}</p>
                    <p className="text-xs text-gray-600">{project.description}</p>
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.tech_stack.slice(0, 3).map((tech, i) => (
                          <span key={i} className="text-xs text-gray-400">• {tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<ResumePage />);