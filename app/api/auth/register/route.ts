import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { name, email, password, shopName } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if merchant already exists
        const existingMerchant = await prisma.merchant.findUnique({
            where: { email },
        });

        if (existingMerchant) {
            return NextResponse.json({ error: 'Merchant already exists' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const merchant = await prisma.merchant.create({
            data: {
                name,
                email,
                passwordHash,
                shopName,
            },
        });

        // In a real app, you would also create a session here
        return NextResponse.json({
            message: 'Merchant created successfully',
            merchant: { id: merchant.id, name: merchant.name, email: merchant.email }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
