import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders/');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="orders">
      <h2>{user.role === 'CONSUMER' ? 'My Orders' : 'Customer Orders'}</h2>
      
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                {user.role === 'FARMER' && <th>Customer</th>}
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  {user.role === 'FARMER' && <td>{order.consumer_name}</td>}
                  <td>{order.product_name}</td>
                  <td>{order.quantity}</td>
                  <td>${order.total_price}</td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td className={`status status-${order.payment_status.toLowerCase()}`}>
                    {order.payment_status}
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

export default Orders;