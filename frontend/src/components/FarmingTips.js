import React, { useState, useEffect } from 'react';
import api from '../services/api';

const FarmingTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchTips();
    fetchUser();
  }, []);

  const fetchTips = async () => {
    try {
      const response = await api.get('/api/tips/');
      setTips(response.data);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the current user (same approach as ProductList)
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await api.get('/api/user/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error.response ? error.response.data : error);
    }
  };

  const handleDelete = async (tipId) => {
    if (!window.confirm('Are you sure you want to delete this tip?')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      await api.delete(`/api/tips/${tipId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTips(tips.filter(tip => tip.id !== tipId)); // Remove from UI
    } catch (error) {
      console.error('Error deleting tip:', error.response ? error.response.data : error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="farming-tips">
      <h2>Farming Tips & Methods</h2>
      
      {tips.length === 0 ? (
        <div>No farming tips available yet.</div>
      ) : (
        <div className="tips-list">
          {tips.map(tip => (
            <div key={tip.id} className="tip-card">
              <h3>{tip.title}</h3>
              {tip.image && <img src={tip.image} alt={tip.title} className="tip-image" 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}/>}
              <p className="tip-content">{tip.content}</p>
              <p className="tip-author">By: {tip.farmer_name}</p>
              <p className="tip-date">Posted on: {new Date(tip.created_at).toLocaleDateString()}</p>

              {/* Show delete button only if the logged-in user is the owner */}
              {user && user.username === tip.farmer_name && (
                <button className="delete-btn" onClick={() => handleDelete(tip.id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmingTips;