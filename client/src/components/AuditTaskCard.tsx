import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface AuditTaskCardProps {
  title: string;
  location: string;
  dueDate: string;
  status: 'in_progress' | 'not_started' | 'completed';
  progress: number;
  onStartAudit: () => void;
}

export const AuditTaskCard = ({
  title,
  location,
  dueDate,
  status,
  progress,
  onStartAudit,
}: AuditTaskCardProps) => {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          {/* Add appropriate icon based on audit type */}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-1" />
            {location}
          </div>
          {status === 'in_progress' && (
            <div className="mt-2">
              <div className="w-32 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-500">
          <ClockIcon className="h-4 w-4 inline mr-1" />
          Due {dueDate}
        </div>
        <button
          onClick={onStartAudit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          Start audit
        </button>
      </div>
    </div>
  );
};