import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export default function ErrorMessage({ message, retry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 bg-red-50 dark:bg-red-950/20 rounded-l border border-red-200 dark:border-red-800">
      <AlertCircle className="w-8 h-8 text-red-500" />
      <p className="text-sm text-red-800 dark:text-red-200 font-medium">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-m transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}