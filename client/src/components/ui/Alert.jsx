import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa'; // Necesitas instalar react-icons: npm install react-icons

const alertStyles = {
  success: {
    bg: 'bg-green-100',
    border: 'border-green-400',
    text: 'text-green-700',
    icon: <FaCheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />,
  },
  error: {
    bg: 'bg-red-100',
    border: 'border-red-400',
    text: 'text-red-700',
    icon: <FaExclamationTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />,
  },
  warning: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-400',
    text: 'text-yellow-700',
    icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />,
  },
  info: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-700',
    icon: <FaInfoCircle className="h-5 w-5 text-blue-500" aria-hidden="true" />,
  },
};

const Alert = ({ type = 'info', message, title, onClose, className = '' }) => {
  const styles = alertStyles[type] || alertStyles.info;

  if (!message) return null;

  return (
    <div className={`border-l-4 p-4 my-4 rounded-md ${styles.bg} ${styles.border} ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="ml-3">
          {title && <h3 className={`text-sm font-medium ${styles.text}`}>{title}</h3>}
          <div className={`mt-1 text-sm ${styles.text}`}>
            <p>{message}</p>
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${styles.text} hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                aria-label="Cerrar notificación"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;