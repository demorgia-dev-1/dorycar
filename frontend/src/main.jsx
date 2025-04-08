import React from 'react'
import { AuthProvider } from './context/AuthContext'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { ToastContainer } from 'react-toastify'
import App from './App'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)