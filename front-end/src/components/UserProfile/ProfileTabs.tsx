// src/components/user/ProfileTabs.tsx
import { component$ } from '@builder.io/qwik';

type TabType = 'complete-purchase' | 'pending-orders' | 'completed-orders';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default component$<ProfileTabsProps>(({ activeTab, onTabChange }) => {
  return (
    <div class="flex space-x-6 rtl:space-x-reverse border-b border-gray-200 pb-4 overflow-x-auto">
      <button
        onClick$={() => onTabChange('complete-purchase')}
        class={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer duration-200 whitespace-nowrap ${
          activeTab === 'complete-purchase'
            ? 'bg-green-100 text-green-700'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        🛒 تکمیل خرید
      </button>
      <button
        onClick$={() => onTabChange('pending-orders')}
        class={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer duration-200 whitespace-nowrap ${
          activeTab === 'pending-orders'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        ⏳ سفارشات در حال انتظار
      </button>
      <button
        onClick$={() => onTabChange('completed-orders')}
        class={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer duration-200 whitespace-nowrap ${
          activeTab === 'completed-orders'
            ? 'bg-emerald-100 text-emerald-700'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        ✅ سفارشات تکمیل شده
      </button>
    </div>
  );
});