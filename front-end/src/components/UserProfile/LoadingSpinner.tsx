// src/components/common/LoadingSpinner.tsx
import { component$ } from '@builder.io/qwik';

interface LoadingSpinnerProps {
  message?: string;
}

export default component$<LoadingSpinnerProps>(({ 
  message = 'در حال بارگذاری...'
}) => {
  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        {message && (
          <p class="text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
});