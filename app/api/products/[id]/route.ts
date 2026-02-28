import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { name, description, type, basePrice, imageUrl, sku, stockLevel } = await request.json();

        // Update product and its associated inventory item
        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                type,
                basePrice: parseFloat(basePrice),
                imageUrl,
                items: {
                    updateMany: {
                        where: { productId: id },
                        data: {
                            sku,
                            stockLevel: parseInt(stockLevel) || 0,
                        }
                    }
                }
            },
            include: { items: true }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Delete associated inventory items first (or handle via relation)
        await prisma.inventoryItem.deleteMany({
            where: { productId: id }
        });

        // Delete the product
        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
