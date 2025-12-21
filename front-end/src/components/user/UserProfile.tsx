// src/components/user/UserProfile.tsx
import { $, component$, useStore, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { API_BASE_URL } from '~/config/api';
import type { User, Order } from '../types/user';
import UserProfileHeader from "../UserProfile/UserProfileHeader";
import UserStatsCard from "../UserProfile/UserStatsCard";
import UserSidebar from "../UserProfile/UserSidebar";
import ProfileTabs from "../UserProfile/ProfileTabs";
import OrderCard from "../UserProfile/OrderCard";
import EditProfileModal from "../UserProfile/EditProfileModal";
import LoadingSpinner from "../UserProfile/LoadingSpinner";
import EmptyOrdersState from "../UserProfile/EmptyOrdersState";
import CheckoutPreview from "../UserProfile/CheckoutPreview";

export default component$(() => {
    const state = useStore<{
        user: User | null;
        orders: Order[];
        loading: boolean;
        error: string | null;
        activeTab: 'complete-purchase' | 'pending-orders' | 'completed-orders';
        stats: {
            totalOrders: number;
            pendingOrders: number;
            completedOrders: number;
            totalSpent: number;
        };
    }>({
        user: null,
        orders: [],
        loading: true,
        error: null,
        activeTab: 'complete-purchase',
        stats: {
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            totalSpent: 0
        }
    });

    const showEditModal = useSignal(false);
    const hasCheckout = useSignal(false);
    const editLoading = useSignal(false);
    const editError = useSignal('');
    
    const onClose$ = $(() => {
        showEditModal.value = false;
    });
    
    useVisibleTask$(() => {
        const checkout = localStorage.getItem('perebar_checkout');
        hasCheckout.value = !!checkout;
    });
    
    useVisibleTask$(async () => {
        console.log('Fetching user data...');
        try {
            const [userRes, ordersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/user/me`, {
                    credentials: "include"
                }),
                fetch(`${API_BASE_URL}/api/user/me/orders`, {
                    credentials: "include"
                })
            ]);

            const userData = await userRes.json();
            const ordersData = await ordersRes.json();

            console.log('User data:', userData);
            console.log('Orders data:', ordersData);

            if (userData.success) {
                state.user = userData.user;
            } else {
                state.error = "لطفاً ابتدا وارد شوید";
                state.loading = false;
                return;
            }

            if (ordersData.success) {
                state.orders = ordersData.orders;

                const completedOrders = ordersData.orders.filter((order: Order) => order.status === 'iscompleted');
                const pendingOrders = ordersData.orders.filter((order: Order) => 
                    order.status === 'paid'
                );
                
                state.stats = {
                    totalOrders: ordersData.orders.length,
                    pendingOrders: pendingOrders.length,
                    completedOrders: completedOrders.length,
                    totalSpent: completedOrders.reduce((sum: number, order: Order) => sum + order.totalPrice, 0)
                };

                console.log('Calculated stats:', state.stats);
            } else {
                state.orders = [];
                state.stats = {
                    totalOrders: 0,
                    pendingOrders: 0,
                    completedOrders: 0,
                    totalSpent: 0
                };
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            state.error = "خطا در ارتباط با سرور";
        } finally {
            state.loading = false;
        }
    });

    const logout = $(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/user/logout`, {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                window.location.reload();
            }
        } catch (err) {
            alert("خطا در خروج از حساب");
        }
    });

    const handleTabChange = $((tab: 'complete-purchase' | 'pending-orders' | 'completed-orders') => {
        state.activeTab = tab;
    });
    
    const onSave$ = $(async (name: string, address: string) => {
        if (!state.user) return;

        editLoading.value = true;
        editError.value = '';

        try {
            const res = await fetch(`${API_BASE_URL}/api/user/me/update`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({
                    name: name.trim(),
                    address: address.trim()
                })
            });

            const data = await res.json();

            if (data.success && state.user) {
                state.user.name = name.trim();
                state.user.address = address.trim();
                showEditModal.value = false;
            } else {
                editError.value = data.message || 'خطا در بروزرسانی پروفایل';
            }
        } catch (err) {
            editError.value = "خطا در ارتباط با سرور";
        } finally {
            editLoading.value = false;
        }
    });

    if (state.loading) {
        return <LoadingSpinner message="در حال بارگذاری پنل کاربری" />;
    }

    if (state.error) {
        return (
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <h2 class="text-2xl text-red-600 mb-4">{state.error}</h2>
                    <button
                        onClick$={() => window.location.reload()}
                        class="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        تلاش مجدد
                    </button>
                </div>
            </div>
        );
    }

    if (!state.user) {
        return null;
    }

    // فیلتر کردن سفارشات بر اساس وضعیت
    const completedOrders = state.orders.filter(order => order.status === 'iscompleted');
    const pendingOrders = state.orders.filter(order => 
        order.status === 'paid'
    );
    const hasPendingOrders = pendingOrders.length > 0;

    return (
        <div class="min-h-screen bg-linear-to-br from-green-50 to-emerald-50">
            <UserProfileHeader user={state.user} onLogout={logout} />

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* کارت‌های آمار */}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <UserStatsCard
                        title="کل سفارشات"
                        value={state.stats.totalOrders}
                        icon="📦"
                        color="green"
                    />
                    <UserStatsCard
                        title="در انتظار"
                        value={state.stats.pendingOrders}
                        icon="⏳"
                        color="blue"
                    />
                    <UserStatsCard
                        title="تکمیل شده"
                        value={state.stats.completedOrders}
                        icon="✅"
                        color="emerald"
                    />
                    <UserStatsCard
                        title="کل هزینه‌ها"
                        value={`${state.stats.totalSpent.toLocaleString()} تومان`}
                        icon="💰"
                        color="green"
                    />
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* سایدبار */}
                    <div class="lg:col-span-1">
                        <UserSidebar
                            user={state.user}
                            showEditModal={showEditModal}
                        />
                    </div>

                    {/* محتوای اصلی */}
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <ProfileTabs
                                activeTab={state.activeTab}
                                onTabChange={handleTabChange}
                            />

                            <div class="mt-6">
                                {state.activeTab === 'complete-purchase' ? (
                                    <div class="space-y-6">
                                        <h3 class="text-xl font-bold text-gray-900 mb-4">
                                            تکمیل فرآیند خرید
                                        </h3>
                                        <div class="bg-white border border-gray-200 rounded-2xl p-6">
                                            <h4 class="font-bold text-gray-900 mb-4">
                                                سفارشات در حال انجام
                                            </h4>
                                            {!hasCheckout.value ? (
                                                <EmptyOrdersState
                                                    icon="🛒"
                                                    title="هیچ سبد خریدی در انتظار ندارید"
                                                    subtitle="می‌توانید از بخش محصولات، کالاهای مورد نیاز خود را انتخاب کنید"
                                                    buttonText="مشاهده محصولات"
                                                    buttonHref="/Products"
                                                />
                                            ) : (
                                                <CheckoutPreview />
                                            )}
                                        </div>
                                    </div>
                                ) : state.activeTab === 'pending-orders' ? (
                                    <div class="space-y-6">
                                        <h3 class="text-xl font-bold text-gray-900 mb-4">
                                            سفارشات در حال انتظار
                                        </h3>
                                        <div class="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                                            {!hasPendingOrders ? (
                                                <EmptyOrdersState
                                                    icon="⏳"
                                                    title="هیچ سفارش در حال انتظاری ندارید"
                                                    subtitle="سفارشات شما پس از ثبت در این بخش نمایش داده می‌شوند"
                                                    buttonText="شروع خرید جدید"
                                                    onButtonClick$={() => state.activeTab = 'complete-purchase'}
                                                />
                                            ) : (
                                                <div class="space-y-4">
                                                    {pendingOrders.map((order) => (
                                                        <OrderCard 
                                                            key={order._id} 
                                                            order={order} 
                                                            showStatus={true}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div class="space-y-6">
                                        <h3 class="text-xl font-bold text-gray-900 mb-4">
                                            سفارشات تکمیل شده
                                        </h3>
                                        {completedOrders.length === 0 ? (
                                            <EmptyOrdersState
                                                icon="✅"
                                                title="هنوز سفارش تکمیل شده‌ای ندارید"
                                                subtitle="اولین سفارش خود را ثبت کنید و از مزایای خرید آنلاین بهره‌مند شوید"
                                                buttonText="شروع خرید"
                                                onButtonClick$={() => state.activeTab = 'complete-purchase'}
                                            />
                                        ) : (
                                            <div class="space-y-4">
                                                {completedOrders.map((order) => (
                                                    <OrderCard 
                                                        key={order._id} 
                                                        order={order} 
                                                        isCompleted={true}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditProfileModal
                isOpen={showEditModal.value}
                onClose$={onClose$}
                onSave$={onSave$}
                initialName={state.user?.name || ''}
                initialAddress={state.user?.address || ''}
                loading={editLoading.value}
                error={editError.value}
            />
        </div>
    );
});