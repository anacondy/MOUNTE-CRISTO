import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Remove loading indicator with smooth fade out
const removeLoader = () => {
  const loader = document.getElementById('app-loader')
  if (loader) {
    loader.style.opacity = '0'
    loader.style.transition = 'opacity 0.3s ease-out'
    setTimeout(() => loader.remove(), 300)
  }
}

// Wrapper component to handle loader removal after mount
const AppWithLoader = () => {
  useEffect(() => {
    // Double requestAnimationFrame pattern:
    // - First RAF: Wait for next animation frame (React has committed DOM changes)
    // - Second RAF: Wait one more frame to ensure browser has painted the content
    // This guarantees the loader is removed only after React content is visible
    requestAnimationFrame(() => {
      requestAnimationFrame(removeLoader)
    })
  }, [])

  return <App />
}

// Safely create root with error handling
const rootElement = document.getElementById('root')

if (!rootElement) {
  // Remove loader and show error if root element is missing
  const loader = document.getElementById('app-loader')
  if (loader) loader.remove()
  
  document.body.innerHTML = `
    <div style="color: #eaddcf; background: #1a120b; padding: 40px; text-align: center; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: serif;">
      <h1 style="color: #d44d38; margin-bottom: 20px;">Error</h1>
      <p>Root element not found. Please refresh the page.</p>
    </div>
  `
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <AppWithLoader />
      </React.StrictMode>,
    )
  } catch (error) {
    // Handle render errors
    const loader = document.getElementById('app-loader')
    if (loader) loader.remove()
    
    // Create error container with safe text content (avoid XSS)
    const errorContainer = document.createElement('div')
    errorContainer.style.cssText = 'color: #eaddcf; background: #1a120b; padding: 40px; text-align: center; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: serif;'
    
    const heading = document.createElement('h1')
    heading.style.cssText = 'color: #d44d38; margin-bottom: 20px;'
    heading.textContent = 'Application Error'
    
    const message = document.createElement('p')
    message.textContent = 'Something went wrong while loading the application.'
    
    const errorDetails = document.createElement('p')
    errorDetails.style.cssText = 'font-size: 12px; color: #8c7b70; margin-top: 20px;'
    errorDetails.textContent = 'Error: ' + error.message
    
    errorContainer.appendChild(heading)
    errorContainer.appendChild(message)
    errorContainer.appendChild(errorDetails)
    
    document.body.innerHTML = ''
    document.body.appendChild(errorContainer)
  }
}
