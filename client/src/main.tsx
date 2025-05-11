import { AuthContextProvider } from './contexts/auth/index.tsx'
import { createRoot } from 'react-dom/client'
// import { StrictMode } from 'react'
import './index.css'

import { Routes } from './routes/index.tsx'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL ?? '/api_server'
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <AuthContextProvider>
      <Routes />
    </AuthContextProvider>
  // </StrictMode>,
)
