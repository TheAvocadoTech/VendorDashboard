const React = require("react");

// Table Component
const Table = ({ children, className = "" }) => {
  return React.createElement("table", { className: `min-w-full ${className}` }, children);
};

// TableHeader Component
const TableHeader = ({ children, className = "" }) => {
  return React.createElement("thead", { className }, children);
};

// TableBody Component
const TableBody = ({ children, className = "" }) => {
  return React.createElement("tbody", { className }, children);
};

// TableRow Component
const TableRow = ({ children, className = "" }) => {
  return React.createElement("tr", { className }, children);
};

// TableCell Component
const TableCell = ({ children, isHeader = false, className = "" }) => {
  const CellTag = isHeader ? "th" : "td";
  return React.createElement(CellTag, { className }, children);
};

module.exports = { Table, TableHeader, TableBody, TableRow, TableCell };
