import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// این دو تا خط زیر خیلی مهم هستن
import { Provider } from 'react-redux'
import { store } from './app/store'
import 'leaflet/dist/leaflet.css';
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* کل اپلیکیشن رو اینجا در پوشش ریداکس قرار می‌دیم */}
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
)