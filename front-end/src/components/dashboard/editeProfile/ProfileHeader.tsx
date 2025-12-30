// src/components/admin/dashboard/profile/ProfileHeader.tsx
import { component$ } from '@builder.io/qwik';
import { ProfileHeaderProps } from '~/components/types/editeProfile';


export const ProfileHeader = component$<ProfileHeaderProps>(({
  username,
  role,
  profileImageUrl
}) => {
  const getRoleLabel = (role: string) => {
    return role === 'superadmin' ? 'سوپر ادمین 🌟' : 'ادمین 👨‍💼';
  };

  return (
    <div class="bg-linear-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Title Section */}
        <div class="text-center md:text-right">
          <h2 class="text-2xl md:text-3xl font-bold mb-2">ویرایش پروفایل</h2>
          <p class="opacity-90">مدیریت اطلاعات حساب کاربری پنل کودهای کشاورزی</p>
        </div>

        {/* User Info Section */}
        <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          {/* Profile Image */}
          <div class="relative">
            <div class="w-16 h-16 rounded-full border-3 border-white/30 overflow-hidden shadow-lg">
              {profileImageUrl ? (
                <img 
                  src={profileImageUrl} 
                  alt={username}
                  class="w-full h-full object-cover"
                  onError$={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div class={`w-full h-full flex items-center justify-center text-white font-bold text-xl ${profileImageUrl ? 'hidden' : ''}`}>
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
            
            {/* Role Badge */}
            <div class="absolute -bottom-2 -right-2 bg-linear-to-r from-yellow-400 to-orange-400 text-white rounded-full px-3 py-1 text-xs font-bold shadow-md">
              {role === 'superadmin' ? '👑' : '⭐'}
            </div>
          </div>

          {/* User Details */}
          <div class="text-right">
            <p class="text-lg font-semibold mb-1">{username}</p>
            <p class="text-sm opacity-90">{getRoleLabel(role)}</p>
            <p class="text-xs opacity-75 mt-1 bg-white/20 px-2 py-0.5 rounded-full inline-block">
              حساب فعال
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div class="mt-6 flex flex-wrap gap-3">
        <div class="bg-white/10 px-3 py-1.5 rounded-full text-sm">
          <span class="opacity-80 mr-1">🛡️</span>
          <span>حساب امن</span>
        </div>
        <div class="bg-white/10 px-3 py-1.5 rounded-full text-sm">
          <span class="opacity-80 mr-1">📊</span>
          <span>پنل مدیریت</span>
        </div>
        <div class="bg-white/10 px-3 py-1.5 rounded-full text-sm">
          <span class="opacity-80 mr-1">✅</span>
          <span>تأیید شده</span>
        </div>
      </div>
    </div>
  );
});