import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'

// Add Bootstrap Icons CDN
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
document.head.appendChild(link);

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <App/>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
