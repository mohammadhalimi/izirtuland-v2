import { component$ } from '@builder.io/qwik';
import Hero from '~/components/section/hero';
import Category from '~/components/section/category';
import BestSellers from '~/components/section/BestSellers';
import WhyUs from '~/components/section/WhyUs';
import BlogSection from '~/components/section/BlogSection';
import Testimonials from '~/components/section/Testimonials.';
import CTA from '~/components/section/CTA';

export default component$(() => {
  return (
    <div class='class="min-h-screen bg-white'>
      <main>
        <Hero />
        <Category />
        <BestSellers />
        <WhyUs />
        <BlogSection />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
});