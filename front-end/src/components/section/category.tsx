import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

const categories = [
  {
    id: 1,
    name: 'کودهای شیمیایی',
    icon: '🧪',
    href: '/Products',
    description: 'NPK، ریز مغذی‌ها و کودهای کامل'
  },
  {
    id: 2,
    name: 'کودهای ارگانیک',
    icon: '🌿',
    href: '/Products',
    description: 'کمپوست، ورمی کمپوست، کود دامی'
  },
  {
    id: 3,
    name: 'سموم کشاورزی',
    icon: '🐛',
    href: '/Products',
    description: 'حشره‌کش، قارچ‌کش، علف‌کش',
    color: 'from-red-500 to-red-600'
  }
];

export default component$(() => {
  return (
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
          دسته‌بندی محصولات
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center group hover-lift"
            >
              <div class="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                {category.name}
              </h3>
              <p class="text-gray-600 text-sm">
                {category.description}
              </p>
              <div class="mt-4 text-green-600 font-semibold text-sm transform group-hover:translate-x-2 transition-transform duration-300">
                مشاهده محصولات →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});