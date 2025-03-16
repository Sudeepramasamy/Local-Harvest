import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await api.get('/api/products/');
      // Filter products to only show the current farmer's products
      const myProducts = response.data.filter(product => 
        product.farmer_name === localStorage.getItem('username')
      );
      setProducts(myProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id, newStock) => {
    try {
      await api.patch(`/api/products/${id}/`, { stock: newStock });
      
      // Update the local state
      setProducts(products.map(product => 
        product.id === id ? { ...product, stock: newStock } : product
      ));
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-products">
      <h2>My Products</h2>
      
      {products.length === 0 ? (
        <div>You haven't added any products yet.</div>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={product.stock}
                      onChange={(e) => handleUpdateStock(product.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-small"
                      onClick={() => handleUpdateStock(product.id, parseInt(product.stock) + 10)}
                    >
                      +10 Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyProducts;