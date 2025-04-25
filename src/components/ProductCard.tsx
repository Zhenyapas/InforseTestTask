import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../models/Product';
import '../styles/ProductList.css';
import placeholderImageUrl from '../assets/react.svg?url';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
      <div className="product-card">
        <img src={product.imageUrl ? product.imageUrl : placeholderImageUrl } alt={product.name} />
        <div className="product-card-content">
          <h3>{product.name}</h3>
          <p>Count: {product.count}</p>
          <p>Size: {product.size.width}x{product.size.height}</p>
          <p>Weight: {product.weight}</p>
          <Link to={`/product/${product.id}`} className="product-card-link">
            View Details
          </Link>
        </div>
      </div>
    );
  };
  
  export default ProductCard;