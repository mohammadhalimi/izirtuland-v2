// نسخه اصلاح شده EmptyOrdersState.tsx
import { component$, QRL } from '@builder.io/qwik';

interface EmptyOrdersStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick$?: QRL<() => void>;
  showButton?: boolean;
  buttonHref?: string; // اضافه کردن href
}

export default component$<EmptyOrdersStateProps>(({ 
  icon = '📦',
  title,
  subtitle,
  buttonText = 'مشاهده محصولات',
  onButtonClick$,
  showButton = true,
  buttonHref
}) => {
  const ButtonContent = () => (
    <div class="inline-flex items-center gap-3 px-8 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-0.5">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      {buttonText}
    </div>
  );

  return (
    <div class="text-center py-8">
      <div class="relative mb-6">
        <div class="w-24 h-24 mx-auto bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center shadow-md">
          <span class="text-5xl">{icon}</span>
        </div>
        <div class="absolute -inset-4 border-2 border-green-200 rounded-3xl animate-pulse"></div>
      </div>
      
      <h3 class="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      
      {subtitle && (
        <p class="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      
      {showButton && (
        buttonHref ? (
          <a href={buttonHref}>
            <ButtonContent />
          </a>
        ) : onButtonClick$ ? (
          <button onClick$={onButtonClick$}>
            <ButtonContent />
          </button>
        ) : null
      )}
    </div>
  );
});