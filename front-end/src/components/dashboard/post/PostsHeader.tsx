// src/components/admin/dashboard/posts/PostsHeader.tsx
import { component$ } from '@builder.io/qwik';
import { PostsHeaderProps } from '~/components/types/post';



export const PostsHeader = component$<PostsHeaderProps>(({ postCount }) => {
  return (
    <div class="space-y-6">
      {/* هدر اصلی */}
      <div class="bg-linear-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-2">مدیریت پست‌های من</h2>
            <p class="opacity-90">ایجاد و مدیریت پست‌های شخصی شما</p>
          </div>
          <div class="text-4xl">📝</div>
        </div>
      </div>

      {/* آمار */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-6 text-center group hover:shadow-xl transition-all duration-300">
          <div class="w-12 h-12 bg-linear-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
            📝
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-1">{postCount}</h3>
          <p class="text-green-600 font-medium">پست‌های من</p>
        </div>
      </div>
    </div>
  );
});