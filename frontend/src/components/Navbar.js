import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Food Supply Chain</Link>
      </div>
      <div className="navbar-links">
        <Link to="/products">Products</Link>
        <Link to="/tips">Farming Tips</Link>
        
        {isAuthenticated ? (
          <>
            {user.role === 'FARMER' && (
              <>
                <Link to="/add-product">Add Product</Link>
                <Link to="/my-products">My Products</Link>
                <Link to="/add-tip">Add Tip</Link>
              </>
            )}
            <Link to="/orders">Orders</Link>
            <span className="user-info">Welcome, {user.username} ({user.role})</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
