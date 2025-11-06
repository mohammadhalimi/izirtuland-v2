import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

const blogPosts = [
  {
    id: 1,
    title: 'روش صحیح استفاده از کودهای NPK در کشاورزی مدرن',
    excerpt: 'آموزش کامل نحوه مصرف، زمان‌بندی و مقدار مناسب کودهای NPK برای محصولات مختلف با توجه به شرایط خاک و آب و هوا...',
    image: '/images/blog/npk-usage.jpg',
    category: 'کودهای شیمیایی',
    readTime: '۸ دقیقه',
    date: '۱۴۰۲/۱۰/۱۵',
    author: 'دکتر محمدی',
    tags: ['کود شیمیایی', 'NPK', 'تغذیه گیاه'],
    featured: true
  },
  {
    id: 2,
    title: 'مزایای استفاده از کودهای ارگانیک در باغداری',
    excerpt: 'چرا کودهای طبیعی و ارگانیک برای سلامت خاک و محصولات بهتر هستند؟ بررسی کامل فواید و روش‌های تولید کودهای ارگانیک...',
    image: '/images/blog/organic-benefits.jpg',
    category: 'کودهای ارگانیک',
    readTime: '۶ دقیقه',
    date: '۱۴۰۲/۱۰/۱۲',
    author: 'مهندس رضایی',
    tags: ['ارگانیک', 'کود طبیعی', 'سلامت خاک'],
    featured: true
  },
  {
    id: 3,
    title: 'راهنمای کامل مبارزه با آفات با سموم طبیعی',
    excerpt: 'آموزش ساخت و استفاده از سموم ارگانیک برای مقابله با آفات رایج در باغ و مزرعه بدون آسیب به محیط زیست...',
    image: '/images/blog/organic-pesticides.jpg',
    category: 'سموم کشاورزی',
    readTime: '۱۰ دقیقه',
    date: '۱۴۰۲/۱۰/۰۸',
    author: 'دکتر حسینی',
    tags: ['آفات', 'سم طبیعی', 'محیط زیست'],
    featured: false
  },
  {
    id: 4,
    title: 'علائم کمبود عناصر غذایی در درختان میوه',
    excerpt: 'چگونه از روی ظاهر برگ‌ها و میوه‌ها، کمبود عناصر غذایی را تشخیص دهیم و راهکارهای درمان آن چیست؟...',
    image: '/images/blog/nutrient-deficiency.jpg',
    category: 'آموزشی',
    readTime: '۱۲ دقیقه',
    date: '۱۴۰۲/۱۰/۰۵',
    author: 'مهندس کریمی',
    tags: ['عناصر غذایی', 'درمان', 'پیشگیری'],
    featured: false
  },
  {
    id: 5,
    title: 'تاثیر pH خاک بر جذب کودها و راهکارهای تنظیم آن',
    excerpt: 'بررسی رابطه مستقیم اسیدیته خاک با جذب عناصر غذایی و آموزش روش‌های ساده برای تنظیم pH خاک...',
    image: '/images/blog/soil-ph.jpg',
    category: 'آموزشی',
    readTime: '۷ دقیقه',
    date: '۱۴۰۲/۱۰/۰۲',
    author: 'دکتر احمدی',
    tags: ['pH خاک', 'جذب کود', 'تنظیم اسیدیته'],
    featured: false
  },
  {
    id: 6,
    title: 'کوددهی زمستانه درختان: زمان طلایی برای برداشت پربار',
    excerpt: 'چرا کوددهی در زمستان اهمیت دارد و چه نوع کودهایی برای این فصل مناسب هستند؟ راهنمای کامل کوددهی زمستانه...',
    image: '/images/blog/winter-fertilizing.jpg',
    category: 'کودهای شیمیایی',
    readTime: '۵ دقیقه',
    date: '۱۴۰۲/۰۹/۲۸',
    author: 'مهندس محمودی',
    tags: ['زمستان', 'کوددهی', 'درختان میوه'],
    featured: false
  }
];

export default component$(() => {
  return (
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        {/* هدر بخش */}
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            دانش باغداری خود را ارتقا دهید
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            با مطالعه مقالات تخصصی ما، از آخرین یافته‌های علمی و روش‌های نوین کشاورزی مطلع شوید و 
            <span class="text-green-600 font-semibold"> برداشت خود را چندین برابر کنید</span>
          </p>
        </div>

        {/* مقالات Featured */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {blogPosts.filter(post => post.featured).map((post) => (
            <div 
              key={post.id}
              class="bg-linear-to-br from-green-50 to-white rounded-2xl shadow-lg hover-lift transition-all duration-300 border border-green-100 overflow-hidden group"
            >
              <div class="flex flex-col md:flex-row">
                {/* تصویر */}
                <div class="md:w-2/5 bg-linear-to-br from-green-200 to-green-300 flex items-center justify-center p-8">
                  <div class="text-6xl">
                    {post.category === 'کودهای شیمیایی' && '🧪'}
                    {post.category === 'کودهای ارگانیک' && '🌿'}
                    {post.category === 'سموم کشاورزی' && '🐛'}
                    {post.category === 'آموزشی' && '📚'}
                  </div>
                </div>
                
                {/* محتوا */}
                <div class="md:w-3/5 p-6">
                  {/* برچسب‌ها */}
                  <div class="flex items-center justify-between mb-3">
                    <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                    <span class="text-sm text-gray-500">{post.readTime}</span>
                  </div>

                  {/* عنوان */}
                  <h3 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* خلاصه */}
                  <p class="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* تگ‌ها */}
                  <div class="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-green-100 hover:text-green-700 transition-colors duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* اطلاعات نویسنده و تاریخ */}
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="flex items-center space-x-2 rtl:space-x-reverse">
                      <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {post.author.charAt(0)}
                      </div>
                      <span class="text-sm text-gray-600">{post.author}</span>
                    </div>
                    <span class="text-sm text-gray-500">{post.date}</span>
                  </div>

                  {/* دکمه مطالعه */}
                  <div class="mt-4">
                    <Link 
                      href={`/blog/${post.id}`}
                      class="inline-flex items-center space-x-2 rtl:space-x-reverse text-green-600 hover:text-green-700 font-semibold transition-colors duration-300 group/btn"
                    >
                      <span>مطالعه مقاله</span>
                      <svg class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* مقالات معمولی */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.filter(post => !post.featured).map((post) => (
            <div 
              key={post.id}
              class="bg-white rounded-2xl shadow-md hover-lift transition-all duration-300 border border-gray-100 overflow-hidden group"
            >
              {/* تصویر */}
              <div class="h-40 bg-linear-to-br from-green-100 to-green-200 flex items-center justify-center">
                <div class="text-4xl">
                  {post.category === 'کودهای شیمیایی' && '🧪'}
                  {post.category === 'کودهای ارگانیک' && '🌿'}
                  {post.category === 'سموم کشاورزی' && '🐛'}
                  {post.category === 'آموزشی' && '📚'}
                </div>
              </div>

              {/* محتوا */}
              <div class="p-5">
                {/* برچسب و زمان مطالعه */}
                <div class="flex items-center justify-between mb-3">
                  <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                    {post.category}
                  </span>
                  <span class="text-xs text-gray-500">{post.readTime}</span>
                </div>

                {/* عنوان */}
                <h3 class="font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-2 h-14">
                  {post.title}
                </h3>

                {/* خلاصه */}
                <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* اطلاعات پایین */}
                <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <span class="text-xs text-gray-600">{post.author}</span>
                  </div>
                  <span class="text-xs text-gray-500">{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* دکمه مشاهده همه مقالات */}
        <div class="text-center">
          <Link 
            href="/blog"
            class="inline-flex items-center space-x-2 rtl:space-x-reverse gradient-bg hover:gradient-bg-hover text-white px-8 py-4 rounded-lg font-semibold hover-lift transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>مشاهده همه مقالات</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>

        {/* خبرنامه */}
        <div class="mt-16 bg-linear-to-r from-green-500 to-green-600 rounded-2xl p-8 text-center text-white">
          <h3 class="text-2xl font-bold mb-4">عضویت در خبرنامه تخصصی</h3>
          <p class="text-green-100 mb-6 max-w-2xl mx-auto">
            با عضویت در خبرنامه، از آخرین مقالات آموزشی، تخفیف‌های ویژه و اخبار حوزه کشاورزی مطلع شوید
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="آدرس ایمیل خود را وارد کنید"
              class="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none ring-2 ring-green-200"
            />
            <button class="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover-lift whitespace-nowrap">
              عضویت در خبرنامه
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});