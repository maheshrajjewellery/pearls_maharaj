import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";
import { ProductEditorModal } from "./ProductEditorModal";
import { ShopProduct } from "@/types/shop";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export const ProductsView: React.FC = () => {
  const {
    products,
    categories,
    deleteProduct,
    deleteAllProducts,
    duplicateProduct,
    updateProduct,
    requestConfirmation,
    refreshDbData,
    isLoading,
    productCategoryFilter,
    setProductCategoryFilter,
  } = useAdmin();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ShopProduct | null>(null);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const selectedCategory = productCategoryFilter;
  const setSelectedCategory = (val: string) => setProductCategoryFilter(val);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "price-asc" | "price-desc" | "name"
  >("newest");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered dataset
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.pearlType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.specs?.hallmark || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" || p.category === selectedCategory;
        const matchesStatus =
          statusFilter === "all"
            ? true
            : statusFilter === "active"
              ? p.inStock
              : !p.inStock;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [products, searchTerm, selectedCategory, statusFilter, sortBy]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: ShopProduct) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (product: ShopProduct) => {
    await updateProduct({
      id: product.id,
      inStock: !product.inStock,
    });
  };

  const handleDeleteClick = (product: ShopProduct) => {
    requestConfirmation({
      title: "Delete Product from Database",
      message: `Are you sure you want to delete "${product.name}"? This will remove the record permanently from the database.`,
      confirmText: "Delete Product",
      isDanger: true,
      onConfirm: async () => {
        await deleteProduct(product.id, false);
      },
    });
  };

  const handleDeleteAllClick = () => {
    requestConfirmation({
      title: "Remove ALL Products from Database",
      message: `Are you sure you want to remove ALL ${products.length} products? This operation will delete all product entries and images permanently.`,
      confirmText: "Delete All Products",
      isDanger: true,
      onConfirm: async () => {
        await deleteAllProducts();
      },
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#30372F]">
            Product Catalogue ({filteredProducts.length})
          </h2>
          <p className="text-xs text-[#30372F]/60 mt-0.5">
            100% Database-driven high jewellery products, prices, stock, media
            assets & publication states
          </p>
        </div>

        <div className="flex items-center gap-3">
          {products.length > 0 && (
            <button
              onClick={handleDeleteAllClick}
              className="px-3.5 py-2.5 bg-red-50 text-red-800 hover:bg-red-100 border border-red-200 text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Remove all products from catalogue"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-700" /> Clear All Products
            </button>
          )}
          <button
            onClick={() => refreshDbData()}
            className="p-2.5 bg-[#F5F1EB] text-[#30372F] hover:bg-[#F5EBDD] transition-colors border border-[#30372F]/15 text-xs flex items-center gap-1.5"
            title="Refresh Database Products"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />{" "}
            Sync DB
          </button>
          <button
            onClick={handleOpenAddModal}
            className="bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> ADD PRODUCT
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-[#F5F1EB] p-4 border border-[#30372F]/10 text-xs">
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
            placeholder="Search by name, SKU..."
            className="w-full bg-[#FFFDF8] border border-[#30372F]/15 pl-9 pr-3 py-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
          />
        </div>

        {/* Filter Category */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#FFFDF8] border border-[#30372F]/15 px-3 py-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Status */}
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
            <option value="active">Active / In Stock</option>
            <option value="inactive">Inactive / Draft</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-[#FFFDF8] border border-[#30372F]/15 px-3 py-2 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#30372F]/10 text-[#30372F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]">
                <th className="p-3 w-16">Image</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30372F]/5">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-12 text-center text-[#30372F]/60"
                  >
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <Sparkles className="w-8 h-8 text-[#C5A15A] mb-2" />
                      <p className="font-serif text-base font-semibold text-[#30372F] mb-1">
                        No Products in Catalogue
                      </p>
                      <p className="text-xs text-[#30372F]/60 mb-4">
                        {isLoading
                          ? "Fetching database records..."
                          : "The product database is currently empty. Click the button below to add your first piece."}
                      </p>
                      <button
                        onClick={handleOpenAddModal}
                        className="bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> ADD FIRST PRODUCT
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#F5F1EB]/40 transition-colors"
                  >
                    <td className="p-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover border border-[#30372F]/10 bg-[#F5F1EB]"
                      />
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-[#30372F]">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-[#30372F]/50">
                        {product.pearlType} • {product.material}
                      </p>
                    </td>
                    <td className="p-3 text-[#30372F]/70 font-mono text-[11px]">
                      {product.specs?.hallmark || product.id}
                    </td>
                    <td className="p-3 capitalize text-[#30372F]/80">
                      {product.category}
                    </td>
                    <td className="p-3 font-semibold text-[#30372F]">
                      {product.formattedPrice}
                      {product.formattedComparePrice && (
                        <span className="block text-[10px] text-[#30372F]/40 line-through">
                          {product.formattedComparePrice}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {product.inStock ? (
                        <span className="text-emerald-800 font-medium">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-red-700 font-medium">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`px-2 py-0.5 text-[10px] font-semibold border transition-colors ${
                          product.inStock
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        {product.inStock ? "Active" : "Draft / Hidden"}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 text-[#30372F]/60 hover:text-[#C5A15A] transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateProduct(product)}
                          className="p-1.5 text-[#30372F]/60 hover:text-[#30372F] transition-colors"
                          title="Duplicate product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-1.5 text-[#30372F]/60 hover:text-red-700 transition-colors"
                          title="Delete product"
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

        {/* PAGINATION FOOTER */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#F5F1EB] border-t border-[#30372F]/10 flex items-center justify-between text-xs">
            <span className="text-[#30372F]/60">
              Page {currentPage} of {totalPages} ({filteredProducts.length}{" "}
              items)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-[#FFFDF8] border border-[#30372F]/15 text-[#30372F] disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3 py-1 bg-[#FFFDF8] border border-[#30372F]/15 text-[#30372F] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT EDITOR MODAL */}
      <ProductEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
      />
    </div>
  );
};
