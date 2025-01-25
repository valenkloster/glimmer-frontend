import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const StockAlert = ({ message }) => {
  return (
    <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
      <ExclamationCircleIcon className="h-7 w-7" />
      <span>{message}</span>
    </div>
  );
};

export default StockAlert;