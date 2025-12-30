// src/components/admin/dashboard/posts/PostsList.tsx
import { component$ } from '@builder.io/qwik';
import { PostItem } from './PostItem';
import { PostsListProps } from '~/components/types/post';

export const PostsList = component$<PostsListProps>(({ posts, onDeleteClick }) => {
  if (posts.length === 0) {
    return (
      <div class="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-800">پست‌های من (۰)</h3>
          <p class="text-gray-600 mt-1">لیست پست‌های ایجاد شده توسط شما</p>
        </div>

        <div class="text-center py-12">
          <div class="text-6xl mb-4 text-gray-300">📝</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">هنوز پستی ایجاد نکرده‌اید</h3>
          <p class="text-gray-600">اولین پست خود را با استفاده از فرم بالا ایجاد کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div class="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-800">پست‌های من ({posts.length})</h3>
            <p class="text-gray-600 mt-1">لیست پست‌های ایجاد شده توسط شما</p>
          </div>
          <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {posts.length} پست
          </span>
        </div>
      </div>

      <div class="divide-y divide-gray-200">
        {posts.map((post) => (
          <PostItem key={post._id} post={post} onDeleteClick={onDeleteClick} />
        ))}
      </div>
    </div>
  );
});