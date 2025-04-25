import React, { useState, useEffect } from 'react';
import { Product } from '../models/Product';
import { useAppDispatch } from '../store/hooks';
import { updateProductThunk } from '../store/productSlice';
import '../styles/EditProductForm.css';

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'comments'>>({
    name: '',
    imageUrl: '',
    count: 0,
    size: { width: 0, height: 0 },
    weight: '',
  });

  useEffect(() => {
    setFormData({
      name: product.name,
      imageUrl: product.imageUrl,
      count: product.count,
      size: { ...product.size },
      weight: product.weight,
    });
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'width' || name === 'height') {
      setFormData({
        ...formData,
        size: {
          ...formData.size,
          [name]: parseInt(value) || 0
        }
      });
    } else if (name === 'count') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProduct: Product = {
      ...product,
      ...formData
    };
    
    dispatch(updateProductThunk(updatedProduct));
    onClose();
  };

  return (
    <form className="edit-product-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="count">Count</label>
        <input
          type="number"
          id="count"
          name="count"
          value={formData.count}
          onChange={handleChange}
          min="0"
          required
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="width">Width</label>
          <input
            type="number"
            id="width"
            name="width"
            value={formData.size.width}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="height">Height</label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.size.height}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="weight">Weight</label>
        <input
          type="text"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="save-button">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;