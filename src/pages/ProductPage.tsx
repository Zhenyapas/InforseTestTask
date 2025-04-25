import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProduct } from '../store/productSlice'

const ProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentProduct, loading, error } = useAppSelector(state => state.products)

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(Number(id)))
    }
  }, [dispatch, id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!currentProduct) return <div>Product not found</div>

  return (
    <div className="product-page">
      <button onClick={() => navigate('/')}>Back to Products</button>
      
      <h1>{currentProduct.name}</h1>
      <img src={currentProduct.imageUrl} alt={currentProduct.name} />
      
      <div className="product-details">
        <p>Count: {currentProduct.count}</p>
        <p>Size: {currentProduct.size.width}x{currentProduct.size.height}</p>
        <p>Weight: {currentProduct.weight}</p>
      </div>
      
      <div className="product-actions">
        <button>Edit Product</button>
      </div>
      
      <div className="comments-section">
        <h2>Comments ({currentProduct.comments.length})</h2>
        {currentProduct.comments.length > 0 ? (
          <ul className="comments-list">
            {currentProduct.comments.map(comment => (
              <li key={comment.id} className="comment-item">
                <p>{comment.description}</p>
                <small>{comment.date}</small>
                <button>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
        
      </div>
    </div>
  );
};

export default ProductPage;