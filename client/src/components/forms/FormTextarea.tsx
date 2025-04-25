import { ChangeEvent } from 'react';

type FormTextareaProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  error?: string;
};

const FormTextarea = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  rows = 4,
  error,
}: FormTextareaProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={`mt-1 block w-full input ${
          error ? 'border-red-300 focus:ring-red-500' : ''
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormTextarea;
