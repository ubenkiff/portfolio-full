import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function AchievementsManager({ achievements, onRefresh }) {
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem.id) {
        await axios.put(`${API_URL}/achievements/${editingItem.id}`, formData);
      } else {
        await axios.post(`${API_URL}/achievements`, formData);
      }
      setEditingItem(null);
      setFormData({});
      onRefresh();
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving achievement');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/achievements/${id}`);
      onRefresh();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Achievements</h1>
        <button onClick={() => { setEditingItem({}); setFormData({}); }} className="bg-green-600 text-white px-4 py-2 rounded">+ Add Achievement</button>
      </div>

      {editingItem !== null && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingItem.id ? 'Edit' : 'Add'} Achievement</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Title" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded" required />
            <input type="text" placeholder="Issuer" value={formData.issuer || ''} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} className="w-full p-2 border rounded" />
            <input type="text" placeholder="Date" value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full p-2 border rounded" />
            <textarea placeholder="Description" rows="2" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded" />
            <select value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded">
              <option value="">Select Category</option>
              <option value="Award">Award</option>
              <option value="Certification">Certification</option>
              <option value="Publication">Publication</option>
              <option value="Speaking">Speaking</option>
              <option value="Other">Other</option>
            </select>
            <input type="text" placeholder="URL (optional)" value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => { setEditingItem(null); setFormData({}); }} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {achievements.map((ach) => (
          <div key={ach.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{ach.title}</h3>
              <p className="text-gray-600">{ach.issuer} | {ach.date}</p>
              <p className="text-gray-700 text-sm mt-1">{ach.description}</p>
              {ach.category && <span className="inline-block px-2 py-0.5 bg-gray-200 rounded text-xs mt-2">{ach.category}</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingItem(ach); setFormData(ach); }} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(ach.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AchievementsManager;