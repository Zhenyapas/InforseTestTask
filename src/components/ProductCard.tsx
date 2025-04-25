import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../models/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Count: {product.count}</p>
      <p>Size: {product.size.width}x{product.size.height}</p>
      <p>Weight: {product.weight}</p>
      <Link to={`/product/${product.id}`}>View Details</Link>
    </div>
  );
};

export default ProductCard;