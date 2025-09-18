// src/components/ui/table/index.jsx

// Table Component
export const Table = ({ children, className = "" }) => {
  return <table className={`min-w-full ${className}`}>{children}</table>;
};

// TableHeader Component
export const TableHeader = ({ children, className = "" }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
export const TableBody = ({ children, className = "" }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
export const TableRow = ({ children, className = "" }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component
export const TableCell = ({ children, isHeader = false, className = "" }) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={className}>{children}</CellTag>;
};
