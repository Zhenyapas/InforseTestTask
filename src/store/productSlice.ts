import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../models/Product';
import { fetchProducts, fetchProductById, updateProduct, addComment, deleteComment } from '../api/api';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
};

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    return await fetchProducts();
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchOne',
  async (id: number) => {
    return await fetchProductById(id);
  }
);

export const updateProductThunk = createAsyncThunk(
  'products/update',
  async (product: Product) => {
    return await updateProduct(product);
  }
);

export const addCommentThunk = createAsyncThunk(
    'products/addComment',
    async ({ productId, description }: { productId: number; description: string }) => {
      return await addComment(productId, description);
    }
  );
  
  export const deleteCommentThunk = createAsyncThunk(
    'products/deleteComment',
    async ({ productId, commentId }: { productId: number; commentId: number }) => {
      await deleteComment(productId, commentId);
      return { productId, commentId };
    }
  );

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
 
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })

      .addCase(updateProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update product';
      })
      .addCase(addCommentThunk.fulfilled, (state, action) => {
        const newComment = action.payload;
        
        if (state.currentProduct && state.currentProduct.id === newComment.productId) {
          state.currentProduct.comments.push(newComment);
        }
        
        const productIndex = state.products.findIndex(p => p.id === newComment.productId);
        if (productIndex !== -1) {
          state.products[productIndex].comments.push(newComment);
        }
      })
      .addCase(deleteCommentThunk.fulfilled, (state, action) => {
        const { productId, commentId } = action.payload;
    
        if (state.currentProduct && state.currentProduct.id === productId) {
          state.currentProduct.comments = state.currentProduct.comments.filter(
            comment => comment.id !== commentId
          );
        }
        const productIndex = state.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
          state.products[productIndex].comments = state.products[productIndex].comments.filter(
            comment => comment.id !== commentId
          );
        }
      })
  },
});

export default productSlice.reducer;