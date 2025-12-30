export interface CartActionsProps {
    uniqueProducts: number;
    totalUnits: number;
    onClearCart: () => void;
}

export interface CartHeaderProps {
    uniqueProducts: number;
    totalUnits: number;
    totalPrice: number;
}

export interface CartItemProps {
    item: any;
    isUpdating: boolean;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string, name: string) => void;
    formatPackageSize: (size: string) => string;
}

export interface CartSummaryProps {
    totalPrice: number;
    totalUnits: number;
    isFreeShipping: boolean;
}

export interface ShippingProgressProps {
    totalPrice: number;
    shippingThreshold: number;
}