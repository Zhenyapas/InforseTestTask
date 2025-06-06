import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProduct, addCommentThunk, deleteCommentThunk } from '../store/productSlice'
import Modal from '../components/Modal'
import EditProductForm from '../components/EditProductForm'
import '../styles/ProductPage.css'

const ProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentProduct, loading, error } = useAppSelector(state => state.products)
  const [commentText, setCommentText] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(Number(id)))
    }
  }, [dispatch, id])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentText.trim() || !currentProduct) return
    
    setIsSubmitting(true)
    
    try {
      await dispatch(addCommentThunk({ 
        productId: currentProduct.id, 
        description: commentText.trim() 
      })).unwrap()
      
      // Очищаємо поле вводу після успішного додавання
      setCommentText('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!currentProduct) return
    
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteCommentThunk({
          productId: currentProduct.id,
          commentId
        })).unwrap()
      } catch (error) {
        console.error('Failed to delete comment:', error)
      }
    }
  }

  if (loading) return <div className="container loading">Loading...</div>
  if (error) return <div className="container error">Error: {error}</div>
  if (!currentProduct) return <div className="container">Product not found</div>

  return (
    <div className="product-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Products
        </button>
        
        <div className="product-container">
          <div className="product-image">
            <img 
              src={currentProduct.imageUrl || "https://placehold.co/400x400?text=No+Image"} 
              alt={currentProduct.name} 
            />
          </div>
          
          <div className="product-info">
            <h1>{currentProduct.name}</h1>
            
            <div className="product-details">
              <div className="detail-item">
                <span className="detail-label">Count:</span>
                <span>{currentProduct.count}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Size:</span>
                <span>{currentProduct.size.width}x{currentProduct.size.height}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Weight:</span>
                <span>{currentProduct.weight}</span>
              </div>
            </div>
            
            <div className="product-actions">
              <button 
                className="edit-button" 
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
        
        <div className="comments-section">
          <div className="comments-header">
            <h2>Comments ({currentProduct.comments.length})</h2>
          </div>
          
          {currentProduct.comments.length > 0 ? (
            <ul className="comments-list">
              {currentProduct.comments.map(comment => (
                <li key={comment.id} className="comment-item">
                  <p className="comment-content">{comment.description}</p>
                  <div className="comment-meta">
                    <span>{comment.date}</span>
                    <button 
                      className="delete-comment" 
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}
          
          <div className="add-comment-form">
            <h3>Add a comment</h3>
            <form onSubmit={handleCommentSubmit}>
              <div className="form-group">
                <label htmlFor="comment">Your comment</label>
                <textarea 
                  id="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your comment here..."
                  required
                />
              </div>
              <button 
                type="submit" 
                className="submit-comment"
                disabled={isSubmitting || commentText.trim() === ''}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Comment'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {currentProduct && (
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Product"
        >
          <EditProductForm 
            product={currentProduct} 
            onClose={() => setIsEditModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

export default ProductPage;