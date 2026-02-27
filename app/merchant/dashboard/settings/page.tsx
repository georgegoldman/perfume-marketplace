'use client';

import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const themes: { id: 'SYSTEM' | 'LIGHT' | 'DARK'; name: string; icon: string }[] = [
        { id: 'SYSTEM', name: 'System Default', icon: '🖥️' },
        { id: 'LIGHT', name: 'Light Essence', icon: '☀️' },
        { id: 'DARK', name: 'Dark Essence', icon: '🌙' },
    ];

    return (
        <div className="space-y-16">
            <header className="mb-14">
                <h2 className="serif text-4xl md:text-5xl mb-2 font-normal text-[var(--text-primary)]">Account Settings</h2>
                <p className="text-mute text-sm md:text-base">Customize your experience and boutique appearance.</p>
            </header>

            <section className="max-w-2xl">
                <div className="card space-y-10">
                    <h3 className="serif text-xl font-normal text-[var(--text-primary)]">Appearance</h3>

                    <div className="flex flex-col gap-4">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`flex items-center justify-between p-6 border transition-all duration-300 group ${theme === t.id
                                    ? 'border-[var(--text-primary)] bg-[var(--bg-secondary)]'
                                    : 'border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--text-secondary)]'
                                    }`}
                            >
                                <div className="flex items-center gap-5">
                                    <span className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${theme === t.id ? 'opacity-100' : 'opacity-40'}`}>
                                        {t.icon}
                                    </span>
                                    <div className="text-left">
                                        <p className={`uppercase text-[0.7rem] font-black tracking-[0.2em] mb-1 ${theme === t.id ? 'text-[var(--text-primary)]' : 'text-mute'}`}>
                                            {t.name}
                                        </p>
                                        {t.id === 'SYSTEM' && (
                                            <p className="text-[0.6rem] font-bold text-mute uppercase tracking-[0.1em] opacity-60">
                                                Currently: {resolvedTheme}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {theme === t.id && (
                                    <div className="w-2 h-2 rounded-full bg-[var(--text-primary)] shadow-[0_0_10px_rgba(var(--text-primary-rgb),0.5)]"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-[var(--border)]">
                        <p className="text-mute text-xs leading-relaxed font-light italic">
                            Your preference is masterfully synchronized across all your devices, ensuring a consistent sensory experience.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
