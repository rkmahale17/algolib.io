import React from 'react';

interface ResponsiveTableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ResponsiveTableContainer: React.FC<ResponsiveTableContainerProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`w-full overflow-x-auto responsive-table-container my-4  ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};
