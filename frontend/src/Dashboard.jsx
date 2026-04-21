import React from 'react';

function Dashboard({ onNavigate }) {
  const quickActions = [
    { name: 'Add Experience', icon: 'fas fa-briefcase', path: 'experience' },
    { name: 'Add Skill', icon: 'fas fa-code', path: 'skills' },
    { name: 'Add Achievement', icon: 'fas fa-trophy', path: 'achievements' },
    { name: 'Add Project', icon: 'fas fa-folder-open', path: 'projects' },
    { name: 'Add Education', icon: 'fas fa-graduation-cap', path: 'education' },
    { name: 'View / Print Resume', icon: 'fas fa-print', path: 'resume' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Portfolio Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your professional portfolio — changes automatically update your resume.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action) => (
          <button
            key={action.name}
            onClick={() => {
              if (action.path === 'resume') {
                window.open('/resume.html', '_blank');
              } else {
                onNavigate(action.path);
              }
            }}
            className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-gray-700">{action.name}</span>
            <i className={`${action.icon} text-blue-600 text-xl`}></i>
          </button>
        ))}
      </div>

      {/* Profile Section Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">PROFILE</h2>
          <button onClick={() => onNavigate('profile')} className="text-blue-600 text-sm">Edit →</button>
        </div>
        <div className="text-gray-500 italic">—</div>
      </div>
    </div>
  );
}

export default Dashboard;