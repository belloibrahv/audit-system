type StatusBadgeProps = {
  status: string;
  type?: 'status' | 'risk';
};

const StatusBadge = ({ status, type = 'status' }: StatusBadgeProps) => {
  // Format status for display (replace underscores with spaces and capitalize)
  const formattedStatus = status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  // Define color schemes for different status types
  const getColorClasses = () => {
    if (type === 'risk') {
      switch (status.toLowerCase()) {
        case 'low':
          return 'bg-green-100 text-green-800';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800';
        case 'high':
          return 'bg-orange-100 text-orange-800';
        case 'critical':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else {
      // Regular status badges
      switch (status.toLowerCase()) {
        case 'draft':
        case 'planned':
          return 'bg-gray-100 text-gray-800';
        case 'in_progress':
          return 'bg-blue-100 text-blue-800';
        case 'review':
          return 'bg-indigo-100 text-indigo-800';
        case 'approved':
        case 'completed':
        case 'closed':
        case 'implemented':
          return 'bg-green-100 text-green-800';
        case 'open':
          return 'bg-yellow-100 text-yellow-800';
        case 'follow_up':
          return 'bg-purple-100 text-purple-800';
        case 'accepted':
          return 'bg-orange-100 text-orange-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClasses()}`}
    >
      {formattedStatus}
    </span>
  );
};

export default StatusBadge;
