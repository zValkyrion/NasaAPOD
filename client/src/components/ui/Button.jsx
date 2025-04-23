import React from 'react';
import { motion } from 'framer-motion';
import Spinner from './Spinner'; // Lo crearemos a continuación

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150';

  const variantStyles = {
    primary: `bg-primary hover:bg-primary-dark focus:ring-primary text-onPrimary`,
    secondary: `bg-secondary hover:bg-secondary-dark focus:ring-secondary text-onSecondary border border-transparent`,
    // Añadir más variantes si es necesario (outline, ghost...)
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyle = 'opacity-50 cursor-not-allowed';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${ (disabled || isLoading) ? disabledStyle : ''} ${className}`}
      whileHover={{ scale: (disabled || isLoading) ? 1 : 1.03 }} // Sutil animación de hover
      whileTap={{ scale: (disabled || isLoading) ? 1 : 0.98 }} // Sutil animación al presionar
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          Cargando...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;