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
import SearchBar from "../UserProfile/SearchBar";

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
        searchTerm: string; // اضافه شده برای جستجو
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
        },
        searchTerm: '' // مقدار اولیه
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
        } catch {
            alert("خطا در خروج از حساب");
        }
    });

    const handleTabChange = $((tab: 'complete-purchase' | 'pending-orders' | 'completed-orders') => {
        state.activeTab = tab;
        state.searchTerm = ''; // پاک کردن جستجو هنگام تغییر تب
    });
    
    // تابع جستجو
    const handleSearch = $((term: string) => {
        state.searchTerm = term;
    });
    
    // پاک کردن جستجو
    const clearSearch = $(() => {
        state.searchTerm = '';
    });
    
    // فیلتر کردن سفارشات بر اساس وضعیت و جستجو
    const filterOrdersByTabAndSearch = (orders: Order[], tab: string, searchTerm: string) => {
        let filtered = orders;
        
        // فیلتر بر اساس تب
        if (tab === 'pending-orders') {
            filtered = filtered.filter(order => order.status === 'paid');
        } else if (tab === 'completed-orders') {
            filtered = filtered.filter(order => order.status === 'iscompleted');
        }
        
        // فیلتر بر اساس جستجو
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(order => {
                // جستجو در کد رهگیری
                if (order.payment?.trackId?.toString().toLowerCase().includes(term)) {
                    return true;
                }
                
                // جستجو در شماره سفارش
                if (order._id.toLowerCase().includes(term)) {
                    return true;
                }
                
                // جستجو در نام
                if (order.name?.toLowerCase().includes(term)) {
                    return true;
                }
                
                // جستجو در شماره تلفن
                if (order.phone?.toLowerCase().includes(term)) {
                    return true;
                }
                
                // جستجو در آدرس
                if (order.address?.toLowerCase().includes(term)) {
                    return true;
                }
                
                // جستجو در محصولات
                return order.items.some(item => 
                    item.product?.name?.toLowerCase().includes(term) ||
                    item.brand?.toLowerCase().includes(term) ||
                    item.packageSize?.toLowerCase().includes(term)
                );
            });
        }
        
        return filtered;
    };
    
    // سفارشات فیلتر شده
    const filteredOrders = filterOrdersByTabAndSearch(state.orders, state.activeTab, state.searchTerm);
    
    // آمار سفارشات فیلتر شده
    const filteredStats = {
        total: filteredOrders.length,
        pending: filteredOrders.filter(order => order.status === 'paid').length,
        completed: filteredOrders.filter(order => order.status === 'iscompleted').length,
        totalSpent: filteredOrders
            .filter(order => order.status === 'iscompleted')
            .reduce((sum, order) => sum + order.totalPrice, 0)
    };
    
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
        } catch {
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

    return (
        <div class="min-h-screen bg-linear-to-br from-green-50 to-emerald-50">
            <UserProfileHeader user={state.user} onLogout={logout} />

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* کارت‌های آمار */}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <UserStatsCard
                        title="کل سفارشات"
                        value={state.searchTerm ? filteredStats.total : state.stats.totalOrders}
                        icon="📦"
                        color="green"
                        isFiltered={!!state.searchTerm}
                    />
                    <UserStatsCard
                        title="در انتظار"
                        value={state.searchTerm ? filteredStats.pending : state.stats.pendingOrders}
                        icon="⏳"
                        color="blue"
                        isFiltered={!!state.searchTerm}
                    />
                    <UserStatsCard
                        title="تکمیل شده"
                        value={state.searchTerm ? filteredStats.completed : state.stats.completedOrders}
                        icon="✅"
                        color="emerald"
                        isFiltered={!!state.searchTerm}
                    />
                    <UserStatsCard
                        title="کل هزینه‌ها"
                        value={`${(state.searchTerm ? filteredStats.totalSpent : state.stats.totalSpent).toLocaleString()} تومان`}
                        icon="💰"
                        color="green"
                        isFiltered={!!state.searchTerm}
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
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <ProfileTabs
                                    activeTab={state.activeTab}
                                    onTabChange={handleTabChange}
                                />
                                
                                {/* نوار جستجو - فقط برای تب‌های سفارشات */}
                                {(state.activeTab === 'pending-orders' || state.activeTab === 'completed-orders') && (
                                    <SearchBar
                                        searchTerm={state.searchTerm}
                                        onSearchInput={handleSearch}
                                        placeholder="جستجو در سفارشات..."
                                        onClear={clearSearch}
                                    />
                                )}
                            </div>

                            {/* وضعیت جستجو */}
                            {state.searchTerm && (
                                <div class="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2">
                                            <span class="text-yellow-700">🔍</span>
                                            <span class="text-sm text-yellow-800">
                                                نتایج جستجو برای: 
                                                <span class="font-bold mr-1"> "{state.searchTerm}"</span>
                                                ({filteredOrders.length} مورد یافت شد)
                                            </span>
                                        </div>
                                        <button
                                            onClick$={clearSearch}
                                            class="text-yellow-700 hover:text-yellow-800 text-sm"
                                        >
                                            پاک کردن ✕
                                        </button>
                                    </div>
                                </div>
                            )}

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
                                            {filteredOrders.length === 0 ? (
                                                <div class="text-center py-8">
                                                    {state.searchTerm ? (
                                                        <>
                                                            <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                <span class="text-2xl">🔍</span>
                                                            </div>
                                                            <h4 class="text-lg font-medium text-gray-900 mb-2">
                                                                سفارشی با عبارت "<span class="text-green-600">{state.searchTerm}</span>" یافت نشد
                                                            </h4>
                                                            <p class="text-gray-600 mb-4">
                                                                لطفاً عبارت جستجوی خود را تغییر دهید یا جستجو را پاک کنید
                                                            </p>
                                                            <button
                                                                onClick$={clearSearch}
                                                                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                            >
                                                                مشاهده همه سفارشات در انتظار
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <EmptyOrdersState
                                                            icon="⏳"
                                                            title="هیچ سفارش در حال انتظاری ندارید"
                                                            subtitle="سفارشات شما پس از ثبت در این بخش نمایش داده می‌شوند"
                                                            buttonText="شروع خرید جدید"
                                                            onButtonClick$={() => state.activeTab = 'complete-purchase'}
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <div class="space-y-4">
                                                    {filteredOrders.map((order) => (
                                                        <OrderCard 
                                                            key={order._id} 
                                                            order={order} 
                                                            showStatus={true}
                                                            searchTerm={state.searchTerm}
                                                            showSearchHighlight={!!state.searchTerm}
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
                                        {filteredOrders.length === 0 ? (
                                            <div class="text-center py-8">
                                                {state.searchTerm ? (
                                                    <>
                                                        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <span class="text-2xl">🔍</span>
                                                        </div>
                                                        <h4 class="text-lg font-medium text-gray-900 mb-2">
                                                            سفارشی با عبارت "<span class="text-green-600">{state.searchTerm}</span>" یافت نشد
                                                        </h4>
                                                        <p class="text-gray-600 mb-4">
                                                            لطفاً عبارت جستجوی خود را تغییر دهید یا جستجو را پاک کنید
                                                        </p>
                                                        <button
                                                            onClick$={clearSearch}
                                                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                        >
                                                            مشاهده همه سفارشات تکمیل شده
                                                        </button>
                                                    </>
                                                ) : (
                                                    <EmptyOrdersState
                                                        icon="✅"
                                                        title="هنوز سفارش تکمیل شده‌ای ندارید"
                                                        subtitle="اولین سفارش خود را ثبت کنید و از مزایای خرید آنلاین بهره‌مند شوید"
                                                        buttonText="شروع خرید"
                                                        onButtonClick$={() => state.activeTab = 'complete-purchase'}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <div class="space-y-4">
                                                {filteredOrders.map((order) => (
                                                    <OrderCard 
                                                        key={order._id} 
                                                        order={order} 
                                                        isCompleted={true}
                                                        searchTerm={state.searchTerm}
                                                        showSearchHighlight={!!state.searchTerm}
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
