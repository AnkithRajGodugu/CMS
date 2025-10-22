/**
 * Error logging utility for tracking and monitoring errors
 * Logs to console in development and can be extended to send to monitoring services in production
 */

const isDevelopment = import.meta.env.MODE === 'development';

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Log error with context
 */
export const logError = (error, context = {}, severity = ErrorSeverity.MEDIUM) => {
  const errorLog = {
    message: error.message || 'Unknown error',
    name: error.name,
    stack: error.stack,
    severity,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...context
  };
  
  if (isDevelopment) {
    // Detailed logging in development
    console.group(`🔴 Error [${severity.toUpperCase()}]`);
    console.error('Message:', errorLog.message);
    console.error('Context:', context);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    console.groupEnd();
  } else {
    // Minimal logging in production
    console.error('Error:', {
      message: errorLog.message,
      severity: errorLog.severity,
      timestamp: errorLog.timestamp,
      url: errorLog.url
    });
    
    // TODO: Send to monitoring service (e.g., Sentry, LogRocket, DataDog)
    // Example: Sentry.captureException(error, { extra: context, level: severity });
  }
  
  return errorLog;
};

/**
 * Log API error
 */
export const logApiError = (error, endpoint, method = 'GET') => {
  const context = {
    type: 'API_ERROR',
    endpoint,
    method,
    status: error.response?.status,
    statusText: error.response?.statusText,
    responseData: error.response?.data
  };
  
  const severity = error.response?.status >= 500 
    ? ErrorSeverity.HIGH 
    : ErrorSeverity.MEDIUM;
  
  return logError(error, context, severity);
};

/**
 * Log authentication error
 */
export const logAuthError = (error, action) => {
  const context = {
    type: 'AUTH_ERROR',
    action,
    status: error.response?.status
  };
  
  return logError(error, context, ErrorSeverity.HIGH);
};

/**
 * Log component error (from Error Boundary)
 */
export const logComponentError = (error, errorInfo, componentName) => {
  const context = {
    type: 'COMPONENT_ERROR',
    componentName,
    componentStack: errorInfo?.componentStack
  };
  
  return logError(error, context, ErrorSeverity.HIGH);
};

/**
 * Log sector-related error
 */
export const logSectorError = (error, sectorCode, action) => {
  const context = {
    type: 'SECTOR_ERROR',
    sectorCode,
    action
  };
  
  return logError(error, context, ErrorSeverity.MEDIUM);
};

/**
 * Log validation error
 */
export const logValidationError = (errors, formName) => {
  const context = {
    type: 'VALIDATION_ERROR',
    formName,
    errors
  };
  
  const error = new Error('Form validation failed');
  return logError(error, context, ErrorSeverity.LOW);
};

/**
 * Log network error
 */
export const logNetworkError = (error) => {
  const context = {
    type: 'NETWORK_ERROR',
    online: navigator.onLine
  };
  
  return logError(error, context, ErrorSeverity.HIGH);
};

/**
 * Log warning (non-error issues)
 */
export const logWarning = (message, context = {}) => {
  const warningLog = {
    message,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    ...context
  };
  
  if (isDevelopment) {
    console.warn('⚠️ Warning:', message, context);
  } else {
    console.warn('Warning:', { message, timestamp: warningLog.timestamp });
  }
  
  return warningLog;
};

/**
 * Log info message
 */
export const logInfo = (message, context = {}) => {
  if (isDevelopment) {
    console.info('ℹ️ Info:', message, context);
  }
};
