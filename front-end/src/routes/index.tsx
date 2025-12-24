// src/routes/index.tsx
import { component$, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import Hero from '~/components/section/hero';
import Category from '~/components/section/category';
import BestSellers from '~/components/section/BestSellers';
import WhyUs from '~/components/section/WhyUs';
import BlogSection from '~/components/section/BlogSection';
import Testimonials from '~/components/section/Testimonials.';
import CTA from '~/components/section/CTA';

export default component$(() => {
  return (
    <div class="min-h-screen bg-white">
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

export const head: DocumentHead = {
  title: 'پربار باغستان | فروشگاه تخصصی کود و سموم کشاورزی',
  meta: [
    {
      name: 'description',
      content: 'خرید آنلاین انواع کود، سموم کشاورزی، تجهیزات باغبانی و محصولات ارگانیک با بهترین قیمت و کیفیت. ارسال به سراسر ایران'
    },
    {
      name: 'keywords',
      content: 'کود کشاورزی, سموم کشاورزی, کود ارگانیک, تجهیزات باغبانی, فروشگاه کشاورزی, محصولات باغداری'
    },
    {
      name: 'author',
      content: 'پربار باغستان'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'پربار باغستان | فروشگاه تخصصی کود و سموم کشاورزی'
    },
    {
      property: 'og:description',
      content: 'خرید آنلاین انواع کود، سموم کشاورزی، تجهیزات باغبانی و محصولات ارگانیک'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:locale',
      content: 'fa_IR'
    },
  ],
  links: [
    {
      rel: 'canonical',
      href: 'https://izirtuland.ir'
    },
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.svg'
    }
  ]
};