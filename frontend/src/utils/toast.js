/**
 * Toast notification utility for displaying user-friendly messages
 * This is a simple implementation that can be replaced with a library like react-toastify
 */

let toastContainer = null;

/**
 * Initialize toast container
 */
const initToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

/**
 * Create and show a toast notification
 */
const showToast = (message, type = 'info', duration = 5000) => {
  const container = initToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Style based on type
  const colors = {
    success: { bg: '#10b981', border: '#059669' },
    error: { bg: '#ef4444', border: '#dc2626' },
    warning: { bg: '#f59e0b', border: '#d97706' },
    info: { bg: '#3b82f6', border: '#2563eb' }
  };
  
  const color = colors[type] || colors.info;
  
  toast.style.cssText = `
    background-color: ${color.bg};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    border-left: 4px solid ${color.border};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    animation: slideIn 0.3s ease-out;
    min-width: 300px;
    max-width: 400px;
    word-wrap: break-word;
  `;
  
  // Add animation keyframes if not already added
  if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Message content
  const messageSpan = document.createElement('span');
  messageSpan.textContent = message;
  messageSpan.style.flex = '1';
  
  // Close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    transition: opacity 0.2s;
  `;
  closeButton.onmouseover = () => closeButton.style.opacity = '1';
  closeButton.onmouseout = () => closeButton.style.opacity = '0.8';
  closeButton.onclick = () => removeToast(toast);
  
  toast.appendChild(messageSpan);
  toast.appendChild(closeButton);
  container.appendChild(toast);
  
  // Auto remove after duration
  if (duration > 0) {
    setTimeout(() => removeToast(toast), duration);
  }
  
  return toast;
};

/**
 * Remove toast with animation
 */
const removeToast = (toast) => {
  toast.style.animation = 'slideOut 0.3s ease-in';
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
};

/**
 * Show success toast
 */
export const showSuccessToast = (message, duration = 5000) => {
  return showToast(message, 'success', duration);
};

/**
 * Show error toast
 */
export const showErrorToast = (message, duration = 7000) => {
  return showToast(message, 'error', duration);
};

/**
 * Show warning toast
 */
export const showWarningToast = (message, duration = 6000) => {
  return showToast(message, 'warning', duration);
};

/**
 * Show info toast
 */
export const showInfoToast = (message, duration = 5000) => {
  return showToast(message, 'info', duration);
};

/**
 * Clear all toasts
 */
export const clearAllToasts = () => {
  if (toastContainer) {
    toastContainer.innerHTML = '';
  }
};
