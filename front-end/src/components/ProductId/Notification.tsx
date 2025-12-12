// src/routes/products/[id]/Notification.tsx
import { component$ } from '@builder.io/qwik';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
}

export const Notification = component$<NotificationProps>(({ message, type, isVisible, onClose }) => {
    const bgColor = type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
        type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600' :
        'bg-gradient-to-r from-blue-500 to-cyan-600';

    const icon = type === 'success' ? '✅' :
        type === 'error' ? '❌' :
        'ℹ️';

    const title = type === 'success' ? 'موفقیت!' :
        type === 'error' ? 'خطا!' :
        'اطلاعیه';

    return (
        <div
            class={`fixed top-6 right-6 z-999 transform transition-all duration-500 ${
                isVisible
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0 pointer-events-none'
            }`}
        >
            <div class={`${bgColor} text-white rounded-2xl shadow-2xl shadow-gray-800/30 p-6 min-w-[380px] max-w-md`}>
                <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4">
                        <span class="text-2xl">{icon}</span>
                        <div>
                            <h3 class="font-bold text-lg mb-1">{title}</h3>
                            <p class="text-white/90 whitespace-pre-line">{message}</p>
                        </div>
                    </div>
                    <button
                        onClick$={onClose}
                        class="text-white/80 hover:text-white ml-4 transition-colors text-xl"
                        aria-label="بستن اعلان"
                    >
                        ✕
                    </button>
                </div>
                <div class="mt-4 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                        class={`h-full bg-white rounded-full ${
                            isVisible ? 'animate-progress' : ''
                        }`}
                    />
                </div>
            </div>
        </div>
    );
});