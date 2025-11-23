import { component$, useResource$, Resource } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import type { Post } from '~/components/types/posts';

export default component$(() => {
    const latestPostsResource = useResource$<Post[]>(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/posts');
            if (response.ok) {
                const posts: Post[] = await response.json();
                // مرتب سازی بر اساس تاریخ (جدیدترین اول) - با بررسی undefined
                const sortedPosts = posts.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
                // برگرداندن 3 پست آخر
                return sortedPosts.slice(0, 3);
            }
            return [];
        } catch (error) {
            console.error('Error fetching latest posts:', error);
            return [];
        }
    });

    const getFullImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000${imagePath}`;
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'تاریخ نامشخص';
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

    const getCategoryIcon = (tags: string[] | undefined) => {
        if (!tags || tags.length === 0) return '📚';
        
        const firstTag = tags[0].toLowerCase();
        if (firstTag.includes('شیمیایی') || firstTag.includes('npk')) return '🧪';
        if (firstTag.includes('ارگانیک') || firstTag.includes('طبیعی')) return '🌿';
        if (firstTag.includes('آفات') || firstTag.includes('سم')) return '🐛';
        return '📚';
    };

    const getCategoryName = (tags: string[] | undefined) => {
        if (!tags || tags.length === 0) return 'آموزشی';
        return tags[0];
    };

    return (
        <section class="py-16 bg-white">
            <div class="container mx-auto px-4">
                {/* هدر بخش */}
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        آخرین مقالات تخصصی
                    </h2>
                    <p class="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        با مطالعه جدیدترین مقالات تخصصی ما، از آخرین یافته‌های علمی و روش‌های نوین کشاورزی مطلع شوید و 
                        <span class="text-green-600 font-semibold"> برداشت خود را چندین برابر کنید</span>
                    </p>
                </div>

                <Resource
                    value={latestPostsResource}
                    onPending={() => (
                        <div class="text-center py-12">
                            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            <p class="mt-4 text-gray-600">در حال دریافت مقالات...</p>
                        </div>
                    )}
                    onRejected={() => (
                        <div class="text-center py-12">
                            <div class="text-6xl mb-4">❌</div>
                            <h3 class="text-2xl font-bold text-gray-800 mb-4">خطا در دریافت مقالات</h3>
                            <p class="text-gray-600 mb-6">متاسفانه مشکلی در دریافت مقالات پیش آمده است</p>
                        </div>
                    )}
                    onResolved={(latestPosts) => {
                        // تقسیم پست‌ها به featured و معمولی
                        const featuredPosts = latestPosts.slice(0, 2); // دو پست اول featured
                        const regularPosts = latestPosts.slice(2); // پست سوم معمولی

                        return (
                            <>
                                {/* مقالات Featured */}
                                {featuredPosts.length > 0 && (
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                                        {featuredPosts.map((post) => (
                                            <div 
                                                key={post._id}
                                                class="bg-linear-to-br from-green-50 to-white rounded-2xl shadow-lg hover-lift transition-all duration-300 border border-green-100 overflow-hidden group"
                                            >
                                                <div class="flex flex-col md:flex-row">
                                                    {/* تصویر */}
                                                    <div class="md:w-2/5 bg-linear-to-br from-green-200 to-green-300 flex items-center justify-center min-h-48">
                                                        {post.image ? (
                                                            <img
                                                                src={getFullImageUrl(post.image)}
                                                                alt={post.title}
                                                                class="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div class="text-6xl">
                                                                {getCategoryIcon(post.tags)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* محتوا */}
                                                    <div class="md:w-3/5 p-6">
                                                        {/* برچسب‌ها */}
                                                        <div class="flex items-center justify-between mb-3">
                                                            <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                                {getCategoryName(post.tags)}
                                                            </span>
                                                            <span class="text-sm text-gray-500">
                                                                {Math.ceil(post.content.length / 300)} دقیقه
                                                            </span>
                                                        </div>

                                                        {/* عنوان */}
                                                        <h3 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                                                            {post.title}
                                                        </h3>

                                                        {/* خلاصه */}
                                                        <p class="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                                                            {post.metaDescription || truncateContent(post.content, 120)}
                                                        </p>

                                                        {/* تگ‌ها */}
                                                        {post.tags && post.tags.length > 0 && (
                                                            <div class="flex flex-wrap gap-2 mb-4">
                                                                {post.tags.slice(0, 3).map((tag, index) => (
                                                                    <span 
                                                                        key={index}
                                                                        class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-green-100 hover:text-green-700 transition-colors duration-200"
                                                                    >
                                                                        #{tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* اطلاعات نویسنده و تاریخ */}
                                                        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                                                            <div class="flex items-center space-x-2">
                                                                <img
                                                                    src={getFullImageUrl(post.author.profileImage)}
                                                                    alt={post.author.username}
                                                                    class="w-8 h-8 rounded-full object-cover"
                                                                />
                                                                <span class="text-sm text-gray-600">
                                                                    {post.author?.username || 'تیم کشاورزی'}
                                                                </span>
                                                            </div>
                                                            <span class="text-sm text-gray-500">
                                                                {formatDate(post.createdAt)}
                                                            </span>
                                                        </div>

                                                        {/* دکمه مطالعه */}
                                                        <div class="mt-4">
                                                            <a 
                                                                href={`/Blog/${post._id}`}
                                                                class="inline-flex items-center space-x-2 rtl:space-x-reverse text-green-600 hover:text-green-700 font-semibold transition-colors duration-300 group/btn"
                                                            >
                                                                <span>مطالعه مقاله</span>
                                                                <svg class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* مقالات معمولی */}
                                {regularPosts.length > 0 && (
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                        {regularPosts.map((post) => (
                                            <div 
                                                key={post._id}
                                                class="bg-white rounded-2xl shadow-md hover-lift transition-all duration-300 border border-gray-100 overflow-hidden group"
                                            >
                                                {/* تصویر */}
                                                <div class="h-40 bg-linear-to-br from-green-100 to-green-200 flex items-center justify-center overflow-hidden">
                                                    {post.image ? (
                                                        <img
                                                            src={getFullImageUrl(post.image)}
                                                            alt={post.title}
                                                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div class="text-4xl">
                                                            {getCategoryIcon(post.tags)}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* محتوا */}
                                                <div class="p-5">
                                                    {/* برچسب و زمان مطالعه */}
                                                    <div class="flex items-center justify-between mb-3">
                                                        <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                                            {getCategoryName(post.tags)}
                                                        </span>
                                                        <span class="text-xs text-gray-500">
                                                            {Math.ceil(post.content.length / 300)} دقیقه
                                                        </span>
                                                    </div>

                                                    {/* عنوان */}
                                                    <h3 class="font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-2 h-14">
                                                        {post.title}
                                                    </h3>

                                                    {/* خلاصه */}
                                                    <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                                        {post.metaDescription || truncateContent(post.content, 100)}
                                                    </p>

                                                    {/* اطلاعات پایین */}
                                                    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                                                        <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                                            <img
                                                                src={getFullImageUrl(post.author.profileImage)}
                                                                alt={post.author.username}
                                                                class="w-6 h-6 rounded-full object-cover"
                                                            />
                                                            <span class="text-xs text-gray-600">
                                                                {post.author?.username || 'تیم کشاورزی'}
                                                            </span>
                                                        </div>
                                                        <span class="text-xs text-gray-500">
                                                            {formatDate(post.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* حالت عدم وجود پست */}
                                {latestPosts.length === 0 && (
                                    <div class="text-center py-12">
                                        <div class="text-6xl mb-4">📝</div>
                                        <h3 class="text-2xl font-bold text-gray-800 mb-4">هنوز مقاله‌ای منتشر نشده است</h3>
                                        <p class="text-gray-600 mb-6">به زودی مقالات تخصصی در زمینه کشاورزی و کود منتشر خواهند شد</p>
                                    </div>
                                )}

                                {/* دکمه مشاهده همه مقالات */}
                                {latestPosts.length > 0 && (
                                    <div class="text-center">
                                        <a 
                                            href="/Blog"
                                            class="inline-flex items-center space-x-2 rtl:space-x-reverse bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-lg font-semibold hover-lift transition-all duration-300 transform hover:scale-105 shadow-lg"
                                        >
                                            <span>مشاهده همه مقالات</span>
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </a>
                                    </div>
                                )}
                            </>
                        );
                    }}
                />
            </div>
        </section>
    );
});