import React from 'react';
import ReactDOM from 'react-dom/client';
import { SafeThemeProvider } from './context/SafeThemeContext.jsx';
import { Provider } from 'react-redux';
import store from './app/store.js';
import App from './App.jsx';
import './global.css';

const rootElement = document.getElementById('root');
if (!window.reactRoot) {
    window.reactRoot = ReactDOM.createRoot(rootElement);
}

window.reactRoot.render(
    <React.StrictMode>
        <Provider store={store}>
            <SafeThemeProvider>
                <App />
            </SafeThemeProvider>
        </Provider>
    </React.StrictMode>
);