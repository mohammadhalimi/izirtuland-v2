// src/routes/blog/index.tsx
import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { Post } from '~/components/types/posts';
import logoC from '../../media/j529981_photo_2025-01-19_19-18-17.webp'
import { API_BASE_URL } from '~/config/api';

// Loader برای دریافت تمام پست‌ها
export const usePosts = routeLoader$(async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        if (response.ok) {
            const posts: Post[] = await response.json();
            return posts;
        }
        return [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
});

export default component$(() => {
    const postsData = usePosts();
    const searchTerm = useSignal('');
    const filteredPosts = useSignal<Post[]>([]);

    useTask$(({ track }) => {
        track(() => postsData.value);
        track(() => searchTerm.value);

        if (postsData.value) {
            if (searchTerm.value) {
                filteredPosts.value = postsData.value.filter(post =>
                    post.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                    post.content.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                    (post.metaDescription && post.metaDescription.toLowerCase().includes(searchTerm.value.toLowerCase()))
                );
            } else {
                filteredPosts.value = postsData.value;
            }
        }
    });

    const getFullImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const truncateContent = (content: string, maxLength: number = 120) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    return (
        <div class="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
            {/* هدر */}
            <header class="bg-white shadow-sm border-b border-green-200">
                <div class="container mx-auto px-4 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3 rtl:space-x-reverse">
                            <img
                                src={logoC}
                                alt="My SVG"
                                height={100} width={100} loading="eager"
                                decoding="async"
                                class="w-16 h-16 object-cover"
                            />
                            <div>
                                <h1 class="text-xl font-bold text-gray-800">بلاگ کودهای کشاورزی</h1>
                                <p class="text-green-600 text-sm">مقالات تخصصی در زمینه کشاورزی و کود</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* جستجو */}
            <div class="container mx-auto px-4 py-6">
                <div class="max-w-2xl mx-auto mb-6">
                    <div class="relative">
                        <input
                            type="text"
                            value={searchTerm.value}
                            onInput$={(e) => searchTerm.value = (e.target as HTMLInputElement).value}
                            placeholder="جستجو در مقالات..."
                            class="w-full px-5 py-3 pr-12 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm text-sm"
                        />
                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                            🔍
                        </div>
                    </div>
                </div>

                {/* لیست پست‌ها */}
                <div class="max-w-6xl mx-auto">
                    {filteredPosts.value.length === 0 ? (
                        <div class="text-center py-12">
                            <div class="text-4xl mb-3">📝</div>
                            <h2 class="text-lg font-bold text-gray-800 mb-3">
                                {searchTerm.value ? 'مقاله‌ای یافت نشد' : 'هنوز مقاله‌ای وجود ندارد'}
                            </h2>
                            <p class="text-gray-600 text-sm">
                                {searchTerm.value ? 'لطفاً عبارت جستجوی خود را تغییر دهید' : 'به زودی مقالات جدید منتشر خواهند شد'}
                            </p>
                        </div>
                    ) : (
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.value.map((post) => (
                                <a
                                    key={post._id}
                                    href={`/Blog/${post._id}`}
                                    class="bg-white rounded-xl shadow-md border border-green-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-102 group"
                                >
                                    {/* عکس پست */}
                                    {post.image && (
                                        <div class="h-40 overflow-hidden">
                                            <img
                                                src={getFullImageUrl(post.image)}
                                                alt={post.title}
                                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}

                                    {/* محتوای پست */}
                                    <div class="p-4">
                                        <h3 class="text-base font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors duration-200 leading-tight">
                                            {post.title}
                                        </h3>

                                        {post.metaDescription && (
                                            <p class="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                                                {post.metaDescription}
                                            </p>
                                        )}

                                        <p class="text-gray-600 text-xs mb-3 line-clamp-3 leading-relaxed">
                                            {truncateContent(post.content, 100)}
                                        </p>

                                        {/* تگ‌ها */}
                                        {post.tags && post.tags.length > 0 && (
                                            <div class="mb-3 flex flex-wrap gap-1">
                                                {post.tags.slice(0, 3).map((tag, index) => (
                                                    <span 
                                                        key={index}
                                                        class="inline-block bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs border border-green-200"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {post.tags.length > 3 && (
                                                    <span class="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                                                        +{post.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div class="flex items-center space-x-2 text-xs text-gray-500">
                                                <img
                                                    src={getFullImageUrl(post.author.profileImage)}
                                                    alt={post.author.username}
                                                    class="w-6 h-6 rounded-full object-cover"
                                                />
                                                <span>{(post.author && post.author.username) || 'تیم کشاورزی'}</span>
                                            </div>
                                            {post.createdAt && (
                                                <span class="text-xs text-gray-400">
                                                    {formatDate(post.createdAt)}
                                                </span>
                                            )}
                                        </div>

                                        <div class="mt-3 flex justify-end">
                                            <span class="text-green-600 text-xs font-medium group-hover:text-green-700 transition-colors duration-200">
                                                مطالعه بیشتر →
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});