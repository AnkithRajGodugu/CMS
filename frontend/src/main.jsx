import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './global.css';

const rootElement = document.getElementById('root');
if (!window.reactRoot) {
    window.reactRoot = ReactDOM.createRoot(rootElement);
}

window.reactRoot.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);