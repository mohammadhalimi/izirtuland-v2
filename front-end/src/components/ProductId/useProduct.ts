// src/routes/products/[id]/useProduct.ts
import { routeLoader$ } from '@builder.io/qwik-city';
import type { Product } from '~/components/types/product';
import { API_BASE_URL } from '~/config/api';

// فقط تعریف تابع، بدون export
export const createProductLoader = () => {
    return routeLoader$(async (requestEvent) => {
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
};