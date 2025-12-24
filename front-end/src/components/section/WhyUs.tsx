import { component$ } from '@builder.io/qwik';

const features = [
  {
    id: 1,
    icon: '🎓',
    title: 'مشاوره رایگان',
    description: 'توسط کارشناسان مجرب کشاورزی با سال‌ها تجربه عملی',
    details: ['مشاوره تلفنی و آنلاین', 'برنامه تغذیه اختصاصی', 'پشتیبانی دائمی']
  },
  {
    id: 2,
    icon: '✓',
    title: 'ضمانت کیفیت',
    description: 'اصالت و کیفیت تمام محصولات با گواهی استاندارد',
    details: ['تضمین اصالت کالا', 'گواهی سلامت', 'بازگشت وجه در صورت عدم رضایت']
  },
  {
    id: 3,
    icon: '🚚',
    title: 'ارسال سریع',
    description: 'تحویل در سریع‌ترین زمان ممکن به سراسر کشور',
    details: ['ارسال اکسپرس', 'پیک موتوری در شهر', 'تحویل 24 ساعته']
  },
  {
    id: 4,
    icon: '💵',
    title: 'قیمت مناسب',
    description: 'قیمت مستقیم از تولیدکننده بدون واسطه',
    details: ['حذف واسطه‌ها', 'تخفیف‌های ویژه', 'قیمت رقابتی']
  },
  {
    id: 5,
    icon: '🔬',
    title: 'تخصص و تجربه',
    description: 'تیم متخصص با دانش روز کشاورزی و باغداری',
    details: ['مشاوران متخصص', 'دانش فنی به روز', 'راهکارهای علمی']
  },
  {
    id: 6,
    icon: '🌱',
    title: 'محصولات ارگانیک',
    description: 'تأمین کننده برترین محصولات طبیعی و دوستدار محیط زیست',
    details: ['کودهای کاملاً طبیعی', 'سموم زیستی', 'محصولات سالم']
  }
];

export default component$(() => {
  return (
    <section class="py-16 bg-linear-to-br from-gray-50 to-green-50">
      <div class="container mx-auto px-4">
        {/* هدر بخش */}
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            چرا پربار باغستان؟
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ما با تکیه بر دانش تخصصی و سال‌ها تجربه در زمینه کشاورزی، همراه مطمئنی برای 
            <span class="text-green-600 font-semibold"> موفقیت و برداشت پربار </span>
            شما هستیم
          </p>
        </div>

        {/* شبکه ویژگی‌ها */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              class="bg-white rounded-2xl shadow-lg hover-lift transition-all duration-300 border border-gray-100 p-6 group relative overflow-hidden"
            >
              {/* افکت پس‌زمینه */}
              <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-400 to-green-600"></div>
              
              {/* شماره ویژگی */}
              <div class="absolute top-4 left-4 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              {/* آیکون و عنوان */}
              <div class="text-center mb-4 pt-2">
                <div class="w-20 h-20 gradient-bg rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* جزئیات */}
              <ul class="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li 
                    key={detailIndex}
                    class="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-700 hover:text-green-600 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* آمار و ارقام */}
        <div class="mt-20 bg-white rounded-2xl shadow-lg p-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-green-600 mb-2">۵۰۰+</div>
              <div class="text-gray-600">محصول تخصصی</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-green-600 mb-2">۱۰,۰۰۰+</div>
              <div class="text-gray-600">مشتری راضی</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-green-600 mb-2">۱۵+</div>
              <div class="text-gray-600">سال تجربه</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-green-600 mb-2">۳۱</div>
              <div class="text-gray-600">استان تحت پوشش</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});