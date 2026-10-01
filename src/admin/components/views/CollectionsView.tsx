import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { AdminCollection } from "@/types/admin";
import { Plus, Edit, Trash2, Sparkles, X, Check } from "lucide-react";

export const CollectionsView: React.FC = () => {
  const {
    collections,
    addCollection,
    updateCollection,
    deleteCollection,
    products,
    requestConfirmation,
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
    setIsModalOpen(true);
  };

  const handleDelete = (col: AdminCollection) => {
    requestConfirmation({
      title: "Delete Collection",
      message: `Are you sure you want to delete "${col.name}"?`,
      confirmText: "Delete Collection",
      isDanger: true,
      onConfirm: () => deleteCollection(col.id),
    });
  };

  const toggleProductAssignment = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const id = editingCol
      ? editingCol.id
      : `col-${Date.now().toString().slice(-4)}`;

    const payload: AdminCollection = {
      id,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description,
      coverImage,
      bannerImage,
      status,
      displayOrder: editingCol
        ? editingCol.displayOrder
        : collections.length + 1,
      productIds: selectedProductIds,
    };

    if (editingCol) {
      updateCollection(payload);
    } else {
      addCollection(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-[#FFFDF8] border border-[#29231F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#29231F]">
            Collection Management
          </h2>
          <p className="text-xs text-[#29231F]/60 mt-0.5">
            Curate thematic editorial collections and assign signature jewellery
            pieces
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#29231F] text-[#F7F3EC] hover:bg-[#C8A96B] hover:text-[#29231F] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> CREATE COLLECTION
        </button>
      </div>

      {/* COLLECTIONS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-[#FFFDF8] border border-[#29231F]/10 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#C8A96B] transition-all"
          >
            <div className="relative h-44 overflow-hidden group">
              <img
                src={col.bannerImage || col.coverImage}
                alt={col.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#29231F]/80 via-[#29231F]/20 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] bg-[#C8A96B] text-[#29231F] font-bold px-2 py-0.5 w-max uppercase tracking-wider mb-1">
                  {col.status}
                </span>
                <h3 className="font-serif text-2xl text-white font-semibold">
                  {col.name}
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <p className="text-xs text-[#29231F]/70 leading-relaxed">
                {col.description}
              </p>
              <p className="text-[11px] text-[#C8A96B] font-semibold">
                {col.productIds?.length || 0} Assigned Products
              </p>
            </div>

            {/* ACTION FOOTER */}
            <div className="px-4 py-2.5 bg-[#F5F1EB] border-t border-[#29231F]/10 flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#29231F]/50 uppercase font-mono">
                Slug: /{col.slug}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(col)}
                  className="p-1 text-[#29231F]/60 hover:text-[#C8A96B] transition-colors"
                  title="Edit Collection"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(col)}
                  className="p-1 text-[#29231F]/60 hover:text-red-700 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#29231F]/40 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-[#29231F]/20 max-w-2xl w-full my-8 p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#29231F]/50 hover:text-[#29231F]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-semibold text-[#29231F] mb-4">
              {editingCol
                ? `Edit Collection: ${editingCol.name}`
                : "Create New Collection"}
            </h3>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              <div>
                <label className="block font-medium text-[#29231F] mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Pearls"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. royal-pearls"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Poetic introduction to this collection"
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#29231F] mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#F5F1EB] border border-[#29231F]/15 p-2.5 text-xs text-[#29231F] focus:outline-none focus:border-[#C8A96B]"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              {/* ASSIGN PRODUCTS TO COLLECTION */}
              <div className="pt-3 border-t border-[#29231F]/10">
                <label className="block font-medium text-[#29231F] mb-2">
                  Assign Products ({selectedProductIds.length} selected)
                </label>
                <div className="max-h-40 overflow-y-auto border border-[#29231F]/15 p-2 space-y-1 bg-[#F5F1EB]">
                  {products.map((p) => {
                    const isSelected = selectedProductIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProductAssignment(p.id)}
                        className={`flex items-center justify-between p-2 cursor-pointer text-xs transition-colors ${
                          isSelected
                            ? "bg-[#C8A96B]/20 text-[#29231F] font-semibold"
                            : "hover:bg-[#E8DED0]/50 text-[#29231F]/80"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-6 h-6 object-cover border border-[#29231F]/10"
                          />
                          <span>
                            {p.name} ({p.formattedPrice})
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#C8A96B]" />
                        )}
                      </div>
                    );
                  })}
                </div>
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
                className="px-5 py-2.5 bg-[#29231F] text-[#F7F3EC] uppercase tracking-widest text-xs font-semibold hover:bg-[#C8A96B] hover:text-[#29231F] transition-colors"
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
