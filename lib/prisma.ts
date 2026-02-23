import { PrismaClient } from '@prisma/client';

/**
 * Lazy-loading Prisma Client Proxy
 * This prevents the PrismaClient from initializing during the Next.js build-time 
 * static analysis/data collection phase, which often fails if the database 
 * or environment is not fully configured in the build worker.
 */
let _prisma: PrismaClient | undefined;

const prismaProxy = new Proxy({} as PrismaClient, {
    get(target, prop, receiver) {
        if (!_prisma) {
            _prisma = new PrismaClient();

            // In development, we still want to attach it to globalThis to prevent 
            // multiple instances during Hot Module Replacement (HMR).
            if (process.env.NODE_ENV !== 'production') {
                (globalThis as any).prisma = _prisma;
            }
        }

        const value = Reflect.get(_prisma, prop, receiver);
        if (typeof value === 'function') {
            return value.bind(_prisma);
        }
        return value;
    }
});

// Check if we already have an instance on globalThis (for HMR)
if (process.env.NODE_ENV !== 'production' && (globalThis as any).prisma) {
    _prisma = (globalThis as any).prisma;
}

export default prismaProxy;
