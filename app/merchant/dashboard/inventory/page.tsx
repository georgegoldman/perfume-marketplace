'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { Product, Merchant } from '@/lib/types';

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        productType: 'PERFUME',
        basePrice: '',
        sku: '',
        stockLevel: '',
        imageUrl: '',
    });
    const [error, setError] = useState('');
    const [merchant, setMerchant] = useState<Merchant | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const storedMerchant = localStorage.getItem('merchant');
        if (storedMerchant) {
            const m = JSON.parse(storedMerchant) as Merchant;
            setMerchant(m);
            fetchProducts(m.id);
        }

        if (searchParams.get('add') === 'true') {
            setShowAddModal(true);
        }
    }, [searchParams]);

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

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const body = {
                ...newProduct,
                basePrice: parseFloat(newProduct.basePrice),
                stockLevel: parseInt(newProduct.stockLevel),
                merchantId: merchant?.id,
                imageUrl: newProduct.imageUrl || null,
                type: newProduct.productType // Ensure 'type' is sent for the API
            };

            if (isEditing && editingProductId) {
                await apiFetch(`/api/products/${editingProductId}`, {
                    method: 'PATCH',
                    body: JSON.stringify(body),
                });
            } else {
                await apiFetch('/api/products', {
                    method: 'POST',
                    body: JSON.stringify(body),
                });
            }

            setShowAddModal(false);
            setIsEditing(false);
            setEditingProductId(null);
            setNewProduct({ name: '', description: '', productType: 'PERFUME', basePrice: '', sku: '', stockLevel: '', imageUrl: '' });
            if (merchant) fetchProducts(merchant.id);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you certain you wish to remove this treasure from the archive?')) return;

        try {
            await apiFetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });
            if (merchant) fetchProducts(merchant.id);
        } catch (err: any) {
            alert(err.message || 'Failed to delete product');
        }
    };

    const openEditModal = (product: Product) => {
        setIsEditing(true);
        setEditingProductId(product.id);
        setNewProduct({
            name: product.name,
            description: product.description || '',
            productType: product.type,
            basePrice: product.basePrice.toString(),
            sku: product.items?.[0]?.sku || '',
            stockLevel: (product.items?.[0]?.stockLevel || 0).toString(),
            imageUrl: product.imageUrl || '',
        });
        setShowAddModal(true);
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
                <div>
                    <h2 className="serif text-4xl md:text-5xl mb-2 font-normal text-[var(--text-primary)]">Inventory</h2>
                    <p className="text-mute text-sm md:text-base">Manage your curated collection of olfactory treasures.</p>
                </div>
                <button
                    className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[0.65rem] font-bold tracking-[0.2em] hover:opacity-90 transition-all shadow-lg"
                    onClick={() => {
                        setIsEditing(false);
                        setEditingProductId(null);
                        setNewProduct({ name: '', description: '', productType: 'PERFUME', basePrice: '', sku: '', stockLevel: '', imageUrl: '' });
                        setShowAddModal(true);
                    }}
                >
                    + New Essence
                </button>
            </div>

            <div className="card !p-0 overflow-hidden border border-[var(--border)] bg-[var(--bg-primary)]">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full min-w-[800px] border-collapse text-left">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
                                <th className="uppercase p-6 text-[0.6rem] font-black text-mute tracking-[0.2em]">Product</th>
                                <th className="uppercase p-6 text-[0.6rem] font-black text-mute tracking-[0.2em]">Type</th>
                                <th className="uppercase p-6 text-[0.6rem] font-black text-mute tracking-[0.2em]">Price</th>
                                <th className="uppercase p-6 text-[0.6rem] font-black text-mute tracking-[0.2em]">Stock</th>
                                <th className="uppercase p-6 text-[0.6rem] font-black text-mute tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-mute uppercase text-[0.65rem] font-bold tracking-[0.2em] animate-pulse">
                                        Seeking database records...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <p className="serif text-2xl text-mute italic mb-2">The inventory is currently empty.</p>
                                        <p className="text-mute uppercase text-[0.55rem] font-bold tracking-[0.1em]">Add your first creation to begin.</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 border border-[var(--border)] flex justify-center items-center text-xl transition-all bg-[var(--bg-secondary)]">
                                                    {product.type === 'PERFUME' ? '🧪' : '✨'}
                                                </div>
                                                <div>
                                                    <p className="serif text-lg font-normal text-[var(--text-primary)]">{product.name}</p>
                                                    <p className="text-[0.55rem] text-mute uppercase font-black tracking-widest">{product.items?.[0]?.sku || 'NO-SKU'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="uppercase text-[0.55rem] font-black border border-[var(--border)] px-3 py-1 bg-[var(--bg-primary)] tracking-widest text-[var(--text-primary)]">
                                                {product.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-6 font-medium text-[var(--text-primary)]">
                                            ₦{product.basePrice.toLocaleString()}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${(product.items?.[0]?.stockLevel || 0) < 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                                <span className={`uppercase text-[0.65rem] font-bold tracking-tight ${(product.items?.[0]?.stockLevel || 0) < 5 ? 'text-red-500' : 'text-mute'}`}>
                                                    {product.items?.[0]?.stockLevel || 0} Units
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-6">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="uppercase text-[0.6rem] font-black tracking-widest text-[var(--text-primary)] hover:opacity-100 opacity-40 transition-opacity"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="uppercase text-[0.6rem] font-black tracking-widest text-red-500 hover:opacity-100 opacity-40 transition-opacity"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex justify-center items-center p-6 overflow-y-auto"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowAddModal(false);
                            setIsEditing(false);
                            setEditingProductId(null);
                        }
                    }}
                >
                    <div className="w-full max-w-xl bg-[var(--bg-primary)] border border-[var(--border)] shadow-2xl relative p-10 md:p-14 animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="absolute top-6 right-6 text-2xl text-[var(--text-primary)] hover:rotate-90 transition-transform duration-300"
                        >
                            ×
                        </button>

                        <header className="text-center mb-12">
                            <span className="uppercase text-[0.6rem] text-mute font-black tracking-[0.4em] mb-4 block">{isEditing ? 'Archive Amendment' : 'Archive Addition'}</span>
                            <h3 className="serif text-4xl font-normal text-[var(--text-primary)]">{isEditing ? 'Refine Essence' : 'New Essence'}</h3>
                        </header>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 mb-8 text-[0.7rem] uppercase font-bold tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSaveProduct} className="space-y-8">
                            <div className="space-y-2">
                                <label className="uppercase text-[0.55rem] font-black text-mute tracking-[0.2em]">Product Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-transparent border-b border-[var(--border)] py-3 text-lg font-light outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--border)]"
                                    placeholder="Enter creation name..."
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="uppercase text-[0.55rem] font-black text-mute tracking-[0.2em]">Description</label>
                                <textarea
                                    className="w-full bg-transparent border border-[var(--border)] p-4 text-sm font-light outline-none focus:border-[var(--text-primary)] transition-colors min-h-[100px] resize-none"
                                    placeholder="Describe the olfactory journey..."
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="uppercase text-[0.55rem] font-black text-mute tracking-[0.2em]">Product Image</label>
                                <div className="flex flex-col gap-4">
                                    {newProduct.imageUrl && (
                                        <div className="relative aspect-video w-full border border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)]">
                                            <img src={newProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setNewProduct({ ...newProduct, imageUrl: '' })}
                                                className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-black transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = async () => {
                                                        const base64 = reader.result as string;
                                                        try {
                                                            const { uploadImage } = await import('@/lib/cloudinary-actions');
                                                            const url = await uploadImage(base64);
                                                            setNewProduct({ ...newProduct, imageUrl: url });
                                                        } catch (err) {
                                                            setError('Upload failed. Please check your Cloudinary configuration.');
                                                        }
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--border)] hover:border-[var(--text-primary)] transition-all cursor-pointer group"
                                        >
                                            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📸</span>
                                            <span className="uppercase text-[0.6rem] font-bold tracking-widest text-mute group-hover:text-[var(--text-primary)]">
                                                {newProduct.imageUrl ? 'Change Essence Visual' : 'Upload Essence Visual'}
                                            </span>
                                        </label>
                                    </div>
                                    <p className="text-[0.5rem] text-mute uppercase tracking-widest leading-relaxed">
                                        Square or portrait images work best for the archive display.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="uppercase text-[0.55rem] font-black text-mute tracking-[0.2em]">Type</label>
                                    <select
                                        className="w-full bg-[var(--bg-primary)] border-b border-[var(--border)] py-3 text-sm font-light outline-none focus:border-[var(--text-primary)] transition-colors appearance-none cursor-pointer"
                                        value={newProduct.productType}
                                        onChange={(e) => setNewProduct({ ...newProduct, productType: e.target.value as any })}
                                    >
                                        <option value="PERFUME">Fine Parfum</option>
                                        <option value="OIL_PERFUME">Botanical Oil</option>
                                        <option value="DIFFUSER">Ambient Scent</option>
                                        <option value="DEODORANT">Personal Essence</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="uppercase text-[0.55rem] font-black text-mute tracking-[0.2em]">Base Price (₦)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-transparent border-b border-[var(--border)] py-3 text-sm font-light outline-none focus:border-[var(--text-primary)] transition-colors"
                                        value={newProduct.basePrice}
                                        onChange={(e) => setNewProduct({ ...newProduct, basePrice: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="uppercase text-[0.55rem] font-black text-mute tracking-[0.2em]">Stock Count</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full bg-transparent border-b border-[var(--border)] py-3 text-sm font-light outline-none focus:border-[var(--text-primary)] transition-colors"
                                        value={newProduct.stockLevel}
                                        onChange={(e) => setNewProduct({ ...newProduct, stockLevel: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="uppercase text-[0.55rem] font-black text-mute tracking-[0.2em]">Reference SKU</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="PARFUM-001"
                                        className="w-full bg-transparent border-b border-[var(--border)] py-3 text-sm font-light outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--border)]"
                                        value={newProduct.sku}
                                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    className="w-full py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[0.7rem] font-black tracking-[0.3em] hover:opacity-90 transition-all shadow-xl"
                                >
                                    {isEditing ? 'Finalize Amendment' : 'Complete Addition'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

