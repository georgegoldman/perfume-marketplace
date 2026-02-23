'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api-client';
import { Product, Merchant } from '@/lib/types';

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        type: 'PERFUME',
        basePrice: '',
        sku: '',
        stockLevel: '',
    });
    const [error, setError] = useState('');
    const [merchant, setMerchant] = useState<Merchant | null>(null);

    useEffect(() => {
        const storedMerchant = localStorage.getItem('merchant');
        if (storedMerchant) {
            const m = JSON.parse(storedMerchant) as Merchant;
            setMerchant(m);
            fetchProducts(m.id);
        }
    }, []);

    const fetchProducts = async (merchantId: string) => {
        try {
            const data = await apiFetch(`/api/products?merchantId=${merchantId}`);
            setProducts(data);
        } catch (err) {
            console.error('Fetch products error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await apiFetch('/api/products', {
                method: 'POST',
                body: JSON.stringify({
                    ...newProduct,
                    basePrice: parseFloat(newProduct.basePrice),
                    stockLevel: parseInt(newProduct.stockLevel),
                    merchantId: merchant?.id
                }),
            });

            setShowAddModal(false);
            setNewProduct({ name: '', description: '', type: 'PERFUME', basePrice: '', sku: '', stockLevel: '' });
            if (merchant) fetchProducts(merchant.id);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Inventory <span className="text-gradient">Management</span></h2>
                    <p style={{ color: 'hsl(var(--text-secondary))' }}>Manage your collection of unique scents.</p>
                </div>
                <button className="btn-gold" onClick={() => setShowAddModal(true)}>+ Add New Product</button>
            </div>

            <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid hsla(var(--border-glass))' }}>
                            <th style={{ padding: '1.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Product</th>
                            <th style={{ padding: '1.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Type</th>
                            <th style={{ padding: '1.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Base Price</th>
                            <th style={{ padding: '1.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Stock</th>
                            <th style={{ padding: '1.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'hsl(var(--text-secondary))' }}>Loading inventory...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'hsl(var(--text-secondary))' }}>No products found. Add your first item!</td></tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} style={{ borderBottom: '1px solid hsla(var(--border-glass))', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>💎</div>
                                            <div>
                                                <p style={{ fontWeight: 600 }}>{product.name}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>{product.items?.[0]?.sku || 'No SKU'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}><span style={{ fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '100px' }}>{product.type}</span></td>
                                    <td style={{ padding: '1.5rem' }}>${product.basePrice.toFixed(2)}</td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <span style={{ color: (product.items?.[0]?.stockLevel || 0) < 5 ? '#ff4444' : 'inherit' }}>
                                            {product.items?.[0]?.stockLevel || 0} units
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <button style={{ background: 'transparent', border: 'none', color: 'hsl(var(--primary-gold))', cursor: 'pointer', fontSize: '0.9rem', marginRight: '1rem' }}>Edit</button>
                                        <button style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '0.9rem' }}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="glass glass-gold" style={{ width: '90%', maxWidth: '600px', padding: '3rem', position: 'relative' }}>
                        <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
                        <h3 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Add New Product</h3>

                        {error && <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>{error}</div>}

                        <form onSubmit={handleCreateProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem' }}>Product Name</label>
                                <input required type="text" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid hsla(var(--border-glass))', borderRadius: '8px', color: 'white' }} value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem' }}>Description</label>
                                <textarea style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid hsla(var(--border-glass))', borderRadius: '8px', color: 'white', minHeight: '80px' }} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem' }}>Type</label>
                                <select style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid hsla(var(--border-glass))', borderRadius: '8px', color: 'white' }} value={newProduct.type} onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}>
                                    <option value="PERFUME">Perfume</option>
                                    <option value="OIL_PERFUME">Oil Perfume</option>
                                    <option value="DIFFUSER">Diffuser</option>
                                    <option value="DEODORANT">Deodorant</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem' }}>Base Price ($)</label>
                                <input required type="number" step="0.01" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid hsla(var(--border-glass))', borderRadius: '8px', color: 'white' }} value={newProduct.basePrice} onChange={(e) => setNewProduct({ ...newProduct, basePrice: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem' }}>Initial Stock</label>
                                <input required type="number" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid hsla(var(--border-glass))', borderRadius: '8px', color: 'white' }} value={newProduct.stockLevel} onChange={(e) => setNewProduct({ ...newProduct, stockLevel: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem' }}>SKU</label>
                                <input required type="text" placeholder="e.g. LUX-PERF-01" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid hsla(var(--border-glass))', borderRadius: '8px', color: 'white' }} value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                <button type="submit" className="btn-gold" style={{ width: '100%', height: '50px' }}>Create Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
