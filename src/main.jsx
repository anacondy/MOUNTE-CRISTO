import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Remove loading indicator once app mounts
const removeLoader = () => {
  const loader = document.getElementById('app-loader')
  if (loader) {
    loader.style.opacity = '0'
    loader.style.transition = 'opacity 0.3s ease-out'
    setTimeout(() => loader.remove(), 300)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Remove loader after initial render
requestAnimationFrame(removeLoader)
