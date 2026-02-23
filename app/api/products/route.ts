import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get('merchantId');

    if (!merchantId) {
        return NextResponse.json({ error: 'Merchant ID required' }, { status: 400 });
    }

    try {
        const products = await prisma.product.findMany({
            where: { merchantId },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(products);
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, description, type, merchantId, basePrice, imageUrl, sku, stockLevel } = await request.json();

        if (!name || !type || !merchantId || !basePrice || !sku) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                type,
                merchantId,
                basePrice: parseFloat(basePrice),
                imageUrl,
                items: {
                    create: {
                        sku,
                        stockLevel: parseInt(stockLevel) || 0,
                    }
                }
            },
            include: { items: true }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json({ error: 'SKU already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
