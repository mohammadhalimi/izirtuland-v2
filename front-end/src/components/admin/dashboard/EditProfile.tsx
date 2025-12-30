// src/components/admin/dashboard/EditProfile.tsx
import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { ProfileForm } from '~/components/dashboard/editeProfile/ProfileForm';
import { ProfileHeader } from '~/components/dashboard/editeProfile/ProfileHeader';
import { ProfileImageUpload } from '~/components/dashboard/editeProfile/ProfileImageUpload';
import { ProfileSecurityInfo } from '~/components/dashboard/editeProfile/ProfileSecurityInfo';
import { getFullImageUrl } from '~/components/function/function';
import { ErrorState } from '~/components/ProductId/ErrorState';
import { EditProfileProps } from '~/components/types/editeProfile';
import { API_BASE_URL } from '~/config/api';


export default component$<EditProfileProps>(({ authToken, currentAdmin }) => {
  // State management
  const newUsername = useSignal('');
  const currentPassword = useSignal('');
  const newPassword = useSignal('');
  const confirmPassword = useSignal('');
  const selectedFile = useSignal<File | null>(null);
  const previewUrl = useSignal(getFullImageUrl(currentAdmin.profileImage));
  const isUploading = useSignal(false);
  const isLoading = useSignal(false);
  const message = useSignal('');
  const messageType = useSignal<'success' | 'error'>('success');
  const hasError = useSignal(false);

  // Check for user ID on component load
  useTask$(({ track }) => {
    track(() => currentAdmin._id);
    if (!currentAdmin._id) {
      hasError.value = true;
      message.value = 'خطا در دریافت اطلاعات کاربر. لطفاً دوباره وارد سیستم شوید.';
      messageType.value = 'error';
    }
  });

  // Cookie update functions
  const updateAdminDataInCookie = $(async (newProfileImage: string) => {
    try {
      const currentAdminData = {
        _id: currentAdmin._id,
        username: currentAdmin.username,
        role: currentAdmin.role,
        profileImage: newProfileImage
      };
      document.cookie = `admin-data=${JSON.stringify(currentAdminData)}; path=/; max-age=86400; SameSite=Lax`;
    } catch (error) {
      console.error('خطا در آپدیت کوکی:', error);
    }
  });

  const updateLocalStorage = $(async (newProfileImage: string) => {
    try {
      const currentAdminData = {
        _id: currentAdmin._id,
        username: currentAdmin.username,
        role: currentAdmin.role,
        profileImage: newProfileImage
      };
      localStorage.setItem('admin-data', JSON.stringify(currentAdminData));
    } catch (error) {
      console.error('خطا در آپدیت localStorage:', error);
    }
  });

  // File selection handler
  const handleFileSelect = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        message.value = 'لطفاً فقط فایل تصویر انتخاب کنید';
        messageType.value = 'error';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        message.value = 'حجم فایل باید کمتر از ۵ مگابایت باشد';
        messageType.value = 'error';
        return;
      }
      
      selectedFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  });

  // Image upload handler
  const handleUploadProfileImage = $(async () => {
    if (!selectedFile.value || !currentAdmin._id) return;

    isUploading.value = true;
    message.value = '';

    try {
      const formData = new FormData();
      formData.append('profile', selectedFile.value);
      formData.append('adminId', currentAdmin._id);

      const response = await fetch(`${API_BASE_URL}/api/auth/${currentAdmin._id}/upload-profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.profileImage) {
        message.value = 'عکس پروفایل با موفقیت آپلود شد 🌱';
        messageType.value = 'success';
        selectedFile.value = null;
        
        const fullImageUrl = getFullImageUrl(data.profileImage);
        previewUrl.value = fullImageUrl;
        
        await updateAdminDataInCookie(data.profileImage);
        await updateLocalStorage(data.profileImage);
        
        setTimeout(() => message.value = '', 3000);
      } else {
        message.value = data.message || 'خطا در آپلود عکس';
        messageType.value = 'error';
      }
    } catch (error) {
      message.value = 'خطا در ارتباط با سرور';
      messageType.value = 'error';
    } finally {
      isUploading.value = false;
    }
  });

  // Profile update handler
  const handleUpdateProfile = $(async () => {
    if (!currentAdmin._id) {
      message.value = 'خطا در دریافت اطلاعات کاربر';
      messageType.value = 'error';
      return;
    }

    // Validation
    if (!newUsername.value.trim() && !newPassword.value) {
      message.value = 'لطفاً حداقل یکی از فیلدها را پر کنید';
      messageType.value = 'error';
      return;
    }

    if (newPassword.value) {
      if (!currentPassword.value) {
        message.value = 'برای تغییر رمز عبور، رمز عبور فعلی را وارد کنید';
        messageType.value = 'error';
        return;
      }
      if (newPassword.value !== confirmPassword.value) {
        message.value = 'رمز عبور جدید و تکرار آن مطابقت ندارند';
        messageType.value = 'error';
        return;
      }
      if (newPassword.value.length < 6) {
        message.value = 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد';
        messageType.value = 'error';
        return;
      }
    }

    isLoading.value = true;
    message.value = '';

    try {
      const updateData: any = {};
      if (newUsername.value.trim()) updateData.username = newUsername.value.trim();
      if (newPassword.value) {
        updateData.currentPassword = currentPassword.value;
        updateData.newPassword = newPassword.value;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/update/${currentAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        message.value = 'تغییرات با موفقیت اعمال شد 🌟';
        messageType.value = 'success';
        
        // Reset form
        newUsername.value = '';
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
        
        // Reload if username changed
        if (updateData.username) {
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setTimeout(() => message.value = '', 3000);
        }
      } else {
        message.value = data.message || 'خطا در اعمال تغییرات';
        messageType.value = 'error';
      }
    } catch (error) {
      message.value = 'خطا در ارتباط با سرور';
      messageType.value = 'error';
    } finally {
      isLoading.value = false;
    }
  });

  // Handle retry
  const handleRetry = $(() => {
    hasError.value = false;
    window.location.reload();
  });

  if (hasError.value) {
    return <ErrorState onRetry={handleRetry} />;
  }

  return (
    <div class="space-y-6">
      {/* Header */}
      <ProfileHeader 
        username={currentAdmin.username}
        role={currentAdmin.role}
        profileImageUrl={previewUrl.value}
      />

      {/* Profile Image Upload */}
      <ProfileImageUpload
        previewUrl={previewUrl.value}
        selectedFile={selectedFile.value}
        isUploading={isUploading.value}
        currentUsername={currentAdmin.username}
        onFileSelect={handleFileSelect}
        onUpload={handleUploadProfileImage}
      />

      {/* Profile Form */}
      <ProfileForm
        currentUsername={currentAdmin.username}
        newUsername={newUsername.value}
        currentPassword={currentPassword.value}
        newPassword={newPassword.value}
        confirmPassword={confirmPassword.value}
        isLoading={isLoading.value}
        message={message.value}
        messageType={messageType.value}
        onUsernameChange={(value) => newUsername.value = value}
        onCurrentPasswordChange={(value) => currentPassword.value = value}
        onNewPasswordChange={(value) => newPassword.value = value}
        onConfirmPasswordChange={(value) => confirmPassword.value = value}
        onSubmit={handleUpdateProfile}
      />

      {/* Security Info */}
      <ProfileSecurityInfo
        userId={currentAdmin._id}
        username={currentAdmin.username}
        role={currentAdmin.role}
      />
    </div>
  );
});