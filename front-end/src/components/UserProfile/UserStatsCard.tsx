// src/components/user/UserStatsCard.tsx (نسخه به‌روزرسانی شده)
import { component$ } from '@builder.io/qwik';

interface UserStatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'green' | 'blue' | 'emerald' | 'yellow';
  isFiltered?: boolean;
}

export default component$<UserStatsCardProps>(({ 
  title, 
  value, 
  icon, 
  color,
  isFiltered = false
}) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-700 border-green-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  };

  return (
    <div class={`rounded-xl border p-5 transition-all duration-200 ${colorClasses[color]} ${isFiltered ? 'ring-2 ring-yellow-300' : ''}`}>
      <div class="flex items-center justify-between mb-3">
        <div class={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color].split(' ')[0]} border ${colorClasses[color].split(' ')[2]}`}>
          <span class="text-lg">{icon}</span>
        </div>
        {isFiltered && (
          <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
            فیلتر شده
          </span>
        )}
      </div>
      <div>
        <div class="text-sm text-gray-600 mb-1">{title}</div>
        <div class="font-bold text-2xl">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      </div>
    </div>
  );
});