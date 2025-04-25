type LoaderProps = {
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

const Loader = ({ size = 'medium', className = '' }: LoaderProps) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-600 ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default Loader;
