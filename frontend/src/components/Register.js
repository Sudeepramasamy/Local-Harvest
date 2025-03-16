import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'CONSUMER'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    const success = await register(formData);
    
    if (success) {
      navigate('/login');
    } else {
      setError('Registration failed. Username may already be taken.');
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            name="username"
            value={formData.username} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password"
            value={formData.password} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="CONSUMER">Consumer</option>
            <option value="FARMER">Farmer</option>
          </select>
        </div>
        <button type="submit" className="btn">Register</button>
      </form>
    </div>
  );
};

export default Register;
