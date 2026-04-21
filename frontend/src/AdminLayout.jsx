import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import ProfileForm from './ProfileForm';
import ExperienceManager from './ExperienceManager';
import EducationManager from './EducationManager';
import SkillsManager from './SkillsManager';
import ProjectsManager from './ProjectsManager';
import AchievementsManager from './AchievementsManager';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function AdminLayout() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [profile, setProfile] = useState({});
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [profileRes, expRes, eduRes, skillsRes, projectsRes, achievementsRes] = await Promise.all([
        axios.get(`${API_URL}/profile`),
        axios.get(`${API_URL}/experience`),
        axios.get(`${API_URL}/education`),
        axios.get(`${API_URL}/skills`),
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/achievements`)
      ]);
      setProfile(profileRes.data || {});
      setExperience(expRes.data);
      setEducation(eduRes.data);
      setSkills(skillsRes.data);
      setProjects(projectsRes.data);
      setAchievements(achievementsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const refreshData = () => {
    fetchAllData();
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'profile', name: 'Profile', icon: 'fas fa-user' },
    { id: 'experience', name: 'Experience', icon: 'fas fa-briefcase' },
    { id: 'education', name: 'Education', icon: 'fas fa-graduation-cap' },
    { id: 'skills', name: 'Skills', icon: 'fas fa-code' },
    { id: 'projects', name: 'Projects', icon: 'fas fa-folder-open' },
    { id: 'achievements', name: 'Achievements', icon: 'fas fa-trophy' }
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfileForm profile={profile} onRefresh={refreshData} />;
      case 'experience':
        return <ExperienceManager experience={experience} onRefresh={refreshData} />;
      case 'education':
        return <EducationManager education={education} onRefresh={refreshData} />;
      case 'skills':
        return <SkillsManager skills={skills} onRefresh={refreshData} />;
      case 'projects':
        return <ProjectsManager projects={projects} onRefresh={refreshData} />;
      case 'achievements':
        return <AchievementsManager achievements={achievements} onRefresh={refreshData} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex">
      {/* Sidebar - Dark theme like Replit */}
      <div className="w-64 bg-slate-900 shadow-md">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white">Portfolio</h1>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg mb-1 transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`${item.icon} w-5 mr-3`}></i>
              {item.name}
            </button>
          ))}
        </nav>
        
        {/* Footer Links */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-800">
          <button
            onClick={() => window.open('/resume.html', '_blank')}
            className="block w-full text-left text-slate-400 hover:text-white py-2 text-sm"
          >
            <i className="fas fa-eye w-5 mr-3"></i> View Resume
          </button>
          <button
            onClick={() => window.open('/', '_blank')}
            className="block w-full text-left text-slate-400 hover:text-white py-2 text-sm"
          >
            <i className="fas fa-globe w-5 mr-3"></i> Public Portfolio
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminLayout;