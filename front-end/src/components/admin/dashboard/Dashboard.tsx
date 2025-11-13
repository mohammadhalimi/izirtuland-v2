import { component$ } from '@builder.io/qwik';

interface DashboardProps {
  adminName: string;
}
export default component$<DashboardProps>(({ adminName }) => {

    const stats = [
        { title: 'کل فروش', value: '۱۲۵,۴۰۰,۰۰۰', change: '+۱۲.۵%', icon: '💰', color: 'green' },
        { title: 'سفارشات', value: '۲,۸۴۷', change: '+۸.۲%', icon: '📦', color: 'blue' },
        { title: 'مشتریان', value: '۱۲,۸۴۶', change: '+۵.۷%', icon: '👥', color: 'purple' },
        { title: 'محصولات', value: '۱۵۶', change: '+۳.۱%', icon: '🌿', color: 'orange' }
    ];

    return (
        <div>
            {/* Welcome Message */}
            <div class="bg-linear-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white mb-8">
                <h2 class="text-2xl font-bold mb-2">سلام! 👋 {adminName}</h2>
                <p class="opacity-90">خوش آمدید به پنل مدیریت پربار باغستان</p>
            </div>

            {/* Stats Cards */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class={`w-12 h-12 bg-${stat.color}-100 rounded-2xl flex items-center justify-center text-2xl`}>
                                {stat.icon}
                            </div>
                            <span class={`text-sm font-medium text-${stat.color}-600 bg-${stat.color}-50 px-2 py-1 rounded-full`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                        <p class="text-gray-600 text-sm">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200 cursor-pointer">
                    <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl text-green-600 mx-auto mb-3">
                        ➕
                    </div>
                    <h3 class="font-medium text-gray-800 mb-1">محصول جدید</h3>
                    <p class="text-sm text-gray-600">افزودن محصول جدید به فروشگاه</p>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200 cursor-pointer">
                    <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl text-blue-600 mx-auto mb-3">
                        📊
                    </div>
                    <h3 class="font-medium text-gray-800 mb-1">گزارش فروش</h3>
                    <p class="text-sm text-gray-600">مشاهده گزارش‌های دقیق فروش</p>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200 cursor-pointer">
                    <div class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl text-purple-600 mx-auto mb-3">
                        👥
                    </div>
                    <h3 class="font-medium text-gray-800 mb-1">مدیریت کاربران</h3>
                    <p class="text-sm text-gray-600">مدیریت مشتریان و دسترسی‌ها</p>
                </div>
            </div>
        </div>
    );
});