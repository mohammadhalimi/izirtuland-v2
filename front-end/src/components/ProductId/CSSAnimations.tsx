// src/routes/products/[id]/CSSAnimations.tsx
import { component$, useStyles$ } from '@builder.io/qwik';

export const CSSAnimations = component$(() => {
    useStyles$(`
        @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
        }
        .animate-progress {
            animation: progress 4s linear forwards;
        }
        
        @keyframes vibrate {
            0% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            50% { transform: translateX(4px); }
            75% { transform: translateX(-4px); }
            100% { transform: translateX(0); }
        }
        .animate-vibrate {
            animation: vibrate 0.3s ease-in-out;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        .animate-float {
            animation: float 3s ease-in-out infinite;
        }
    `);

    return null;
});