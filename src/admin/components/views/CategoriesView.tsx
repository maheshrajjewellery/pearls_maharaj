import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";
import { AdminCategory } from "@/types/admin";
import {
  uploadProductImage,
  deleteProductImage,
} from "@/services/storageService";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  AlertTriangle,
  RefreshCw,
  Search,
  Grid,
  List,
  Layers,
  ArrowUpDown,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";

export const CategoriesView: React.FC = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    requestConfirmation,
    refreshDbData,
    isLoading,
    setActiveTab,
    setProductCategoryFilter,
  } = useAdmin();

  // View Mode: Table vs Grid
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(
    null,
  );

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [enabled, setEnabled] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<
    | "display-order"
    | "name-asc"
    | "name-desc"
    | "newest"
    | "oldest"
    | "products-desc"
  >("display-order");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate dynamic stats
  const totalCategoriesCount = categories.length;
  const activeCategoriesCount = useMemo(
    () => categories.filter((c) => c.enabled).length,
    [categories],
  );
  const inactiveCategoriesCount = totalCategoriesCount - activeCategoriesCount;
  const totalProductsCount = useMemo(() => products.length, [products]);

  // Filter & Sort Categories
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        const matchesSearch =
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (cat.description || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all"
            ? true
            : statusFilter === "active"
              ? cat.enabled
              : !cat.enabled;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        if (sortBy === "products-desc") return b.itemCount - a.itemCount;
        if (sortBy === "newest")
          return (
            (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
            (a.createdAt ? new Date(a.createdAt).getTime() : 0)
          );
        if (sortBy === "oldest")
          return (
            (a.createdAt ? new Date(a.createdAt).getTime() : 0) -
            (b.createdAt ? new Date(b.createdAt).getTime() : 0)
          );
        return a.displayOrder - b.displayOrder;
      });
  }, [categories, searchTerm, statusFilter, sortBy]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, currentPage]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage(
      "https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg?auto=compress&cs=tinysrgb&w=600",
    );
    setDisplayOrder(categories.length + 1);
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
    setDisplayOrder(cat.displayOrder || 1);
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
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setSlug(generated);
    }
  };

  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFormError(null);
    try {
      const res = await uploadProductImage(file, "categories");
      setImage(res.url);
    } catch (err: any) {
      setFormError(err.message || "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage("");
  };

  const handleToggleStatus = async (cat: AdminCategory) => {
    await updateCategory({ id: cat.id, enabled: !cat.enabled });
  };

  const handleViewProducts = (catSlug: string) => {
    setProductCategoryFilter(catSlug);
    setActiveTab("products");
  };

  const handleDelete = (cat: AdminCategory) => {
    if (cat.itemCount > 0) {
      requestConfirmation({
        title: "Cannot Delete Category",
        message: `This category contains ${cat.itemCount} product(s). You cannot delete this category until its products are moved to another category.`,
        confirmText: "Understood",
        isDanger: true,
        onConfirm: () => {},
      });
      return;
    }

    requestConfirmation({
      title: "Delete Category",
      message: `Are you sure you want to permanently delete category "${cat.name}"? This operation will remove it from the database.`,
      confirmText: "Delete Category",
      isDanger: true,
      onConfirm: async () => {
        if (cat.image) {
          await deleteProductImage(cat.image);
        }
        await deleteCategory(cat.id);
      },
    });
  };

  const handleSave = async () => {
    setFormError(null);
    if (!name.trim()) {
      setFormError("Category name is required.");
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
        displayOrder,
        enabled,
      });
    } else {
      success = await addCategory({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        image,
        displayOrder,
        enabled,
      });
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#30372F]">
            Categories
          </h2>
          <p className="text-xs text-[#30372F]/60 mt-0.5">
            Manage your jewellery categories and organize your catalogue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshDbData()}
            className="p-2.5 bg-[#F5F1EB] text-[#30372F] hover:bg-[#F5EBDD] transition-colors border border-[#30372F]/15 text-xs flex items-center gap-1.5"
            title="Sync Database Categories"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />{" "}
            Sync DB
          </button>
          <button
            onClick={handleOpenAdd}
            className="bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> ADD CATEGORY
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#30372F]/60 uppercase tracking-wider">
              Total Categories
            </span>
            <Layers className="w-4 h-4 text-[#C5A15A]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#30372F] mt-2">
            {totalCategoriesCount}
          </p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#30372F]/60 uppercase tracking-wider">
              Active Categories
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-emerald-800 mt-2">
            {activeCategoriesCount}
          </p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#30372F]/60 uppercase tracking-wider">
              Inactive Categories
            </span>
            <XCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-amber-800 mt-2">
            {inactiveCategoriesCount}
          </p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#30372F]/60 uppercase tracking-wider">
              Total Products
            </span>
            <Package className="w-4 h-4 text-[#30372F]/60" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#30372F] mt-2">
            {totalProductsCount}
          </p>
        </div>
      </div>

      {/* 3. SEARCH, FILTERS & SORT TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F5F1EB] p-4 border border-[#30372F]/10 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#30372F]/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search categories..."
              className="w-full bg-[#FFFDF8] border border-[#30372F]/15 pl-9 pr-3 py-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FFFDF8] border border-[#30372F]/15 px-3 py-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#FFFDF8] border border-[#30372F]/15 px-3 py-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="display-order">Sort: Display Order</option>
              <option value="name-asc">Sort: Name A-Z</option>
              <option value="name-desc">Sort: Name Z-A</option>
              <option value="products-desc">Sort: Product Count</option>
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 border border-[#30372F]/15 bg-[#FFFDF8] p-1 shrink-0 self-end md:self-auto">
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 transition-colors ${
              viewMode === "table"
                ? "bg-[#30372F] text-[#F7F3EC]"
                : "text-[#30372F]/60 hover:text-[#30372F]"
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 transition-colors ${
              viewMode === "grid"
                ? "bg-[#30372F] text-[#F7F3EC]"
                : "text-[#30372F]/60 hover:text-[#30372F]"
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. CONTENT LIST: TABLE OR GRID VIEW */}
      {viewMode === "table" ? (
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#30372F]/10 text-[#30372F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]">
                  <th className="p-3 w-16">Image</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Products</th>
                  <th className="p-3">Display Order</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30372F]/5">
                {paginatedCategories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-12 text-center text-[#30372F]/60"
                    >
                      <div className="max-w-sm mx-auto flex flex-col items-center">
                        <Layers className="w-8 h-8 text-[#C5A15A] mb-2" />
                        <p className="font-serif text-base font-semibold text-[#30372F] mb-1">
                          No Categories Found
                        </p>
                        <p className="text-xs text-[#30372F]/60 mb-4">
                          {isLoading
                            ? "Fetching database categories..."
                            : "No jewellery categories match your current search or filter rules."}
                        </p>
                        <button
                          onClick={handleOpenAdd}
                          className="bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> ADD CATEGORY
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-[#F5F1EB]/40 transition-colors"
                    >
                      <td className="p-3">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-12 h-12 object-cover border border-[#30372F]/10 bg-[#F5F1EB]"
                        />
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-[#30372F] font-serif text-sm">
                          {cat.name}
                        </p>
                        <p className="text-[11px] text-[#30372F]/50 font-mono">
                          /{cat.slug}
                        </p>
                        {cat.description && (
                          <p className="text-[11px] text-[#30372F]/60 line-clamp-1 mt-0.5">
                            {cat.description}
                          </p>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-[#30372F]">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F5F1EB] border border-[#30372F]/10 text-xs">
                          {cat.itemCount}{" "}
                          {cat.itemCount === 1 ? "Product" : "Products"}
                        </span>
                      </td>
                      <td className="p-3 text-[#30372F]/80 font-mono">
                        #{cat.displayOrder || 1}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleStatus(cat)}
                          className={`px-2.5 py-1 text-[10px] font-semibold border transition-colors ${
                            cat.enabled
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          {cat.enabled ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewProducts(cat.slug)}
                            className="p-1.5 text-[#30372F]/60 hover:text-[#C5A15A] transition-colors flex items-center gap-1 text-[11px]"
                            title="View category products"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> View
                            Products
                          </button>
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 text-[#30372F]/60 hover:text-[#C5A15A] transition-colors"
                            title="Edit Category"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            className="p-1.5 text-[#30372F]/60 hover:text-red-700 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
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
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCategories.length === 0 ? (
            <div className="col-span-full p-12 bg-[#FFFDF8] border border-[#30372F]/10 text-center text-[#30372F]/60">
              <Layers className="w-8 h-8 text-[#C5A15A] mx-auto mb-2" />
              <p className="font-serif text-base font-semibold text-[#30372F] mb-1">
                No Categories Found
              </p>
              <p className="text-xs text-[#30372F]/60 mb-4">
                No categories match your current search.
              </p>
            </div>
          ) : (
            paginatedCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-[#FFFDF8] border border-[#30372F]/10 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#C5A15A] transition-all"
              >
                <div className="p-4 flex gap-4">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-20 h-20 object-cover border border-[#30372F]/10 shrink-0 bg-[#F5F1EB]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-lg font-semibold text-[#30372F] leading-tight">
                        {cat.name}
                      </h3>
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`px-2 py-0.5 text-[10px] font-semibold border ${
                          cat.enabled
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {cat.enabled ? "Active" : "Inactive"}
                      </button>
                    </div>
                    <p className="text-xs text-[#30372F]/60 mt-1 line-clamp-2">
                      {cat.description || "No description"}
                    </p>
                    <p className="text-[11px] text-[#C5A15A] font-medium mt-2">
                      {cat.itemCount}{" "}
                      {cat.itemCount === 1 ? "Product" : "Products"}
                    </p>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="px-4 py-2.5 bg-[#F5F1EB] border-t border-[#30372F]/10 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleViewProducts(cat.slug)}
                    className="text-[11px] text-[#30372F]/70 hover:text-[#C5A15A] font-mono flex items-center gap-1"
                  >
                    /{cat.slug} <ExternalLink className="w-3 h-3" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1 text-[#30372F]/60 hover:text-[#C5A15A] transition-colors"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1 text-[#30372F]/60 hover:text-red-700 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 5. PAGINATION FOOTER */}
      {totalPages > 1 && (
        <div className="p-4 bg-[#FFFDF8] border border-[#30372F]/10 flex items-center justify-between text-xs shadow-xs">
          <span className="text-[#30372F]/60">
            Showing Page {currentPage} of {totalPages} (
            {filteredCategories.length} categories)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 bg-[#F5F1EB] border border-[#30372F]/15 text-[#30372F] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 bg-[#F5F1EB] border border-[#30372F]/15 text-[#30372F] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* 6. ADD / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#30372F]/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FFFDF8] border border-[#30372F]/20 max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#30372F]/50 hover:text-[#30372F]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-semibold text-[#30372F] mb-4">
              {editingCategory
                ? `Edit Category: ${editingCategory.name}`
                : "Add Category"}
            </h3>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Category Name */}
              <div>
                <label className="block font-medium text-[#30372F] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Necklaces"
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block font-medium text-[#30372F] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. necklaces"
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A] font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-[#30372F] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Category description..."
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block font-medium text-[#30372F] mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) =>
                    setDisplayOrder(parseInt(e.target.value) || 1)
                  }
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              {/* Category Image */}
              <div>
                <label className="block font-medium text-[#30372F] mb-1">
                  Category Image
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.pexels.com/..."
                      className="flex-1 bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                    />
                    <label className="px-3 py-2 bg-[#30372F] text-[#F7F3EC] text-[11px] font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#C5A15A] hover:text-[#30372F] transition-colors flex items-center gap-1">
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
                  {isUploading && (
                    <p className="text-[10px] text-[#C5A15A] animate-pulse">
                      Uploading to Supabase Storage...
                    </p>
                  )}
                  {image && (
                    <div className="relative inline-block mt-2">
                      <img
                        src={image}
                        alt="Category preview"
                        className="w-20 h-20 object-cover border border-[#30372F]/15 bg-[#F5F1EB]"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 bg-[#F5F1EB] border border-[#30372F]/10">
                <div>
                  <span className="font-semibold text-[#30372F] block">
                    Active Status
                  </span>
                  <span className="text-[10px] text-[#30372F]/60">
                    Make this category visible on the website
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A15A]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#30372F]/10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs uppercase tracking-widest text-[#30372F]/70 hover:text-[#30372F]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="px-5 py-2.5 bg-[#30372F] text-[#F7F3EC] uppercase tracking-widest text-xs font-semibold hover:bg-[#C5A15A] hover:text-[#30372F] transition-colors disabled:opacity-50"
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
