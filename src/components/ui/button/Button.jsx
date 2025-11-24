/* eslint-disable react/prop-types */
import React from "react";

const Button = ({
  children,
  size = "md",
  variant = "primary",
  startText,
  endText,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
 const variantClasses = {
  primary:
    "bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300",
  outline:
    "bg-white text-red-600 ring-1 ring-inset ring-red-400 hover:bg-red-50 dark:bg-gray-900 dark:text-red-300 dark:ring-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-200",
};


  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startText && <span className="flex items-center">{startText}</span>}
      {children}
      {endText && <span className="flex items-center">{endText}</span>}
    </button>
  );
};

export default Button;