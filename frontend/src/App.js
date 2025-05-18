import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import AddProduct from './components/AddProduct';
import MyProducts from './components/MyProducts';
import FarmingTips from './components/FarmingTips';
import AddTip from './components/AddTip';
import Orders from './components/Orders';
import ChooseUs from './components/ChooseUs';
import './App.css';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/products" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/choose" element={<ChooseUs />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route 
                path="/add-product" 
                element={
                  <PrivateRoute allowedRoles={['FARMER']}>
                    <AddProduct />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-products" 
                element={
                  <PrivateRoute allowedRoles={['FARMER']}>
                    <MyProducts />
                  </PrivateRoute>
                } 
              />
              <Route path="/tips" element={<FarmingTips />} />
              <Route 
                path="/add-tip" 
                element={
                  <PrivateRoute allowedRoles={['FARMER']}>
                    <AddTip />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/products" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;