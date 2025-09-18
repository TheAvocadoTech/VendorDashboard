import React from "react";
import { Link } from "react-router";

const Alert = ({
  variant,
  title,
  message,
  showLink = false,
  linkHref = "#",
  linkText = "Learn more",
}) => {
  // Tailwind classes for each variant
  const variantClasses = {
    success: {
      container:
        "border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15",
      indicator: "text-success-500",
    },
    error: {
      container:
        "border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15",
      indicator: "text-error-500",
    },
    warning: {
      container:
        "border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15",
      indicator: "text-warning-500",
    },
    info: {
      container:
        "border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15",
      indicator: "text-blue-light-500",
    },
  };

  // Text indicators for each variant
  const indicators = {
    success: "✓",
    error: "!",
    warning: "⚠",
    info: "i",
  };

  return (
    <div className={`rounded-xl border p-4 ${variantClasses[variant].container}`}>
      <div className="flex items-start gap-3">
        <div className={`-mt-0.5 flex items-center justify-center w-6 h-6 rounded-full text-lg font-bold ${variantClasses[variant].indicator}`}>
          {indicators[variant]}
        </div>

        <div>
          <h4 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>

          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>

          {showLink && (
            <Link
              to={linkHref}
              className="inline-block mt-3 text-sm font-medium text-gray-500 underline dark:text-gray-400"
            >
              {linkText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;