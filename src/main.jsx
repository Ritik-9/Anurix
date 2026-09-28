import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MusicProvider } from './context/MusicContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <MusicProvider>
        <App />
    </MusicProvider>
)
