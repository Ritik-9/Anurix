import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MusicProvider } from './context/MusicContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <SocketProvider>
        <MusicProvider>
            <App />
        </MusicProvider>
    </SocketProvider>
)
