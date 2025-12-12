// src/routes/products/[id]/index.tsx (نسخه اصلاح شده)
import { $, component$, Resource, useContext, useResource$, useSignal, useVisibleTask$, useTask$ } from '@builder.io/qwik';
import { routeLoader$, useLocation } from '@builder.io/qwik-city';
import type { Product } from '~/components/types/product';
import { API_BASE_URL } from '~/config/api';
import { CartContext, type CartItem } from '~/context/cart-context';
import { Notification } from '~/components/ProductId/Notification';
import { CSSAnimations } from '~/components/ProductId/CSSAnimations';
import { LoadingState } from '~/components/ProductId/LoadingState';
import { ErrorState } from '~/components/ProductId/ErrorState';
import { NotFoundState } from '~/components/ProductId/NotFoundState';
import { ProductImage } from '~/components/ProductId/ProductImage';
import { ProductInfo } from '~/components/ProductId/ProductInfo';
import { ProductDescription } from '~/components/ProductId/ProductDescription';
import { ProductSpecs } from '~/components/ProductId/ProductSpecs';
import { RelatedProducts } from '~/components/ProductId/RelatedProducts';

export const useProduct = routeLoader$(async (requestEvent) => {
    const { params, status } = requestEvent;

    if (!params.id || params.id === 'undefined') {
        status(404);
        return null;
    }

    const apiUrl = `${API_BASE_URL}/api/product/${params.id}`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            status(response.status);
            return null;
        }
        
        const data = await response.json();

        const product: Product = {
            _id: data._id || data.id || '',
            id: data.id || data._id || '',
            name: data.name || '',
            content: data.content || '',
            image: data.image || '',
            createdAt: data.createdAt || new Date().toISOString(),
            brand: data.brand || '',
            price: Number(data.price) || 0,
            model: data.model || '',
            packageSize: data.packageSize || ''
        };

        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        status(500);
        return null;
    }
});

export default component$(() => {
    const location = useLocation();
    const productId = location.params.id;
    const productResource = useProduct();
    const cart = useContext(CartContext);
    
    // سیگنال‌های نوتیفیکیشن
    const showNotification = useSignal(false);
    const notificationMessage = useSignal('');
    const notificationType = useSignal<'success' | 'error' | 'info'>('success');
    
    // سیگنال وضعیت محصول در سبد
    const isProductInCart = useSignal(false);
    
    // تابع بستن نوتیفیکیشن
    const handleCloseNotification = $(() => {
        showNotification.value = false;
    });
    
    // تایمر خودکار بسته شدن نوتیفیکیشن
    useVisibleTask$(({ track, cleanup }) => {
        track(() => showNotification.value);
        
        if (showNotification.value) {
            const timer = setTimeout(() => {
                showNotification.value = false;
            }, 4000);
            
            cleanup(() => clearTimeout(timer));
        }
    });
    
    // بررسی وضعیت محصول در سبد
    useTask$(async ({ track }) => {
        track(() => cart.items);
        
        if (cart.isInCart) {
            try {
                const exists = await cart.isInCart(productId);
                isProductInCart.value = exists;
            } catch (error) {
                console.error('Error checking cart status:', error);
            }
        }
    });
    
    // توابع نوتیفیکیشن
    const showSuccessNotification = $((message: string) => {
        notificationMessage.value = message;
        notificationType.value = 'success';
        showNotification.value = true;
    });
    
    const showErrorNotification = $((message: string) => {
        notificationMessage.value = message;
        notificationType.value = 'error';
        showNotification.value = true;
    });
    
    // تابع اصلی افزودن به سبد خرید
    const addToCart = $(async (product: Product) => {
        if (!cart.addItem) {
            showErrorNotification('سیستم سبد خرید آماده نیست. لطفاً صفحه را رفرش کنید.');
            return;
        }
        
        try {
            // بررسی وجود محصول در سبد
            if (cart.isInCart) {
                const isAlreadyInCart = await cart.isInCart(product._id);
                
                if (isAlreadyInCart) {
                    showSuccessNotification(
                        `✅ "${product.name}"\n` +
                        `قبلاً در سبد خرید شما موجود است!\n` +
                        `برای تغییر تعداد به صفحه سبد خرید مراجعه کنید.`
                    );
                    return;
                }
            }
            
            // افزودن محصول جدید
            const cartItem: CartItem = {
                id: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
                packageSize: product.packageSize,
                brand: product.brand,
                model: product.model,
                image: product.image
            };
            
            await cart.addItem(cartItem);
            
            showSuccessNotification(`✅ "${product.name}"\nبا موفقیت به سبد خرید اضافه شد!`);
            
            // به‌روزرسانی وضعیت
            isProductInCart.value = true;
            
            // افکت بصری
            const btn = document.querySelector(`[data-product-id="${product._id}"]`);
            if (btn) {
                btn.classList.add('animate-vibrate');
                setTimeout(() => {
                    btn.classList.remove('animate-vibrate');
                }, 300);
            }
            
        } catch (error) {
            console.error('Error in addToCart:', error);
            showErrorNotification('❌ خطا در افزودن محصول به سبد خرید!\nلطفاً دوباره تلاش کنید.');
        }
    });
    
    // تابع QRL شده برای پاس دادن به کامپوننت‌ها
    const handleAddToCart = $(async (product: Product) => {
        await addToCart(product);
    });
    
    // دریافت محصولات مرتبط
    const relatedProductsResource = useResource$<Product[]>(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/product`);
            if (response.ok) {
                const allProducts: Product[] = await response.json();
                const filteredProducts = allProducts.filter(p => p._id !== productId);
                
                if (filteredProducts.length <= 4) {
                    return filteredProducts;
                }
                
                const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
                return shuffled.slice(0, 6);
            }
            return [];
        } catch (error) {
            console.error('Error fetching related products:', error);
            return [];
        }
    });

    return (
        <div class="min-h-screen bg-linear-to-br from-gray-50 to-white">
            <CSSAnimations />
            
            <Notification
                message={notificationMessage.value}
                type={notificationType.value}
                isVisible={showNotification.value}
                onClose={handleCloseNotification}
            />

            <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <Resource
                    value={productResource}
                    onPending={() => <LoadingState />}
                    onRejected={() => <ErrorState productId={productId} />}
                    onResolved={(product: Product | null) => {
                        if (!product) {
                            return <NotFoundState productId={productId} />;
                        }
                        
                        // ایجاد تابع QRL شده برای این محصول خاص
                        const onAddToCartProduct = $(() => handleAddToCart(product));
                        
                        return (
                            <>
                                {/* محتوای اصلی محصول */}
                                <div class="max-w-7xl mx-auto">
                                    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
                                        <ProductImage 
                                            product={product} 
                                            apiBaseUrl={API_BASE_URL} 
                                        />
                                        
                                        <ProductInfo 
                                            product={product}
                                            isProductInCart={isProductInCart.value}
                                            onAddToCart={onAddToCartProduct}
                                            apiBaseUrl={API_BASE_URL}
                                        />
                                    </div>
                                    
                                    {/* توضیحات و مشخصات */}
                                    <div class="mt-8 lg:mt-12">
                                        <ProductDescription product={product} />
                                        <div class="mt-6">
                                            <ProductSpecs product={product} />
                                        </div>
                                    </div>
                                </div>

                                {/* محصولات مرتبط */}
                                <RelatedProducts
                                    productsResource={relatedProductsResource}
                                    productId={productId}
                                    apiBaseUrl={API_BASE_URL}
                                    onAddToCart={handleAddToCart}
                                />
                            </>
                        );
                    }}
                />
            </main>
        </div>
    );
});