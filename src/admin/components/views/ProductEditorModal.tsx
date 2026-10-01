import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ShopProduct, ShopCategory, PearlType, ColorFilter } from '@/types/shop';
import { uploadProductImage } from '@/services/storageService';
import { generateProductSlug, generateUniqueSKU } from '@/services/productService';
import {
  X,
  Upload,
  Trash2,
  Plus,
  Star,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: ShopProduct | null;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, categories } = useAdmin();
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'details' | 'images' | 'visibility'>('basic');

  // Basic Information
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<string>('necklaces');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');

  // Pricing & Stock
  const [price, setPrice] = useState<number | ''>(100000);
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [stockQuantity, setStockQuantity] = useState<number>(10);

  // Details
  const [material, setMaterial] = useState<string>('18K Yellow Gold');
  const [gemstone, setGemstone] = useState<string>('South Sea Pearl');
  const [color, setColor] = useState<string>('White');
  const [size, setSize] = useState<string>('11mm - 13mm');
  const [weight, setWeight] = useState<string>('45.0 grams');

  // Images State
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Visibility & Options
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(true);
  const [isSale, setIsSale] = useState<boolean>(false);
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  // Form Validation & Error state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Reset or populate form when productToEdit changes
  useEffect(() => {
    setValidationError(null);
    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.specs?.hallmark || `MJ-SKU-${productToEdit.id}`);
      setSlug(productToEdit.slug);
      setCategory(productToEdit.category);
      setShortDescription(productToEdit.shortDescription || '');
      setDescription(productToEdit.descriptor || '');
      setPrice(productToEdit.price);
      setSalePrice(productToEdit.comparePrice || '');
      setStockQuantity(productToEdit.inStock ? 10 : 0);

      setMaterial(productToEdit.material || '18K Yellow Gold');
      setGemstone(productToEdit.pearlType || 'South Sea Pearl');
      setColor(productToEdit.color || 'White');
      setSize(productToEdit.specs?.pearlSize || '11mm - 13mm');
      setWeight(productToEdit.specs?.weight || '45.0 grams');

      const imgList = productToEdit.images && productToEdit.images.length > 0
        ? productToEdit.images
        : [productToEdit.image];
      setImages(imgList);

      setIsActive(productToEdit.inStock);
      setIsFeatured(productToEdit.isFeatured || false);
      setIsNew(productToEdit.isNewArrival || false);
      setIsSale(!!(productToEdit.comparePrice && productToEdit.comparePrice > 0));
    } else {
      // New product defaults
      setName('');
      setSku(generateUniqueSKU());
      setSlug('');
      setCategory(categories[0]?.slug || 'necklaces');
      setShortDescription('');
      setDescription('');
      setPrice(125000);
      setSalePrice('');
      setStockQuantity(15);

      setMaterial('18K Yellow Gold');
      setGemstone('South Sea Pearl');
      setColor('White');
      setSize('11.5mm - 13mm');
      setWeight('48.5 grams');

      setImages([
        'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/10835519/pexels-photo-10835519.jpeg?auto=compress&cs=tinysrgb&w=800',
      ]);

      setIsActive(true);
      setIsFeatured(true);
      setIsNew(true);
      setIsSale(false);
      setDisplayOrder(0);
    }
  }, [productToEdit, isOpen, categories]);

  // Auto-generate slug when product name changes
  const handleNameChange = (val: string) => {
    setName(val);
    if (!productToEdit) {
      setSlug(generateProductSlug(val));
    }
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setValidationError(null);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadProductImage(files[i], productToEdit?.id || 'new');
        uploadedUrls.push(result.url);
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setValidationError(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const updated = [...prev];
      const target = updated.splice(index, 1)[0];
      return [target, ...updated];
    });
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    setImages((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  // Client Validation check before saving
  const validateForm = (): boolean => {
    setValidationError(null);

    if (!name.trim()) {
      setValidationError('Product name is required.');
      setActiveTab('basic');
      return false;
    }
    if (!sku.trim()) {
      setValidationError('SKU is required.');
      setActiveTab('basic');
      return false;
    }
    if (!category) {
      setValidationError('Category is required.');
      setActiveTab('basic');
      return false;
    }
    if (price === '' || isNaN(Number(price)) || Number(price) <= 0) {
      setValidationError('Price must be greater than 0.');
      setActiveTab('pricing');
      return false;
    }
    if (salePrice !== '' && Number(salePrice) > Number(price)) {
      setValidationError('Sale price cannot be greater than the original price.');
      setActiveTab('pricing');
      return false;
    }
    if (stockQuantity < 0) {
      setValidationError('Stock quantity cannot be negative.');
      setActiveTab('pricing');
      return false;
    }
    if (images.length === 0) {
      setValidationError('Please upload at least one product image.');
      setActiveTab('images');
      return false;
    }

    return true;
  };

  const handleSave = async (publishStatus: boolean) => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setValidationError(null);

    const numPrice = Number(price);
    const numSalePrice = salePrice !== '' ? Number(salePrice) : undefined;

    const payload: Partial<ShopProduct> & { images: string[]; sku: string } = {
      name: name.trim(),
      sku: sku.trim(),
      slug: slug.trim() || generateProductSlug(name),
      category: category as ShopCategory,
      shortDescription: shortDescription.trim(),
      descriptor: description.trim() || shortDescription.trim(),
      price: numPrice,
      comparePrice: numSalePrice,
      inStock: publishStatus ? (stockQuantity > 0 ? isActive : true) : false,
      material: material.trim(),
      pearlType: gemstone as PearlType,
      color: color as ColorFilter,
      specs: {
        pearlSize: size.trim(),
        luster: 'AAA Superior High Mirror Luster',
        metalPurity: material.trim(),
        hallmark: sku.trim(),
        origin: 'Australian South Sea Waters',
        weight: weight.trim(),
      },
      images,
      image: images[0],
      hoverImage: images[1] || images[0],
      isFeatured,
      isNewArrival: isNew,
    };

    let success = false;
    if (productToEdit) {
      success = await updateProduct({ ...payload, id: productToEdit.id });
    } else {
      success = await addProduct(payload);
    }

    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#29231F]/40 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FFFDF8] border border-[#29231F]/20 max-w-4xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-[#29231F]/10 bg-[#F5F1EB] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#29231F]">
              {productToEdit
                ? `Edit Product: ${productToEdit.name}`
                : 'Add New High Jewellery Product'}
            </h2>
            <p className="text-xs text-[#29231F]/60 mt-0.5">
              100% Database-backed product details, pricing, inventory, RLS security & media upload
            </p>
          </div>
          <button onClick={onClose} className="text-[#29231F]/50 hover:text-[#29231F] p-1.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ERROR NOTIFICATION ALERT */}
        {validationError && (
          <div className="bg-red-50 border-b border-red-200 p-3 px-6 text-xs text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-700" />
            <span className="font-medium">{validationError}</span>
          </div>
        )}

        {/* MODAL TABS */}
        <div className="flex items-center border-b border-[#29231F]/10 bg-[#FFFDF8] px-6 text-xs font-medium uppercase tracking-wider overflow-x-auto">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'basic'
                ? 'border-[#C8A96B] text-[#29231F] font-semibold'
                : 'border-transparent text-[#29231F]/60 hover:text-[#29231F]'
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'border-[#C8A96B] text-[#29231F] font-semibold'
                : 'border-transparent text-[#29231F]/60 hover:text-[#29231F]'
            }`}
          >
            Pricing & Inventory
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-[#C8A96B] text-[#29231F] font-semibold'
                : 'border-transparent text-[#29231F]/60 hover:text-[#29231F]'
            }`}
          >
            Product Specs
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'images'
                ? 'border-[#C8A96B] text-[#29231F] font-semibold'
                : 'border-transparent text-[#29231F]/60 hover:text-[#29231F]'
            }`}
          >
            Product Images ({images.length})
          </button>
          <button
            onClick={() => setActiveTab('visibility')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'visibility'
                ? 'border-[#C8A96B] text-[#29231F] font-semibold'
                : 'border-transparent text-[#29231F]/60 hover:text-[#29231F]'
            }`}
          >
            Visibility & Flags
          </button>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-medium text-[#29231F] mb-1">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Royal South Sea Pearl Strand"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-sm text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">SKU Code *</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. MJ-SKU-9901"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B] font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. royal-south-sea-pearl-strand"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-[#29231F] mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-[#29231F] mb-1">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Summary displayed on listing cards"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-[#29231F] mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed editorial story and craftsmanship background"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & INVENTORY */}
          {activeTab === 'pricing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#29231F] mb-1">Price (₹ INR) *</label>
                <input
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 185000"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">
                  Sale Price (₹ INR) <span className="text-[#29231F]/40 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Original compare price before discount"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  placeholder="Available inventory items"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  placeholder="Order position (0 for default)"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCT DETAILS */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#29231F] mb-1">Material / Metal</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. 18K Yellow Gold"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">Gemstone / Pearl Type</label>
                <input
                  type="text"
                  value={gemstone}
                  onChange={(e) => setGemstone(e.target.value)}
                  placeholder="e.g. South Sea Pearl"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">Pearl Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Golden Champagne / White"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">Size Dimensions</label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g. 11.5mm - 13.0mm"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-[#29231F] mb-1">Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 48.6 grams"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
            </div>
          )}

          {/* TAB 4: IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F5F1EB] border border-dashed border-[#29231F]/30 text-center">
                <Upload className="w-6 h-6 mx-auto text-[#C8A96B] mb-2" />
                <p className="font-semibold text-[#29231F]">Upload Product Images</p>
                <p className="text-[11px] text-[#29231F]/60 mt-0.5">
                  Accepts JPG, JPEG, PNG, WEBP (Max 5MB each). Uploads directly to Supabase Storage bucket <code className="bg-white/60 px-1 font-mono">product-images</code>
                </p>
                <label className="mt-3 inline-block px-5 py-2.5 bg-[#29231F] text-[#F7F3EC] uppercase tracking-wider text-[11px] font-semibold hover:bg-[#C8A96B] hover:text-[#29231F] cursor-pointer transition-colors shadow-sm">
                  Select Files
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {isUploading && (
                  <p className="text-xs text-[#C8A96B] animate-pulse mt-2">Uploading image assets to Supabase Storage...</p>
                )}
              </div>

              {/* URL Input Fallback */}
              <div className="pt-2">
                <label className="block font-medium text-[#29231F] mb-1">Or Add Image via URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.pexels.com/..."
                    className="flex-1 bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2.5 bg-[#29231F] text-[#F7F3EC] uppercase tracking-wider text-[11px] font-semibold hover:bg-[#C8A96B] transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add URL
                  </button>
                </div>
              </div>

              {/* IMAGE CARDS PREVIEW GRID */}
              <div className="pt-3 border-t border-[#29231F]/10">
                <label className="block font-medium text-[#29231F] mb-2">
                  Uploaded Images ({images.length}) — First image is Primary cover
                </label>

                {images.length === 0 ? (
                  <p className="text-xs text-[#29231F]/50 italic p-4 text-center border border-[#29231F]/10">
                    No images uploaded yet. Please upload at least one image.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative border p-1 bg-[#FFFDF8] group ${
                          idx === 0 ? 'border-[#C8A96B] ring-2 ring-[#C8A96B]/30' : 'border-[#29231F]/15'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Asset ${idx + 1}`}
                          className="w-full h-32 object-cover bg-[#F5F1EB]"
                        />

                        {idx === 0 && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#29231F] text-[#C8A96B] text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 fill-[#C8A96B]" /> Primary
                          </span>
                        )}

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-[#29231F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                          <div className="flex justify-between items-center">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                className="px-2 py-1 bg-[#C8A96B] text-[#29231F] text-[10px] font-bold uppercase tracking-wider hover:bg-white"
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 bg-red-700 text-white hover:bg-red-800 ml-auto"
                              title="Delete image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-end gap-1">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'up')}
                                className="p-1 bg-black/40 hover:bg-black"
                                title="Move left"
                              >
                                <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                              </button>
                            )}
                            {idx < images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'down')}
                                className="p-1 bg-black/40 hover:bg-black"
                                title="Move right"
                              >
                                <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: VISIBILITY & FLAGS */}
          {activeTab === 'visibility' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F5F1EB] border border-[#29231F]/10">
                <div>
                  <p className="font-semibold text-[#29231F]">Product Publication Status</p>
                  <p className="text-[11px] text-[#29231F]/60">
                    Active products are immediately published to the public website
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 accent-[#C8A96B]"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F1EB] border border-[#29231F]/10">
                <div>
                  <p className="font-semibold text-[#29231F]">Featured Showcase</p>
                  <p className="text-[11px] text-[#29231F]/60">
                    Highlight in featured collection sections on homepage
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 accent-[#C8A96B]"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F1EB] border border-[#29231F]/10">
                <div>
                  <p className="font-semibold text-[#29231F]">New Arrival Tag</p>
                  <p className="text-[11px] text-[#29231F]/60">
                    Display New Release badge on product card
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-5 h-5 accent-[#C8A96B]"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5F1EB] border border-[#29231F]/10">
                <div>
                  <p className="font-semibold text-[#29231F]">Sale / Special Tag</p>
                  <p className="text-[11px] text-[#29231F]/60">
                    Flag as seasonal promotional piece
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isSale}
                  onChange={(e) => setIsSale(e.target.checked)}
                  className="w-5 h-5 accent-[#C8A96B]"
                />
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER BUTTONS */}
        <div className="p-4 border-t border-[#29231F]/10 bg-[#F5F1EB] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs uppercase tracking-widest text-[#29231F]/70 hover:text-[#29231F] font-semibold transition-colors"
          >
            CANCEL
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSubmitting || isUploading}
              className="px-4 py-2.5 border border-[#29231F]/20 text-[#29231F] hover:bg-[#E8DED0] uppercase tracking-widest text-xs font-semibold transition-colors disabled:opacity-50"
            >
              SAVE DRAFT
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSubmitting || isUploading}
              className="px-6 py-2.5 bg-[#29231F] text-[#F7F3EC] hover:bg-[#C8A96B] hover:text-[#29231F] uppercase tracking-widest text-xs font-semibold transition-colors shadow-md disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>SAVING TO DB...</span>
              ) : (
                <span>{productToEdit ? 'UPDATE PRODUCT' : 'PUBLISH PRODUCT'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
