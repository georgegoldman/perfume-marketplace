import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const merchantId = searchParams.get('merchantId');

    try {
        const products = await prisma.product.findMany({
            where: {
                ...(type && { type: type as unknown as 'PERFUME' | 'OIL_PERFUME' | 'DIFFUSER' | 'DEODORANT' }),
                ...(merchantId && { merchantId }),
            },
            include: {
                merchant: {
                    select: { shopName: true }
                },
                items: true
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(products);
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
