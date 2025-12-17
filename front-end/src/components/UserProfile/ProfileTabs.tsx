// src/components/user/ProfileTabs.tsx
import { component$ } from '@builder.io/qwik';

interface ProfileTabsProps {
  activeTab: 'complete-purchase' | 'completed-orders';
  onTabChange: (tab: 'complete-purchase' | 'completed-orders') => void;
}

export default component$<ProfileTabsProps>(({ activeTab, onTabChange }) => {
  return (
    <div class="flex space-x-6 rtl:space-x-reverse border-b border-gray-200 pb-4">
      <button
        onClick$={() => onTabChange('complete-purchase')}
        class={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer duration-200 ${
          activeTab === 'complete-purchase'
            ? 'bg-green-100 text-green-700'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        🛒 تکمیل خرید
      </button>
      <button
        onClick$={() => onTabChange('completed-orders')}
        class={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer duration-200 ${
          activeTab === 'completed-orders'
            ? 'bg-green-100 text-green-700'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        ✅ سفارشات تکمیل شده
      </button>
    </div>
  );
});