import { $, component$, useSignal } from '@builder.io/qwik';

export default component$(() => {
  const activeTestimonial = useSignal(0);

  const testimonials = [
    {
      id: 1,
      name: "محمد رضایی",
      position: "باغدار پسته",
      company: "رفسنجان",
      avatar: "👨‍🌾",
      rating: 5,
      text: "با استفاده از کودهای پیشنهادی پربار باغستان، برداشت پسته من ۴۰٪ افزایش پیدا کرد. مشاوره تخصصی تیم شما واقعاً بی‌نظیر بود و در هر مرحله همراه ما بودند.",
      project: "کود مخصوص پسته",
      duration: "۲ فصل کشت",
      technologies: ["کود NPK", "ریز مغذی", "کود آلی"]
    },
    {
      id: 2,
      name: "فاطمه محمدی",
      position: "زراعت گندم",
      company: "همدان",
      avatar: "👩‍🌾",
      rating: 5,
      text: "کودهای ارگانیک شما نه تنها محصول مرا افزایش داد، بلکه کیفیت خاک مزرعه‌ام رو هم drastically بهبود بخشید. حالا خاک مزرعه‌م زنده‌تر و حاصلخیزتر شده.",
      project: "کودهای ارگانیک",
      duration: "۱ سال همکاری",
      technologies: ["ورمی کمپوست", "کود دامی", "کود سبز"]
    },
    {
      id: 3,
      name: "حسین کریمی",
      position: "باغدار مرکبات",
      company: "شیراز",
      avatar: "👨‍🍳",
      rating: 4,
      text: "سموم ارگانیک شما در کنترل آفات مرکبات عالی عمل کرد. بدون آسیب به محیط زیست توانستم آفات رو کنترل کنم و محصول سالم‌تری برداشت کنم.",
      project: "سموم ارگانیک",
      duration: "۶ ماه استفاده",
      technologies: ["سم طبیعی", "کنترل بیولوژیک", "پیشگیری"]
    },
    {
      id: 4,
      name: "زهرا احمدی",
      position: "کشاورز گلخانه‌ای",
      company: "البرز",
      avatar: "👩‍🔬",
      rating: 5,
      text: "مشاوره رایگان شما در زمینه کوددهی گلخانه باعث شد هزینه‌های من ۳۰٪ کاهش پیدا کنه و محصول کیفیت بهتری داشته باشه. واقعاً متخصصین دلسوزی دارید.",
      project: "مشاوره تخصصی",
      duration: "۸ ماه همراهی",
      technologies: ["کود مایع", "آبیاری قطره‌ای", "کنترل pH"]
    },
    {
      id: 5,
      name: "علی نوری",
      position: "زراعت برنج",
      company: "گیلان",
      avatar: "🧑‍🌾",
      rating: 5,
      text: "کودهای NPK شما با کیفیت عالی و قیمت مناسب، سودآوری مزرعه برنج من رو دوبرابر کرد. حتماً ادامه می‌دم و به دیگران هم توصیه می‌کنم.",
      project: "کود NPK",
      duration: "۳ فصل کشت",
      technologies: ["نیتروژن", "فسفر", "پتاسیم"]
    }
  ];

  const nextTestimonial = $(() => {
    activeTestimonial.value = (activeTestimonial.value + 1) % testimonials.length;
  });

  const prevTestimonial = $(() => {
    activeTestimonial.value = (activeTestimonial.value - 1 + testimonials.length) % testimonials.length;
  });

  const goToTestimonial = $((index: number) => {
    activeTestimonial.value = index;
  });

  return (
    <section class="py-16 bg-linear-to-br from-green-50 to-white relative overflow-hidden" dir='rtl'>
      {/* دکوریشن */}
      <div class="absolute top-0 left-0 w-72 h-72 bg-green-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full translate-x-1/2 translate-y-1/2 opacity-30"></div>
      
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* هدر بخش */}
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
            نظرات کشاورزان
          </span>
          <h1 class="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            آنچه <span class="bg-linear-to-r from-green-500 to-green-600 bg-clip-text text-transparent">مشتریان</span> می‌گویند
          </h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            تجربه واقعی کشاورزان و باغدارانی که از محصولات و خدمات پربار باغستان استفاده کرده‌اند
          </p>
        </div>

        {/* اسلایدر اصلی */}
        <div class="relative mb-12">
          {/* دکمه‌های ناوبری */}
          <button
            onClick$={prevTestimonial}
            class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-green-50 transition-colors duration-200 lg:flex hidden cursor-pointer border border-green-200"
            aria-label='نظر قبلی'
          >
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick$={nextTestimonial}
            class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-green-50 transition-colors duration-200 lg:flex hidden cursor-pointer border border-green-200"
            aria-label='نظر بعدی'
          >
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* اسلایدر */}
          <div class="relative h-96 lg:h-80">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                class={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  index === activeTestimonial.value
                    ? 'opacity-100 transform translate-x-0'
                    : 'opacity-0 transform translate-x-full pointer-events-none'
                }`}
              >
                <div class="bg-linear-to-br from-white to-green-50 rounded-3xl shadow-xl border border-green-100 h-full">
                  <div class="p-8 h-full flex flex-col">
                    {/* ستاره‌ها */}
                    <div class="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          class={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* متن نظر */}
                    <blockquote class="text-lg lg:text-xl text-gray-700 leading-relaxed mb-6 flex-1">
                      "{testimonial.text}"
                    </blockquote>

                    {/* اطلاعات کاربر */}
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        <div class="w-16 h-16 bg-linear-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center text-2xl">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h1 class="font-bold text-gray-800 text-lg">{testimonial.name}</h1>
                          <p class="text-gray-600 text-sm">{testimonial.position}</p>
                          <p class="text-gray-500 text-xs">{testimonial.company}</p>
                        </div>
                      </div>
                      <div class="text-right hidden lg:block">
                        <div class="text-sm text-gray-600">{testimonial.project}</div>
                        <div class="text-xs text-gray-500">{testimonial.duration}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* نقاط ناوبری */}
        <div class="flex justify-center gap-2 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick$={() => goToTestimonial(index)}
              class={`rounded-full transition-all duration-300 flex items-center justify-center ${
                index === activeTestimonial.value
                  ? 'bg-green-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400 w-3'
              } h-3 mx-1`}
              aria-label={`برو به نظر ${index + 1}`}
            />
          ))}
        </div>

        {/* کارت‌های کوچک */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} class="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-green-100 hover-lift">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-linear-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h1 class="font-semibold text-gray-800">{testimonial.name}</h1>
                  <p class="text-gray-600 text-sm">{testimonial.position}</p>
                </div>
              </div>

              <p class="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
                "{testimonial.text}"
              </p>
              <div class="flex justify-between items-center">
                <div class="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      class={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span class="text-xs text-green-800 bg-green-100 px-2 py-1 rounded-full">
                  {testimonial.duration}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA پایین */}
        <div class="text-center">
          <div class="bg-linear-to-r from-green-500 to-green-600 rounded-3xl p-8 lg:p-12 text-white">
            <h1 class="text-2xl lg:text-3xl font-bold mb-4">آماده برداشت پربارتر هستید؟</h1>
            <p class="text-green-100 text-lg mb-6 max-w-2xl mx-auto">
              همین حالا با کارشناسان ما تماس بگیرید و از مشاوره رایگان و محصولات باکیفیت بهره‌مند شوید
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button class="px-8 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover-lift">
                📞 تماس با کارشناس
              </button>
              <button class="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:-translate-y-1 hover-lift">
                🛒 مشاهده محصولات
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});