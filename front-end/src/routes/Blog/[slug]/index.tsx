// src/routes/blog/[slug]/index.tsx
import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import type { Post } from '~/components/types/posts';
import logoC from '../../../media/j529981_photo_2025-01-19_19-18-17.webp'
import { API_BASE_URL } from '~/config/api';

export const usePost = routeLoader$(async ({ params, status }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${params.slug}`);
        if (response.ok) {
            const post: Post = await response.json();
            return post;
        } else {
            status(404);
            return null;
        }
    } catch (error) {
        console.error('Error fetching post:', error);
        status(500);
        return null;
    }
});

export const head: DocumentHead = ({ resolveValue }) => {
  const post = resolveValue(usePost);

  if (!post) return {
    title: "مقاله یافت نشد - پربار باغستان",
    meta: [
      {
        name: "description",
        content: "مقاله مورد نظر یافت نشد"
      }
    ]
  }

  return {
    title: `${post.title} - پربار باغستان`,
    meta: [
      {
        name: "description",
        content: post.metaDescription || post.content.slice(0, 160)
      },
      {
        name: "keywords",
        content: post.tags ? post.tags.join(', ') : 'کشاورزی, کود, باغداری'
      },
      {
        property: "og:title",
        content: post.title
      },
      {
        property: "og:description",
        content: post.metaDescription || post.content.slice(0, 160)
      },
      {
        property: "og:image",
        content: post.image ? `${API_BASE_URL}${post.image}` : ''
      },
      {
        property: "og:type",
        content: "article"
      }
    ]
  };
};

export default component$(() => {
    const postData = usePost();

    if (!postData.value) {
        return (
            <div class="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <div class="text-center">
                    <div class="text-6xl mb-4">❌</div>
                    <h1 class="text-2xl font-bold text-gray-800 mb-4">مقاله یافت نشد</h1>
                    <p class="text-gray-600 mb-6">مقاله مورد نظر وجود ندارد یا حذف شده است.</p>
                    <a href="/blog" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200">
                        بازگشت به بلاگ
                    </a>
                </div>
            </div>
        );
    }

    const post = postData.value;

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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Schema.org JSON-LD برای سئو
    const articleStructuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "image": post.image ? getFullImageUrl(post.image) : '',
        "datePublished": post.createdAt,
        "dateModified": post.createdAt,
        "author": {
            "@type": "Person",
            "name": post.author?.username || "تیم کشاورزی"
        },
        "publisher": {
            "@type": "Organization",
            "name": "پربار باغستان",
            "logo": {
                "@type": "ImageObject",
                "url": `${API_BASE_URL}` + logoC
            }
        },
        "description": post.metaDescription || post.content.slice(0, 160)
    };

    return (
        <div class="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
            {/* Schema.org JSON-LD */}
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={JSON.stringify(articleStructuredData)}
            />

            {/* هدر */}
            <header class="bg-white shadow-sm border-b border-green-200">
                <div class="container mx-auto px-4 py-4">
                    <div class="flex items-center justify-between">
                        <a href="/Blog" class="flex items-center space-x-3 rtl:space-x-reverse text-green-600 hover:text-green-700 transition-colors duration-200">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>بازگشت به بلاگ</span>
                        </a>

                        <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                            <img
                                src={logoC}
                                alt="پربار باغستان"
                                height={100} 
                                width={100} 
                                loading="eager"
                                decoding="async"
                                class="w-16 h-16 object-cover"
                            />
                            <span class="font-bold text-gray-800">پربار باغستان</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* محتوای مقاله */}
            <article class="container mx-auto px-4 py-8 max-w-4xl">
                {/* Breadcrumb برای سئو */}
                <nav aria-label="breadcrumb" class="text-sm text-gray-500 mb-6 flex items-center space-x-2 rtl:space-x-reverse">
                    <a href="/" class="hover:text-green-600 transition-colors duration-200">خانه</a>
                    <span class="text-gray-300">/</span>
                    <a href="/Blog" class="hover:text-green-600 transition-colors duration-200">بلاگ</a>
                    <span class="text-gray-300">/</span>
                    <span class="text-green-600 font-medium truncate">{post.title}</span>
                </nav>

                {/* هدر مقاله */}
                <header class="text-center mb-12">
                    <h1 class="text-4xl font-bold text-gray-800 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* تگ‌ها */}
                    {post.tags && post.tags.length > 0 && (
                        <div class="flex flex-wrap justify-center gap-2 mb-6">
                            {post.tags.map((tag, index) => (
                                <span 
                                    key={index}
                                    class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm border border-green-200 hover:bg-green-200 transition-colors duration-200"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div class="flex items-center justify-center space-x-6 text-gray-500">
                        <div class="flex items-center space-x-2">
                            <img
                                src={getFullImageUrl(post.author.profileImage)}
                                alt={post.author.username}
                                class="w-8 h-8 rounded-full object-cover"
                                width={32}
                                height={32}
                            />
                            <span class="font-medium">{(post.author && post.author.username) || 'تیم کشاورزی'}</span>
                        </div>

                        {post.createdAt && (
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* عکس اصلی */}
                {post.image && (
                    <div class="mb-8 rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={getFullImageUrl(post.image)}
                            alt={post.title}
                            class="w-full h-96 object-cover"
                            width={800}
                            height={400}
                            loading="eager"
                        />
                    </div>
                )}

                {/* محتوای مقاله */}
                <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-8 mb-8">
                    <div class="prose prose-lg max-w-none prose-green">
                        <div class="whitespace-pre-line leading-8 text-justify text-gray-700 text-lg">
                            {post.content}
                        </div>
                    </div>
                </div>

                {/* اطلاعات نویسنده (برای E-E-A-T سئو) */}
                <div class="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-8">
                    <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>درباره نویسنده</span>
                    </h3>
                    <div class="flex items-center space-x-4 rtl:space-x-reverse">
                        <img
                            src={getFullImageUrl(post.author.profileImage)}
                            alt={post.author.username}
                            class="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                            width={64}
                            height={64}
                        />
                        <div>
                            <h4 class="font-bold text-gray-800 text-lg">{(post.author && post.author.username) || 'تیم کشاورزی'}</h4>
                            <p class="text-gray-600 text-sm mt-1">نویسنده متخصص در زمینه کشاورزی و کودهای ارگانیک با سال‌ها تجربه عملی</p>
                        </div>
                    </div>
                </div>

                {/* دکمه بازگشت */}
                <div class="text-center">
                    <a
                        href="/Blog"
                        class="inline-flex items-center space-x-2 rtl:space-x-reverse bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>بازگشت به لیست مقالات</span>
                    </a>
                </div>
            </article>

            {/* فوتر */}
            <footer class="bg-white border-t border-green-200 mt-16">
                <div class="container mx-auto px-4 py-8">
                    <div class="text-center text-gray-600">
                        <p>© 2024 پربار باغستان - تمام حقوق محفوظ است</p>
                    </div>
                </div>
            </footer>
        </div>
    );
});