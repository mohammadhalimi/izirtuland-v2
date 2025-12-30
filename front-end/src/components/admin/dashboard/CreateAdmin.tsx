// src/components/admin/dashboard/CreateAdmin.tsx
import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { API_BASE_URL } from '~/config/api';
import type { CreateAdminProps, Admin } from '~/components/types/createAdmin';
import { AdminHeader } from '../../dashboard/createAdmin/AdminHeader';
import { CreateAdminForm } from '../../dashboard/createAdmin/CreateAdminForm';
import { HelpSection } from '../../dashboard/createAdmin/HelpSection';
import { AdminList } from '../../dashboard/createAdmin/AdminList';
import { DeleteAdminModal } from '../../dashboard/createAdmin/DeleteAdminModal';

export default component$<CreateAdminProps>(({ authToken, currentAdmin }) => {
  // فرم states
  const username = useSignal('');
  const password = useSignal('');
  const confirmPassword = useSignal('');
  const isLoading = useSignal(false);
  const message = useSignal('');
  const messageType = useSignal<'success' | 'error'>('success');

  // لیست ادمین‌ها states
  const admins = useSignal<Admin[]>([]);
  const loadingAdmins = useSignal(true);
  const deletingAdminId = useSignal<string | null>(null);

  // modal states
  const showDeleteModal = useSignal(false);
  const adminToDelete = useSignal<Admin | null>(null);

  // دریافت لیست ادمین‌ها
  const fetchAdmins = $(async () => {
    try {
      loadingAdmins.value = true;
      const response = await fetch(`${API_BASE_URL}/api/auth/getAlladmin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        admins.value = data.admins || data || [];
      } else {
        console.error('Error fetching admins:', response.status);
        admins.value = [];
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      admins.value = [];
    } finally {
      loadingAdmins.value = false;
    }
  });

  // دریافت خودکار لیست ادمین‌ها
  useTask$(({ track }) => {
    track(() => authToken);
    if (authToken) {
      fetchAdmins();
    }
  });

  // ایجاد ادمین جدید
  const handleSubmit = $(async () => {
    // اعتبارسنجی
    if (!username.value || !password.value || !confirmPassword.value) {
      message.value = 'لطفاً تمام فیلدها را پر کنید';
      messageType.value = 'error';
      return;
    }

    if (password.value !== confirmPassword.value) {
      message.value = 'رمز عبور و تکرار آن مطابقت ندارند';
      messageType.value = 'error';
      return;
    }

    if (password.value.length < 6) {
      message.value = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
      messageType.value = 'error';
      return;
    }

    isLoading.value = true;
    message.value = '';

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value
        })
      });

      const data = await response.json();

      if (response.ok) {
        message.value = '✅ ادمین جدید با موفقیت ایجاد شد';
        messageType.value = 'success';

        // پاک کردن فرم
        username.value = '';
        password.value = '';
        confirmPassword.value = '';

        // رفرش لیست ادمین‌ها
        await fetchAdmins();
      } else {
        message.value = data.message || 'خطا در ایجاد ادمین';
        messageType.value = 'error';
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      message.value = 'خطا در ارتباط با سرور';
      messageType.value = 'error';
    } finally {
      isLoading.value = false;
    }
  });

  // باز کردن modal حذف
  const openDeleteModal = $((admin: Admin) => {
    if (currentAdmin.role === 'admin') {
      message.value = 'شما دسترسی لازم برای حذف ادمین را ندارید. فقط سوپر ادمین می‌تواند ادمین‌ها را حذف کند.';
      messageType.value = 'error';
      return;
    }

    if (admin._id === currentAdmin._id) {
      message.value = 'شما نمی‌توانید حساب کاربری خودتان را حذف کنید.';
      messageType.value = 'error';
      return;
    }

    adminToDelete.value = admin;
    showDeleteModal.value = true;
  });

  // بستن modal
  const closeDeleteModal = $(() => {
    showDeleteModal.value = false;
    adminToDelete.value = null;
  });

  // تایید حذف
  const confirmDeleteAdmin = $(async () => {
    if (!adminToDelete.value) return;

    const adminId = adminToDelete.value._id;
    deletingAdminId.value = adminId;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/deleteAdmin/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        message.value = `✅ ادمین "${adminToDelete.value.username}" با موفقیت حذف شد`;
        messageType.value = 'success';
        await fetchAdmins();
      } else {
        message.value = data.message || 'خطا در حذف ادمین';
        messageType.value = 'error';
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      message.value = 'خطا در ارتباط با سرور';
      messageType.value = 'error';
    } finally {
      deletingAdminId.value = null;
      closeDeleteModal();
    }
  });

  return (
    <div class="space-y-6">
      {/* هدر اطلاعات ادمین */}
      <AdminHeader currentAdmin={currentAdmin} />

      {/* فرم ایجاد ادمین */}
      <CreateAdminForm
        username={username}
        password={password}
        confirmPassword={confirmPassword}
        isLoading={isLoading}
        message={message}
        messageType={messageType}
        onSubmit={handleSubmit}
        currentAdminRole={currentAdmin.role}
      />

      {/* بخش راهنما */}
      <HelpSection currentAdminRole={currentAdmin.role} />

      {/* لیست ادمین‌ها */}
      <AdminList
        admins={admins.value}
        loadingAdmins={loadingAdmins.value}
        currentAdmin={currentAdmin}
        deletingAdminId={deletingAdminId.value}
        onRefresh={fetchAdmins}
        onDeleteClick={openDeleteModal}
      />

      {/* Modal حذف */}
      <DeleteAdminModal
        showModal={showDeleteModal.value}
        adminToDelete={adminToDelete.value}
        deletingAdminId={deletingAdminId.value}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteAdmin}
      />
    </div>
  );
});