import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/*if you want to add/delete the imports for each file, you can find them in App.jsx*/

createRoot(document.getElementById('root')).render(
    <App />
)

