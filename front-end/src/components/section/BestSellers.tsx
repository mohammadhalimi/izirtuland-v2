import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

const bestSellers = [
  {
    id: 1,
    name: 'کود کامل NPK 20-20-20',
    price: '۱۵۰,۰۰۰',
    originalPrice: '۱۸۰,۰۰۰',
    image: '/images/npk-fertilizer.jpg',
    category: 'شیمیایی',
    isSale: true,
    rating: 4.8,
    reviews: 47
  },
  {
    id: 2,
    name: 'ورمی کمپوست ارگانیک',
    price: '۹۵,۰۰۰',
    originalPrice: null,
    image: '/images/vermicompost.jpg',
    category: 'ارگانیک',
    isSale: false,
    rating: 4.9,
    reviews: 32
  },
  {
    id: 3,
    name: 'کود دامی پوسیده',
    price: '۷۵,۰۰۰',
    originalPrice: null,
    image: '/images/manure.jpg',
    category: 'ارگانیک',
    isSale: false,
    rating: 4.7,
    reviews: 28
  },
  {
    id: 4,
    name: 'سم ارگانیک نیم آزال',
    price: '۱۲۰,۰۰۰',
    originalPrice: '۱۴۰,۰۰۰',
    image: '/images/organic-pesticide.jpg',
    category: 'سموم',
    isSale: true,
    rating: 4.6,
    reviews: 19
  },
  {
    id: 5,
    name: 'کود مایع جلبک دریایی',
    price: '۸۵,۰۰۰',
    originalPrice: null,
    image: '/images/seaweed.jpg',
    category: 'ارگانیک',
    isSale: false,
    rating: 4.8,
    reviews: 41
  },
  {
    id: 6,
    name: 'کود آهن کلاته',
    price: '۱۳۰,۰۰۰',
    originalPrice: '۱۵۰,۰۰۰',
    image: '/images/iron-fertilizer.jpg',
    category: 'شیمیایی',
    isSale: true,
    rating: 4.5,
    reviews: 23
  },
  {
    id: 7,
    name: 'کود مرغی گرانوله',
    price: '۶۵,۰۰۰',
    originalPrice: null,
    image: '/images/poultry-manure.jpg',
    category: 'ارگانیک',
    isSale: false,
    rating: 4.4,
    reviews: 35
  },
  {
    id: 8,
    name: 'قارچ کش سیستمیک',
    price: '۱۶۰,۰۰۰',
    originalPrice: '۱۹۰,۰۰۰',
    image: '/images/fungicide.jpg',
    category: 'سموم',
    isSale: true,
    rating: 4.7,
    reviews: 16
  }
];

export default component$(() => {
  return (
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        {/* هدر بخش */}
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            پرفروش‌های پربار باغستان
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            محصولات محبوب و پرطرفدار که توسط کشاورزان و باغداران عزیز انتخاب شده‌اند
          </p>
        </div>

        {/* شبکه محصولات */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {bestSellers.map((product) => (
            <div 
              key={product.id}
              class="bg-white rounded-2xl shadow-lg hover-lift transition-all duration-300 border border-gray-100 overflow-hidden group"
            >
              {/* تصویر محصول */}
              <div class="relative overflow-hidden">
                <div class="w-full h-48 bg-linear-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <div class="text-4xl">
                    {product.category === 'شیمیایی' && '🧪'}
                    {product.category === 'ارگانیک' && '🌿'}
                    {product.category === 'سموم' && '🐛'}
                  </div>
                </div>
                
                {/* برچسب‌ها */}
                <div class="absolute top-3 left-3 flex flex-col space-y-2">
                  {product.isSale && (
                    <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      تخفیف ویژه
                    </span>
                  )}
                  <span class={`
                    px-3 py-1 rounded-full text-sm font-semibold text-white shadow-lg
                    ${product.category === 'شیمیایی' ? 'bg-blue-500' : ''}
                    ${product.category === 'ارگانیک' ? 'bg-green-500' : ''}
                    ${product.category === 'سموم' ? 'bg-orange-500' : ''}
                  `}>
                    {product.category}
                  </span>
                </div>

                {/* دکمه سریع افزودن به سبد */}
                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button class="bg-white hover:bg-green-500 text-green-600 hover:text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* اطلاعات محصول */}
              <div class="p-4">
                <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
                  {product.name}
                </h3>
                
                {/* امتیاز و نظرات */}
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-1 rtl:space-x-reverse">
                    <div class="flex text-yellow-400">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span class="text-sm text-gray-500">({product.rating})</span>
                  </div>
                  <span class="text-sm text-gray-500">{product.reviews} نظر</span>
                </div>
                
                {/* قیمت */}
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="text-lg font-bold text-green-600">
                      {product.price} تومان
                    </span>
                    {product.originalPrice && (
                      <span class="text-sm text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* دکمه افزودن به سبد خرید */}
                <button class="w-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover-lift transform hover:scale-105 flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <span>افزودن به سبد خرید</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* دکمه مشاهده همه محصولات */}
        <div class="text-center">
          <Link 
            href="/products"
            class="inline-flex items-center space-x-2 rtl:space-x-reverse gradient-bg hover:gradient-bg-hover text-white px-8 py-4 rounded-lg font-semibold hover-lift transition-all duration-300 transform hover:scale-105"
          >
            <span>مشاهده همه محصولات</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
});