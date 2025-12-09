// src/components/ui/notification.tsx
import { component$ } from '@builder.io/qwik';
import { CheckIcon, XIcon } from '~/components/icons';

export const Notification = component$<{
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}>((props) => {
  if (!props.show) return null;

  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600'
  };

  return (
    <div class={`fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-10000 p-4 border rounded-2xl shadow-xl ${bgColors[props.type]} transition-all duration-300 animate-fade-in-down`}>
      <div class="flex items-start gap-3">
        <div class={`mt-0.5 ${iconColors[props.type]}`}>
          {props.type === 'success' ? (
            <CheckIcon />
          ) : props.type === 'error' ? (
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div class="flex-1">
          <p class="font-medium">{props.message}</p>
        </div>
        <button
          onClick$={props.onClose}
          class="p-1 hover:bg-white/30 rounded-lg transition-colors"
        >
          <XIcon />
        </button>
      </div>
    </div>
  );
});