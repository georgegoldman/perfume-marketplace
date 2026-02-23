export type ProductType = 'PERFUME' | 'OIL_PERFUME' | 'DIFFUSER' | 'DEODORANT';

export interface Merchant {
    id: string;
    name: string;
    email: string;
    shopName?: string | null;
    logoUrl?: string | null;
}

export interface InventoryItem {
    id: string;
    productId: string;
    sku: string;
    stockLevel: number;
    priceAmount?: number | null;
}

export interface Product {
    id: string;
    name: string;
    description?: string | null;
    type: ProductType;
    merchantId: string;
    imageUrl?: string | null;
    basePrice: number;
    items?: InventoryItem[];
    merchant?: { shopName: string | null };
}
