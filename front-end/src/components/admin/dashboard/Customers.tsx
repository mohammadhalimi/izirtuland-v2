// src/components/admin/dashboard/CustomerManager.tsx
import { component$, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { API_BASE_URL } from '~/config/api';
import type { Customer, CustomerManagerProps } from '~/components/types/customer';
import { ErrorAlert } from '~/components/dashboard/customer/ErrorAlert';
import { CustomerStats } from '~/components/dashboard/customer/CustomerStats';
import { CustomerSearch } from '~/components/dashboard/customer/CustomerSearch';
import { CustomersTable } from '~/components/dashboard/customer/CustomersTable';
import { Pagination } from '~/components/dashboard/customer/Pagination';

export default component$<CustomerManagerProps>(({ authToken }) => {
  const state = useStore({
    customers: [] as Customer[],
    loading: true,
    error: '',
    searchQuery: '',
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    stats: {
      totalCustomers: 0,
      customersWithName: 0,
      customersWithAddress: 0,
      recentCustomers: 0
    }
  });

  // دریافت لیست مشتریان
  const fetchCustomers = $(async () => {
    state.loading = true;
    state.error = '';

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/getAllUser`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const usersArray = Array.isArray(data) ? data : (data.users || []);
        
        state.customers = usersArray;

        // محاسبه آمار
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        state.stats = {
          totalCustomers: usersArray.length,
          customersWithName: usersArray.filter((customer: any) =>
            customer.name && customer.name.trim()
          ).length,
          customersWithAddress: usersArray.filter((customer: any) =>
            customer.address && customer.address.trim()
          ).length,
          recentCustomers: usersArray.filter((customer: any) =>
            new Date(customer.createdAt) > oneWeekAgo
          ).length
        };

      } else {
        state.error = `خطای سرور: ${response.status}`;
      }
    } catch {
      state.error = 'خطا در ارتباط با سرور';
    } finally {
      state.loading = false;
    }
  });

  // فیلتر مشتریان
  const filteredCustomers = state.customers.filter(customer => {
    if (!state.searchQuery.trim()) return true;
    const query = state.searchQuery.toLowerCase();
    return (
      (customer.name && customer.name.toLowerCase().includes(query)) ||
      customer.phone.includes(query) ||
      (customer.address && customer.address.toLowerCase().includes(query))
    );
  });

  // محاسبه صفحات
  state.totalPages = Math.ceil(filteredCustomers.length / state.itemsPerPage);
  
  const paginatedCustomers = filteredCustomers.slice(
    (state.currentPage - 1) * state.itemsPerPage,
    state.currentPage * state.itemsPerPage
  );

  // تغییر صفحه
  const goToPage = $((page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      state.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // تغییر جستجو
  const handleSearchChange = $((value: string) => {
    state.searchQuery = value;
    state.currentPage = 1;
  });

  useVisibleTask$(() => {
    fetchCustomers();
  });

  return (
    <div class="p-6 space-y-6">
      {/* هدر */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">👨‍💼 مدیریت مشتریان</h1>
          <p class="text-gray-600">مدیریت و مشاهده اطلاعات کاربران سایت</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-2">
            <span>🔄</span>
            <span>آخرین بروزرسانی: اکنون</span>
          </div>
          
          <button
            onClick$={fetchCustomers}
            class="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>🔄</span>
            <span>بروزرسانی لیست</span>
          </button>
        </div>
      </div>

      {/* نمایش خطا */}
      <ErrorAlert
        error={state.error}
        onDismiss={$(() => {  // با $ wrap کنید
          state.error = '';
        })}
      />

      {/* کارت‌های آمار */}
      <CustomerStats stats={state.stats} />

      {/* جستجو */}
      <CustomerSearch 
        searchQuery={state.searchQuery}
        resultsCount={filteredCustomers.length}
        onSearchChange={handleSearchChange}
      />

      {/* جدول مشتریان */}
      <CustomersTable 
        customers={filteredCustomers}
        loading={state.loading}
        searchQuery={state.searchQuery}
        paginatedCustomers={paginatedCustomers}
      />

      {/* Pagination */}
      <Pagination 
        currentPage={state.currentPage}
        totalPages={state.totalPages}
        totalItems={filteredCustomers.length}
        itemsPerPage={state.itemsPerPage}
        onPageChange={goToPage}
      />
    </div>
  );
});