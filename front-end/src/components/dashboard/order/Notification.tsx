import { component$, useTask$ } from '@builder.io/qwik';
import { NotificationProps } from '~/components/types/order';

export const Notification = component$<NotificationProps>(({
  type = 'success',
  message,
  duration = 4000,
  isVisible,
  onClose
}) => {

  useTask$(({ cleanup }) => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      cleanup(() => clearTimeout(timer));
    }
  });

  if (!isVisible) return null;

  const config = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: '✅',
      title: 'موفقیت',
      progress: 'bg-green-500'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: '❌',
      title: 'خطا',
      progress: 'bg-red-500'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚠️',
      title: 'هشدار',
      progress: 'bg-yellow-500'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: 'ℹ️',
      title: 'اطلاعات',
      progress: 'bg-blue-500'
    }
  }[type];

  return (
    <div class="fixed top-6 right-6 z-50 max-w-md animate-slideInRight">
      <div class={`${config.bg} border rounded-xl shadow-lg overflow-hidden`}>
        <div class="p-4">
          <div class="flex items-start">
            <div class="shrink-0 text-xl mr-3">{config.icon}</div>
            <div class="flex-1">
              <div class={`font-medium ${config.text}`}>{config.title}</div>
              <div class="mt-1 text-gray-700">{message}</div>
            </div>
            <button
              onClick$={onClose}
              class="ml-4 shrink-0 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {duration > 0 && (
          <div class="h-1 w-full bg-gray-200">
            <div
              class={`h-full ${config.progress} animate-progress`}
              style={{ animationDuration: `${duration}ms` }}
            />
          </div>
        )}
      </div>
    </div>
  );
});
