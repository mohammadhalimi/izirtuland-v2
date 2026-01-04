// src/components/admin/dashboard/posts/PostItem.tsx
import { component$ } from '@builder.io/qwik';
import { getFullImageUrl, formatDate } from '~/components/function/function';
import { PostItemProps } from '~/components/types/post';

export const PostItem = component$<PostItemProps>(({ post, onDeleteClick }) => {
  return (
    <div class="p-6 hover:bg-linear-to-r hover:from-green-50/50 hover:to-emerald-50/30 transition-all duration-200 group">
      <div class="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6 rtl:md:space-x-reverse">
        {/* عکس پست */}
        {post.image && (
          <div class="shrink-0">
            <div class="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group-hover:border-green-300 transition-colors duration-200 shadow-sm">
              <img
                src={getFullImageUrl(post.image)}
                alt={post.title}
                width={100}
                height={100}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError$={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div class="hidden w-full h-full bg-linear-to-br from-gray-100 to-gray-200 items-center justify-center text-gray-400">
                📷
              </div>
            </div>
          </div>
        )}

        {/* محتوای پست */}
        <div class="flex-1 min-w-0">
          <h4 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
            {post.title}
          </h4>

          {/* نمایش تگ‌ها */}
          {post.tags && post.tags.length > 0 && (
            <div class="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  class="bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* نمایش متا دیسکریپشن */}
          {post.metaDescription && (
            <p class="text-sm text-gray-500 mb-2 line-clamp-2 bg-linear-to-r from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-200">
              <span class="font-medium text-blue-600">SEO:</span> {post.metaDescription}
            </p>
          )}

          <p class="text-gray-600 mb-3 line-clamp-3">
            {post.content}
          </p>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
              <span>{(post.author && post.author.username) || 'شما'}</span>
              {post.createdAt && (
                <div class="flex items-center space-x-1 rtl:space-x-reverse">
                  <span>📅</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              )}
            </div>

            <div class="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick$={() => onDeleteClick(post)}
                class="p-2 text-red-600 hover:bg-linear-to-r hover:from-red-50 hover:to-orange-50 rounded-lg transition-all duration-200 group/delete"
                title="حذف پست"
              >
                <div class="flex items-center gap-1">
                  <span class="group-hover/delete:scale-110 transition-transform">🗑️</span>
                  <span class="text-xs opacity-0 group-hover/delete:opacity-100 transition-opacity">حذف</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});