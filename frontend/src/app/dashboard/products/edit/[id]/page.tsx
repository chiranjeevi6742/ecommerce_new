"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, ImagePlus, X, GripVertical } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Multiple Images State
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "Clothing"
    });

    // Fetch existing product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:8001/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name,
                        description: data.description || "",
                        price: data.price.toString(),
                        stock: data.stock.toString(),
                        category: data.category
                    });

                    // Initialize images
                    // If backend sends 'images' array, use it. 
                    // Fallback to 'image_url' if 'images' is empty/undefined.
                    let loadedImages: string[] = [];
                    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                        loadedImages = data.images;
                    } else if (data.image_url) {
                        loadedImages = [data.image_url];
                    }
                    setExistingImages(loadedImages);

                } else {
                    alert("Product not found");
                    router.push("/dashboard/products");
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setFetching(false);
            }
        };

        if (id) fetchProduct();
    }, [id, router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setNewImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeExistingImage = (indexToRemove: number) => {
        setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const removeNewImage = (indexToRemove: number) => {
        setNewImages(prev => prev.filter((_, index) => index !== indexToRemove));
        setNewImagePreviews(prev => {
            // Revoke URL to avoid memory leaks
            URL.revokeObjectURL(prev[indexToRemove]);
            return prev.filter((_, index) => index !== indexToRemove);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload New Images to Supabase Storage
            const uploadedUrls: string[] = [];

            for (const file of newImages) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);
            }

            // 2. Combine Existing and New Images
            const finalImages = [...existingImages, ...uploadedUrls];

            // 3. Determine Main Image (first one)
            const mainImageUrl = finalImages.length > 0 ? finalImages[0] : null;

            // 4. Send Data to FastAPI Backend
            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                category: formData.category,
                image_url: mainImageUrl, // Keep for backward compatibility
                images: finalImages,
                is_active: true
            };

            const res = await fetch(`http://localhost:8001/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to update product");

            router.push("/dashboard/products");
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("Error updating product");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8">Loading product...</div>;

    return (
        <div className="p-8 max-w-5xl min-h-screen mx-auto">
            <Link href="/dashboard/products" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to products
            </Link>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
                    <span className="text-sm text-slate-500">
                        {existingImages.length + newImages.length} images selected
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column: Image Gallery */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Product Images</label>
                            <p className="text-xs text-slate-500 mb-4">First image will be the main cover image.</p>

                            {/* Image Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {/* Existing Images */}
                                {existingImages.map((src, index) => (
                                    <div key={`existing-${index}`} className="relative group aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                                        <Image
                                            src={src}
                                            alt={`Product ${index + 1}`}
                                            fill
                                            className="object-contain p-2"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-2">
                                            {index === 0 && <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">Main</span>}
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="ml-auto bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-white transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* New Image Previews */}
                                {newImagePreviews.map((src, index) => (
                                    <div key={`new-${index}`} className="relative group aspect-square rounded-lg border border-blue-200 overflow-hidden bg-blue-50/30">
                                        <Image
                                            src={src}
                                            alt={`New ${index + 1}`}
                                            fill
                                            className="object-contain p-2"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end p-2">
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-white transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Upload Button */}
                                <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group">
                                    <ImagePlus className="h-8 w-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                    <span className="mt-2 text-xs font-medium text-slate-500 group-hover:text-blue-600">Add Image</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Clothing</option>
                                    <option>Electronics</option>
                                    <option>Books</option>
                                    <option>Stationery</option>
                                    <option>Merchandise</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock Qty</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows={8}
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-slate-100">
                        <Button type="submit" size="lg" isLoading={loading}>
                            Update Product
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
