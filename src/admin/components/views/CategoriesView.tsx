import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminCategory } from '@/types/admin';
import { uploadProductImage } from '@/services/storageService';
import { Plus, Edit, Trash2, X, Upload, AlertTriangle, RefreshCw } from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, requestConfirmation, refreshDbData, isLoading } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg?auto=compress&cs=tinysrgb&w=600');
    setEnabled(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImage(cat.image);
    setEnabled(cat.enabled);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setSlug(generated);
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFormError(null);
    try {
      const res = await uploadProductImage(file, 'categories');
      setImage(res.url);
    } catch (err: any) {
      setFormError(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleStatus = async (cat: AdminCategory) => {
    await updateCategory({ id: cat.id, enabled: !cat.enabled });
  };

  const handleDelete = (cat: AdminCategory) => {
    if (cat.itemCount > 0) {
      requestConfirmation({
        title: 'Cannot Delete Category',
        message: `Category "${cat.name}" cannot be deleted because ${cat.itemCount} product(s) belong to it. Please reassign or delete these products first.`,
        confirmText: 'Understood',
        isDanger: true,
        onConfirm: () => {},
      });
      return;
    }

    requestConfirmation({
      title: 'Delete Category',
      message: `Are you sure you want to permanently delete category "${cat.name}"? This operation will remove it from the database.`,
      confirmText: 'Delete Category',
      isDanger: true,
      onConfirm: async () => {
        await deleteCategory(cat.id);
      },
    });
  };

  const handleSave = async () => {
    setFormError(null);
    if (!name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    let success = false;
    if (editingCategory) {
      success = await updateCategory({
        id: editingCategory.id,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        image,
        enabled,
      });
    } else {
      success = await addCategory({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        image,
        enabled,
      });
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#29231F]">
            Category Management ({categories.length})
          </h2>
          <p className="text-xs text-[#29231F]/60 mt-0.5">
            Database-driven category hierarchy, active status, thumbnail images, and display order
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshDbData()}
            className="p-2.5 bg-[#F5F1EB] text-[#29231F] hover:bg-[#E8DED0] transition-colors border border-[#29231F]/15 text-xs flex items-center gap-1.5"
            title="Refresh database categories"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Sync DB
          </button>
          <button
            onClick={handleOpenAdd}
            className="bg-[#29231F] text-[#F7F3EC] hover:bg-[#C8A96B] hover:text-[#29231F] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> ADD CATEGORY
          </button>
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#FFFDF8] border border-[#29231F]/10 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#C8A96B] transition-all"
          >
            <div className="p-4 flex gap-4">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-20 h-20 object-cover border border-[#29231F]/10 shrink-0 bg-[#F5F1EB]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-lg font-semibold text-[#29231F] leading-tight">
                    {cat.name}
                  </h3>
                  <button
                    onClick={() => handleToggleStatus(cat)}
                    className={`px-2 py-0.5 text-[10px] font-semibold border ${
                      cat.enabled
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    {cat.enabled ? 'Active' : 'Hidden'}
                  </button>
                </div>
                <p className="text-xs text-[#29231F]/60 mt-1 line-clamp-2">{cat.description || 'No description'}</p>
                <p className="text-[11px] text-[#C8A96B] font-medium mt-2">
                  {cat.itemCount} Associated {cat.itemCount === 1 ? 'Product' : 'Products'}
                </p>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="px-4 py-2.5 bg-[#F5F1EB] border-t border-[#29231F]/10 flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#29231F]/50 uppercase font-mono">
                Slug: /{cat.slug}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1 text-[#29231F]/60 hover:text-[#C8A96B] transition-colors"
                  title="Edit Category"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="p-1 text-[#29231F]/60 hover:text-red-700 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CATEGORY FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#29231F]/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-[#29231F]/20 max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#29231F]/50 hover:text-[#29231F]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-semibold text-[#29231F] mb-4">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
            </h3>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#29231F] mb-1">Category Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Necklaces"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. necklaces"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short explanation for category"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">Thumbnail Image</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.pexels.com/..."
                      className="flex-1 bg-[#F5F1EB] border border-[#29231F]/15 p-2 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                    />
                    <label className="px-3 py-2 bg-[#29231F] text-[#F7F3EC] text-[11px] font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#C8A96B] hover:text-[#29231F] transition-colors flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {isUploading && <p className="text-[10px] text-[#C8A96B] animate-pulse">Uploading to Storage bucket...</p>}
                  {image && (
                    <img src={image} alt="Category preview" className="w-16 h-16 object-cover border border-[#29231F]/15" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F5F1EB] border border-[#29231F]/10">
                <span className="font-semibold text-[#29231F]">Active on Website</span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#C8A96B]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#29231F]/10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs uppercase tracking-widest text-[#29231F]/70 hover:text-[#29231F]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="px-5 py-2.5 bg-[#29231F] text-[#F7F3EC] uppercase tracking-widest text-xs font-semibold hover:bg-[#C8A96B] hover:text-[#29231F] transition-colors disabled:opacity-50"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
