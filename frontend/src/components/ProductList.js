import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user,setUser]=useState(null);

  useEffect(() => {
    fetchProducts();
    fetchUser();
  }, []);

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

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('access_token'); 
      if (!token) {
        console.error('No token found. User might not be authenticated.');
        return;
      }
  
      const response = await api.get('/api/products/', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      await api.delete(`/api/products/${productId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted product from state
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error.response ? error.response.data : error);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-list">
      <h1>Eat Fresh, Live Healthy!</h1>
      <p>
      Our products are grown naturally by local farmers, without harmful chemicals or pesticides.
      Every bite supports sustainable farming and boosts your well-being.
      Choose organic, support local, and taste the difference!
      </p>
      <h2>Available Products</h2>
      {products.length === 0 ? (
        <div>No products available.</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="product-image"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <h3>{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <p className="product-stock">Stock: {product.stock}</p>
              <p className="product-farmer">By: {product.farmer_name}</p>
              <Link to={`/products/${product.id}`} className="btn">View Details</Link>
              {user && user.username === product.farmer_name && (
                <button onClick={() => handleDelete(product.id)} className="btn-delete">
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;