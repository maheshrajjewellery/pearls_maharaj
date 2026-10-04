import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { AdminCollection } from "@/types/admin";
import { uploadProductImage } from "@/services/storageService";
import { Plus, Edit, Trash2, Sparkles, X, Check, RefreshCw, Upload, AlertTriangle } from "lucide-react";

export const CollectionsView: React.FC = () => {
  const {
    collections,
    addCollection,
    updateCollection,
    deleteCollection,
    products,
    requestConfirmation,
    refreshDbData,
    isLoading,
  } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<AdminCollection | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [status, setStatus] = useState<"Active" | "Draft">("Active");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingCol(null);
    setName("");
    setSlug("");
    setDescription("");
    setCoverImage(
      "https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=800",
    );
    setBannerImage(
      "https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1920",
    );
    setStatus("Active");
    setSelectedProductIds([]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col: AdminCollection) => {
    setEditingCol(col);
    setName(col.name);
    setSlug(col.slug);
    setDescription(col.description);
    setCoverImage(col.coverImage);
    setBannerImage(col.bannerImage);
    setStatus(col.status);
    setSelectedProductIds(col.productIds || []);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (col: AdminCollection) => {
    requestConfirmation({
      title: "Delete Collection",
      message: `Are you sure you want to delete "${col.name}"? This will remove the record from the database.`,
      confirmText: "Delete Collection",
      isDanger: true,
      onConfirm: async () => {
        await deleteCollection(col.id);
      },
    });
  };

  const toggleProductAssignment = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadProductImage(file, 'collections');
      setCoverImage(res.url);
      if (!bannerImage) setBannerImage(res.url);
    } catch (err: any) {
      setFormError(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setFormError(null);
    if (!name.trim()) {
      setFormError("Collection name is required.");
      return;
    }

    const payload: AdminCollection = {
      id: editingCol ? editingCol.id : "",
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/\s+/g, "-"),
      description: description.trim(),
      coverImage,
      bannerImage,
      status,
      displayOrder: editingCol ? editingCol.displayOrder : collections.length + 1,
      productIds: selectedProductIds,
    };

    let success = false;
    if (editingCol) {
      success = await updateCollection(payload);
    } else {
      success = await addCollection(payload);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#30372F]">
            Collection Management ({collections.length})
          </h2>
          <p className="text-xs text-[#30372F]/60 mt-0.5">
            Database-driven thematic editorial collections and assigned signature jewellery pieces
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshDbData()}
            className="p-2.5 bg-[#F5F1EB] text-[#30372F] hover:bg-[#F5EBDD] transition-colors border border-[#30372F]/15 text-xs flex items-center gap-1.5"
            title="Sync Database Collections"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Sync DB
          </button>
          <button
            onClick={handleOpenAdd}
            className="bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> CREATE COLLECTION
          </button>
        </div>
      </div>

      {/* COLLECTIONS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-[#FFFDF8] border border-[#30372F]/10 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#C5A15A] transition-all"
          >
            <div className="relative h-44 overflow-hidden group">
              <img
                src={col.bannerImage || col.coverImage}
                alt={col.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#30372F]/80 via-[#30372F]/20 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] bg-[#C5A15A] text-[#30372F] font-bold px-2 py-0.5 w-max uppercase tracking-wider mb-1">
                  {col.status}
                </span>
                <h3 className="font-serif text-2xl text-white font-semibold">
                  {col.name}
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <p className="text-xs text-[#30372F]/70 leading-relaxed">
                {col.description}
              </p>
              <p className="text-[11px] text-[#C5A15A] font-semibold">
                {col.productIds?.length || 0} Assigned Products
              </p>
            </div>

            {/* ACTION FOOTER */}
            <div className="px-4 py-2.5 bg-[#F5F1EB] border-t border-[#30372F]/10 flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#30372F]/50 uppercase font-mono">
                Slug: /{col.slug}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(col)}
                  className="p-1 text-[#30372F]/60 hover:text-[#C5A15A] transition-colors"
                  title="Edit Collection"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(col)}
                  className="p-1 text-[#30372F]/60 hover:text-red-700 transition-colors"
                  title="Delete Collection"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COLLECTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#30372F]/40 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-[#30372F]/20 max-w-2xl w-full my-8 p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#30372F]/50 hover:text-[#30372F]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-semibold text-[#30372F] mb-4">
              {editingCol
                ? `Edit Collection: ${editingCol.name}`
                : "Create New Collection"}
            </h3>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              <div>
                <label className="block font-medium text-[#30372F] mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Pearls"
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#30372F] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. royal-pearls"
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#30372F] mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Poetic introduction to this collection"
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#30372F] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#30372F] mb-1">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#30372F] mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              {/* ASSIGN PRODUCTS TO COLLECTION */}
              <div className="pt-3 border-t border-[#30372F]/10">
                <label className="block font-medium text-[#30372F] mb-2">
                  Assign Products ({selectedProductIds.length} selected)
                </label>
                <div className="max-h-40 overflow-y-auto border border-[#30372F]/15 p-2 space-y-1 bg-[#F5F1EB]">
                  {products.map((p) => {
                    const isSelected = selectedProductIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProductAssignment(p.id)}
                        className={`flex items-center justify-between p-2 cursor-pointer text-xs transition-colors ${
                          isSelected
                            ? "bg-[#C5A15A]/20 text-[#30372F] font-semibold"
                            : "hover:bg-[#F5EBDD]/50 text-[#30372F]/80"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-6 h-6 object-cover border border-[#30372F]/10"
                          />
                          <span>
                            {p.name} ({p.formattedPrice})
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#C5A15A]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#30372F]/10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs uppercase tracking-widest text-[#30372F]/70 hover:text-[#30372F]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-[#30372F] text-[#F7F3EC] uppercase tracking-widest text-xs font-semibold hover:bg-[#C5A15A] hover:text-[#30372F] transition-colors"
              >
                Save Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
