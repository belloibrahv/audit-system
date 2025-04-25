import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  title?: string;
  className?: string;
};

const Card = ({ children, title, className = '' }: CardProps) => {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      {title && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
};

export default Card;
