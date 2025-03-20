import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="navbar-logo">
          <Link to="/">Food Supply Chain</Link>
        </div>
        <button className="navbar-toggler" onClick={toggleNavbar}>
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
      
      <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <Link to="/products" onClick={() => setIsOpen(false)}>Products</Link>
        <Link to="/tips" onClick={() => setIsOpen(false)}>Farming Tips</Link>
        
        {isAuthenticated ? (
          <>
            {user.role === 'FARMER' && (
              <>
                <Link to="/add-product" onClick={() => setIsOpen(false)}>Add Product</Link>
                <Link to="/my-products" onClick={() => setIsOpen(false)}>My Products</Link>
                <Link to="/add-tip" onClick={() => setIsOpen(false)}>Add Tip</Link>
              </>
            )}
            <Link to="/orders" onClick={() => setIsOpen(false)}>Orders</Link>
            <span className="user-info">Welcome, {user.username} ({user.role})</span>
            <button className="logout-btn" onClick={() => {handleLogout(); setIsOpen(false);}}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;