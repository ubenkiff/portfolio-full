import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-white font-bold">{profile?.name || 'Portfolio'}</h1>
          <div className="flex gap-3">
            <button onClick={() => window.open('/resume.html', '_blank')} className="bg-slate-700 text-white px-4 py-2 rounded">Resume</button>
            <button onClick={() => window.open('/admin.html', '_blank')} className="bg-blue-600 text-white px-4 py-2 rounded">Admin</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-slate-800 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {profile?.avatar_url && <img src={profile.avatar_url} className="w-32 h-32 rounded-full object-cover" />}
            <div>
              <h1 className="text-3xl font-bold text-white">{profile?.name}</h1>
              <p className="text-blue-400 text-lg mt-1">{profile?.title}</p>
              <p className="text-slate-300 mt-3">{profile?.bio}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-slate-400">
                {profile?.email && <span>📧 {profile.email}</span>}
                {profile?.phone && <span>📞 {profile.phone}</span>}
                {profile?.location && <span>📍 {profile.location}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Make sure React is available globally
const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App));