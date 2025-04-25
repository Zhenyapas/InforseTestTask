// App.tsx
import { Routes, Route } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage'
import ProductPage from './pages/ProductPage'
import './index.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Shop App</h1>
        </div>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Shop App</p>
        </div>
      </footer>
    </div>
  )
}

export default App