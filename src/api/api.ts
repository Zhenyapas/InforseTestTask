import axios from 'axios';
import { Product, Comment } from '../models/Product';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (product: Product): Promise<Product> => {
  const response = await api.put(`/products/${product.id}`, product);
  return response.data;
};



const formatDate = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    return `${hours}:${minutes} ${day}.${month}.${year}`;
  };

  export const addComment = async (productId: number, description: string): Promise<Comment> => {
    const product = await fetchProductById(productId);
    
    const newComment: Comment = {
      id: product.comments.length > 0 
        ? Math.max(...product.comments.map(c => c.id)) + 1 
        : 1,
      productId,
      description,
      date: formatDate()
    };
    
    product.comments.push(newComment);
    
    await updateProduct(product);
    
    return newComment;
  };


export const deleteComment = async (productId: number, commentId: number): Promise<void> => {
  const product = await fetchProductById(productId);
  product.comments = product.comments.filter(comment => comment.id !== commentId);
  await updateProduct(product);
};