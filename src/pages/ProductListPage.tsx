import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAllProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import '../styles/ProductList.css';

const ProductListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <div className="product-list-page">
      <div className="container">
        <div className="product-list-header">
          <h1>Our Products</h1>
        </div>
        
        {loading && <div className="loading">Loading products...</div>}
        {error && <div className="error">Error: {error}</div>}
        
        {!loading && !error && (
          <div className="product-grid">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;