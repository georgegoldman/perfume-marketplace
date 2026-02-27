'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';

type Theme = 'SYSTEM' | 'LIGHT' | 'DARK';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => Promise<void>;
    resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('SYSTEM');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Init theme from localStorage or merchant data
        const storedMerchant = localStorage.getItem('merchant');
        if (storedMerchant) {
            const merchant = JSON.parse(storedMerchant);
            if (merchant.preferred_theme) {
                setThemeState(merchant.preferred_theme as Theme);
            }
        }
    }, []);

    useEffect(() => {
        const handleThemeChange = () => {
            if (theme === 'SYSTEM') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                setResolvedTheme(systemTheme);
            } else {
                setResolvedTheme(theme.toLowerCase() as 'light' | 'dark');
            }
        };

        handleThemeChange();

        if (theme === 'SYSTEM') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', handleThemeChange);
            return () => mediaQuery.removeEventListener('change', handleThemeChange);
        }
    }, [theme]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', resolvedTheme);
    }, [resolvedTheme]);

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);

        // Persist to backend if logged in
        const token = localStorage.getItem('merchantToken');
        if (token) {
            try {
                await apiFetch('/api/merchant/theme', {
                    method: 'POST',
                    body: JSON.stringify({ theme: newTheme }),
                });

                // Update local merchant info
                const storedMerchant = localStorage.getItem('merchant');
                if (storedMerchant) {
                    const merchant = JSON.parse(storedMerchant);
                    merchant.preferred_theme = newTheme;
                    localStorage.setItem('merchant', JSON.stringify(merchant));
                }
            } catch (error) {
                console.error('Failed to update theme on backend:', error);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
