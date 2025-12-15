// src/components/common/UserAvatar.tsx
import { component$, useContext, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { AuthContext } from '~/context/auth-context';

export const UserAvatar = component$(() => {
    const auth = useContext(AuthContext);
    useVisibleTask$(({ cleanup }) => {
        const handleAuthChange = () => {
            // وقتی auth تغییر کرد، component را مجبور به رندر مجدد می‌کنیم
            // در Qwik، useContext به صورت خودکار تغییرات را تشخیص می‌دهد
        };

        window.addEventListener('auth-state-changed', handleAuthChange);

        cleanup(() => {
            window.removeEventListener('auth-state-changed', handleAuthChange);
        });
    });
    // اگر در حال لود کردن باشد
    if (auth.isLoading) {
        return (
            <div class="p-2 lg:block hidden">
                <div class="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
        );
    }

    // اگر کاربر لاگین کرده باشد
    if (auth.isAuthenticated && auth.user) {
        return (
            <Link
                href="/user"
                class="p-2 text-gray-600 hover:text-green-600 transition-colors duration-200 lg:block hidden relative group"
            >
                {/* آیکون لاگین شده */}
                <div class="flex items-center space-x-1 cursor-pointer">
                    <div class="w-8 h-8 rounded-full bg-linear-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm relative">
                        {/* دایره سبز کوچک نشان‌دهنده آنلاین بودن */}
                        <div class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>

                        {auth.user.name
                            ? auth.user.name.charAt(0).toUpperCase()
                            : auth.user.phone.slice(-2)}
                    </div>

                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>

                {/* Tooltip برای نمایش نام */}
                <div class="absolute top-full left-0 mt-2 w-40 bg-gray-900 text-white text-sm rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div class="font-medium">{auth.user.name || 'کاربر'}</div>
                    <div class="text-xs text-gray-300 mt-1">مشاهده پروفایل</div>
                </div>
            </Link>
        );
    }

    // اگر کاربر لاگین نکرده باشد
    return (
        <Link
            href="/user"
            class="p-2 text-gray-600 hover:text-green-600 transition-colors duration-200 lg:block hidden relative group"
        >
            {/* آیکون لاگین نشده */}
            <div class="flex items-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
            </div>

            {/* Tooltip برای کاربر لاگین نشده */}
            <div class="absolute top-full left-0 mt-2 w-32 bg-gray-900 text-white text-sm rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="font-medium">ورود / ثبت‌نام</div>
            </div>
        </Link>
    );
});