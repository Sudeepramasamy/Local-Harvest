import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'CONSUMER') {
      setError('Only consumers can purchase products');
      return;
    }
    
    try {
      const orderResponse = await api.post('/api/orders/', {
        product: product.id,
        quantity
      });
      
      // Process payment
      await api.post(`/api/payment/${orderResponse.data.id}/`);
      
      navigate('/orders');
    } catch (error) {
      console.error('Error making purchase:', error);
      setError('Failed to complete purchase');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <div className="product-info">
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Stock Available:</strong> {product.stock}</p>
        <p><strong>Seller:</strong> {product.farmer_name}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Farming Method:</strong> {product.farming_method}</p>
      </div>
      
      {isAuthenticated && user.role === 'CONSUMER' && product.stock > 0 && (
        <div className="purchase-section">
          <div className="quantity-control">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
          <p className="total-price">Total: ${(quantity * product.price).toFixed(2)}</p>
          <button className="btn" onClick={handlePurchase}>Buy Now</button>
        </div>
      )}
      
      {product.stock === 0 && (
        <div className="out-of-stock">Product is out of stock</div>
      )}
      
      <button className="btn back-btn" onClick={() => navigate('/products')}>Back to Products</button>
    </div>
  );
};

export default ProductDetail;
