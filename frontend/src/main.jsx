import React from 'react';
import ReactDOM from 'react-dom/client';
import { SafeThemeProvider } from './context/SafeThemeContext.jsx';
import { Provider } from 'react-redux';
import store from './app/store.js';
import App from './App.jsx';
import './global.css';

console.log('Starting CMS Platform...');

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <SafeThemeProvider>
                <App />
            </SafeThemeProvider>
        </Provider>
    </React.StrictMode>
);