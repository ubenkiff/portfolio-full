import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function SkillsManager({ skills, onRefresh }) {
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem.id) {
        await axios.put(`${API_URL}/skills/${editingItem.id}`, formData);
      } else {
        await axios.post(`${API_URL}/skills`, formData);
      }
      setEditingItem(null);
      setFormData({});
      onRefresh();
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving skill');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/skills/${id}`);
      onRefresh();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Skills</h1>
        <button onClick={() => { setEditingItem({}); setFormData({}); }} className="bg-green-600 text-white px-4 py-2 rounded">+ Add Skill</button>
      </div>

      {editingItem !== null && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingItem.id ? 'Edit' : 'Add'} Skill</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Skill Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" required />
            <input type="text" placeholder="Category (e.g., Structural Design, CAD/BIM)" value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded" required />
            <select value={formData.level || ''} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full p-2 border rounded">
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => { setEditingItem(null); setFormData({}); }} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      {categories.map(category => (
        <div key={category} className="mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">{category}</h2>
          <div className="space-y-2">
            {skills.filter(s => s.category === category).map((skill) => (
              <div key={skill.id} className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
                <div>
                  <span className="font-medium">{skill.name}</span>
                  {skill.level && <span className="text-sm text-gray-500 ml-2">({skill.level})</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingItem(skill); setFormData(skill); }} className="text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(skill.id)} className="text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkillsManager;