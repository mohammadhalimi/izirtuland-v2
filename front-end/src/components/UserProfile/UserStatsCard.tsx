// src/components/user/UserStatsCard.tsx
import { component$ } from '@builder.io/qwik';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'green' | 'yellow' | 'emerald' | 'blue';
  trend?: string;
}

export default component$<StatsCardProps>(({ title, value, icon, color, trend }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600'
  };

  return (
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">{title}</p>
          <p class={`text-3xl font-bold mt-2 ${color === 'green' ? 'text-gray-900' : color === 'yellow' ? 'text-yellow-600' : color === 'emerald' ? 'text-emerald-600' : 'text-green-600'}`}>
            {value}
          </p>
          {trend && (
            <p class="text-xs mt-2 text-gray-500">
              {trend}
            </p>
          )}
        </div>
        <div class={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
          <span class="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
});