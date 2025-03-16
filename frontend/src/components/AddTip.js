import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddTip = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image:null
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange=(e)=>{
    setFormData(prevState=>({
        ...prevState,
        image:e.target.files[0]
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title || !formData.content) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('image', formData.image);
  
        await api.post('/api/tips/', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
  
        navigate('/tips');
      } catch (error) {
        console.error('Error adding tip:', error);
        setError('Failed to add farming tip');
      }
    };
  return (
    <div className="form-container">
      <h2>Share Farming Tip</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        
        <button type="submit" className="btn">Share Tip</button>
      </form>
    </div>
  );
};

export default AddTip;