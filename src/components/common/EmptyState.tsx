import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
      {icon || <FileQuestion className="w-12 h-12 text-neutral-400" />}
      <div>
        <h3 className="text-lg font-title font-bold text-neutral-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {description}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-4 py-2 text-sm font-semibold text-white bg-accent-500 hover:bg-accent-600 rounded-m transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}