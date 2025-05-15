import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    unit:'',
    farming_method: '',
    image:null,
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if(name==='image'){
      setFormData(prevState=>({
        ...prevState,
        image:e.target.files[0]
      }));
    } else{
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.unit || !formData.image) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('User not authenticated');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('farming_method', formData.farming_method);
      formDataToSend.append('image', formData.image); // Append image file

      await api.post('/api/products/', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
      });

      navigate('/my-products');
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Product</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>Price ($)</label>
          <input
             type="number"
             name="price"
             step="0.01"
             min="0"
             value={formData.price}
             onChange={handleChange}
           />
         </div>
         
         <div className="form-group">
           <label>Stock Available</label>
           <input
             type="number"
             name="stock"
             min="0"
             value={formData.stock}
             onChange={handleChange}
           />
         </div>

         <div className="form-group">
  <label>Unit</label>
  <select name="unit" value={formData.unit} onChange={handleChange}>
    <option value="">-- Select Unit --</option>
    <option value="kg">Kilograms (kg)</option>
    <option value="g">Grams (g)</option>
    <option value="l">Liters (l)</option>
    <option value="ml">Milliliters (ml)</option>
    <option value="pcs">Pieces (pcs)</option>
    <option value="dozen">Dozen</option>
    <option value="dozen">Bunch</option>
    <option value="dozen">Bottle</option>
  </select>
</div>

         
         <div className="form-group">
           <label>Farming Method  (optional) </label>
           <textarea
             name="farming_method"
             value={formData.farming_method}
             onChange={handleChange}
             rows="3"
           ></textarea>
         </div>

         <div className="form-group">
          <label>Product Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </div>
         
         <button type="submit" className="btn">Add Product</button>
       </form>
     </div>
   );
 };
 
 export default AddProduct;