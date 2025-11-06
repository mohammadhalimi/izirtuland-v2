import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import Herobg from '../../media/Herobg.jpg'

export default component$(() => {
  return (
    <section class="relative gradient-bg text-white">
      <div 
        class="absolute inset-0 bg-cover bg-center opacity-30"
        style={`background-image: url(${Herobg})`}
      ></div>
      
      <div class="container mx-auto px-4 py-20 relative">
        <div class="max-w-2xl">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            محصولات با کیفیت،
            <span class="block text-orange-300"> برای برداشت پربار</span>
          </h1>
          
          <p class="text-xl mb-8 text-green-100">
            تامین کننده بهترین کودهای شیمیایی، ارگانیک و طبیعی با مشاوره رایگان متخصصان ما
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/products"
              class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover-lift text-center"
            >
              مشاهده محصولات
            </Link>
            <Link 
              href="/consultation"
              class="border-2 border-white text-white hover:bg-white hover:text-green-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover-lift text-center"
            >
              مشاوره رایگان
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});