// api/api.ts
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

export const addComment = async (productId: number, comment: Omit<Comment, 'id'>): Promise<Comment> => {
  const product = await fetchProductById(productId);
  const newComment = {
    ...comment,
    id: product.comments.length > 0 ? Math.max(...product.comments.map(c => c.id)) + 1 : 1
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