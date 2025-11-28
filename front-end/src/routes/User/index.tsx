// src/routes/user/index.tsx
import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import UserLogin from '~/components/user/userLogin';
import UserProfile from '~/components/user/userProfile';

export default component$(() => {
    const state = useStore({
        isAuthenticated: false,
        loading: true
    });

    // بررسی وضعیت احراز هویت
    useVisibleTask$(async () => {
        try {
            const res = await fetch("http://localhost:5000/api/user/me", {
                credentials: "include",
            });
            const data = await res.json();
            state.isAuthenticated = data.success;
        } catch (err) {
            state.isAuthenticated = false;
        } finally {
            state.loading = false;
        }
    });

    if (state.loading) {
        return (
            <div class="min-h-screen bg-gray-50 flex items-center justify-center">
                <div class="text-center">
                    <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-gray-600">در حال بررسی...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {state.isAuthenticated ? <UserProfile /> : <UserLogin />}
        </div>
    );
});