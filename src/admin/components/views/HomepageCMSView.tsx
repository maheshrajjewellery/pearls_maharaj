import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useShop } from "@/context/ShopContext";
import { HomepageCMS, HomepageHeroSlide } from "@/types/admin";
import {
  Save,
  Eye,
  Layers,
  Sparkles,
  CheckCircle,
  Image as ImageIcon,
  Upload,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit3,
  X,
  Smartphone,
  MoveHorizontal,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { getPublicStoreUrl } from "@/lib/siteUrl";
import {
  uploadHeroBannerImage,
  validateCMSHeroImage,
} from "@/services/storageService";

export const HomepageCMSView: React.FC = () => {
  const { homepageCMS, updateHomepageCMS } = useAdmin();
  const { refreshCMSData } = useShop();

  const [formData, setFormData] = useState<HomepageCMS>(homepageCMS);
  const [slides, setSlides] = useState<HomepageHeroSlide[]>(
    formData.heroSlides || [
      {
        id: "slide-01",
        title: "MAHARAJ JEWELLERY",
        subtitle: "The Purest Pearl Elegance",
        description:
          "Rare South Sea, Akoya, and Tahitian pearls crafted into timeless heirlooms by master artisans.",
        imageUrl: "/images/pearl-banner.png",
        mobileImageUrl: "/images/pearl-banner-mobile.png",
        ctaText: "EXPLORE THE COLLECTION",
        ctaLink: "/shop",
        displayOrder: 1,
        isActive: true,
        status: "Published",
        imagePosition: "center center",
      },
    ],
  );

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Slide Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] =
    useState<HomepageHeroSlide | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<string | null>(null);

  // Upload States
  const [modalDesktopUploading, setModalDesktopUploading] = useState(false);
  const [modalMobileUploading, setModalMobileUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const updateSection = <K extends keyof HomepageCMS>(
    section: K,
    key: keyof HomepageCMS[K],
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: value,
      },
    }));
  };

  const handleSave = async (updatedSlidesList: HomepageHeroSlide[] = slides) => {
    const sorted = [...updatedSlidesList].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
    const newFormData: HomepageCMS = {
      ...formData,
      heroSlides: sorted,
      hero: {
        ...formData.hero,
        bgImage: sorted[0]?.imageUrl || "/images/pearl-banner.png",
        heading: sorted[0]?.subtitle || "The Purest Pearl Elegance",
        subtitle: sorted[0]?.title || "MAHARAJ JEWELLERY",
        description:
          sorted[0]?.description ||
          "Rare South Sea, Akoya, and Tahitian pearls crafted into timeless heirlooms.",
        ctaText: sorted[0]?.ctaText || "EXPLORE THE COLLECTION",
        ctaLink: sorted[0]?.ctaLink || "/shop",
      },
    };

    setFormData(newFormData);
    updateHomepageCMS(newFormData);
    if (refreshCMSData) await refreshCMSData();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await handleSave(slides);
    setIsPublishing(false);
    setUploadSuccessMsg("Homepage hero banners updated & published live!");
    setTimeout(() => setUploadSuccessMsg(null), 4000);
  };

  const handlePreview = () => {
    window.open(getPublicStoreUrl("/"), "_blank");
  };

  // Slide CRUD Actions
  const handleOpenAddModal = () => {
    setEditingSlide({
      id: `slide-${Date.now()}`,
      title: "MAHARAJ JEWELLERY",
      subtitle: "New Pearl Collection",
      description:
        "Handcrafted South Sea and Akoya pearls set in bespoke gold.",
      imageUrl: "/images/pearl-banner.png",
      mobileImageUrl: "/images/pearl-banner-mobile.png",
      ctaText: "EXPLORE COLLECTION",
      ctaLink: "/shop",
      displayOrder: slides.length + 1,
      isActive: true,
      status: "Published",
      imagePosition: "center center",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slide: HomepageHeroSlide) => {
    setEditingSlide({ ...slide });
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleSaveModalSlide = () => {
    if (!editingSlide) return;
    if (!editingSlide.subtitle.trim()) {
      setUploadError("Please provide a banner title/heading.");
      return;
    }

    let updatedList: HomepageHeroSlide[];
    const exists = slides.some((s) => s.id === editingSlide.id);
    if (exists) {
      updatedList = slides.map((s) =>
        s.id === editingSlide.id
          ? { ...editingSlide, updatedAt: new Date().toISOString() }
          : s,
      );
    } else {
      updatedList = [...slides, editingSlide];
    }

    setSlides(updatedList);
    setIsModalOpen(false);
    setEditingSlide(null);
    handleSave(updatedList);
  };

  const handleConfirmRemoveSlide = () => {
    if (!slideToDelete) return;
    const updatedList = slides.filter((s) => s.id !== slideToDelete);
    // Reindex order
    const reindexed = updatedList.map((s, idx) => ({
      ...s,
      displayOrder: idx + 1,
    }));
    setSlides(reindexed);
    setSlideToDelete(null);
    handleSave(reindexed);
    setUploadSuccessMsg("Hero banner slide removed successfully.");
    setTimeout(() => setUploadSuccessMsg(null), 4000);
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const newSlides = [...slides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSlides.length) return;

    // Swap items & orders
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const reordered = newSlides.map((s, idx) => ({
      ...s,
      displayOrder: idx + 1,
    }));

    setSlides(reordered);
    handleSave(reordered);
  };

  const handleToggleSlideActive = (id: string) => {
    const updated = slides.map((s) =>
      s.id === id ? { ...s, isActive: !s.isActive } : s,
    );
    setSlides(updated);
    handleSave(updated);
  };

  const handleModalImageUpload = async (
    file: File,
    target: "desktop" | "mobile",
  ) => {
    setUploadError(null);
    const validation = validateCMSHeroImage(file);
    if (!validation.valid) {
      setUploadError(validation.error || "Image validation failed.");
      return;
    }

    if (target === "desktop") setModalDesktopUploading(true);
    else setModalMobileUploading(true);

    try {
      const result = await uploadHeroBannerImage(file);
      if (editingSlide) {
        setEditingSlide({
          ...editingSlide,
          [target === "desktop" ? "imageUrl" : "mobileImageUrl"]: result.url,
          [target === "desktop" ? "imagePath" : "mobileImagePath"]: result.path,
        });
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload banner image.");
    } finally {
      if (target === "desktop") setModalDesktopUploading(false);
      else setModalMobileUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs sticky top-0 z-30 backdrop-blur-md">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#30372F] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C5A15A]" /> Dynamic Homepage CMS
          </h2>
          <p className="text-xs text-[#30372F]/60 mt-0.5">
            Manage multiple hero banners, reorder slides, and publish live
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-800 font-medium flex items-center gap-1 bg-emerald-50 px-3 py-1.5 border border-emerald-200 rounded">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Published to Homepage
            </span>
          )}
          <button
            onClick={handleOpenAddModal}
            className="bg-[#C5A15A] text-[#30372F] hover:bg-[#b08e45] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-2 rounded shadow-xs"
          >
            <Plus className="w-4 h-4" /> ADD NEW BANNER
          </button>
          <button
            onClick={handlePreview}
            className="border border-[#30372F]/20 text-[#30372F] hover:bg-[#F5EBDD] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-2 rounded"
          >
            <Eye className="w-4 h-4 text-[#C5A15A]" /> PREVIEW LIVE PAGE
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-[#30372F] text-[#F7F3EC] hover:bg-[#C5A15A] hover:text-[#30372F] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2 rounded disabled:opacity-50"
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>PUBLISH CHANGES</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {uploadSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 rounded shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          {uploadSuccessMsg}
        </div>
      )}

      {/* SECTION 1: HERO BANNERS MANAGEMENT GRID */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/15 p-6 shadow-sm space-y-6 rounded">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#30372F]/10 gap-3">
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#30372F] flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#C5A15A]" /> Homepage Hero Banners ({slides.length})
            </h3>
            <p className="text-xs text-[#30372F]/70 mt-0.5">
              Drag or reorder slides, upload high-res banners, and toggle active slides
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="border border-[#30372F]/20 text-[#30372F] hover:bg-[#F5EBDD] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 rounded self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#C5A15A]" /> Add Banner Slide
          </button>
        </div>

        {/* HERO BANNER CARDS GRID (3 Cards per row on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`bg-[#F8F5F0] border transition-all rounded overflow-hidden flex flex-col justify-between shadow-xs ${
                slide.isActive
                  ? "border-[#30372F]/20 hover:border-[#C5A15A]"
                  : "border-gray-300 opacity-60 bg-gray-50"
              }`}
            >
              {/* Card Image Header */}
              <div className="relative aspect-[16/9] w-full bg-[#30372F] overflow-hidden group">
                <img
                  src={slide.imageUrl || "/images/pearl-banner.png"}
                  alt={slide.subtitle}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/pearl-banner.png";
                  }}
                />

                {/* Top Badges */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
                  <span className="bg-[#30372F]/90 text-[#C5A15A] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    Order #{slide.displayOrder}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {slide.mobileImageUrl && (
                      <span
                        className="bg-purple-900/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs"
                        title="Has separate mobile image"
                      >
                        <Smartphone className="w-3 h-3" /> Mobile Image
                      </span>
                    )}
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-xs ${
                        slide.status === "Published"
                          ? "bg-emerald-800 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {slide.status}
                    </span>
                  </div>
                </div>

                {/* Gradient Text Overlay Preview */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3.5 flex flex-col justify-end text-white">
                  <span className="text-[9.5px] uppercase tracking-[0.2em] text-[#C5A15A] font-semibold truncate">
                    {slide.title}
                  </span>
                  <h4 className="font-serif text-base font-normal text-white truncate">
                    {slide.subtitle}
                  </h4>
                </div>
              </div>

              {/* Card Content & Details */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <p className="text-[#30372F]/80 text-[11px] line-clamp-2 italic">
                    "{slide.description}"
                  </p>
                  <div className="mt-2 pt-2 border-t border-[#30372F]/10 flex items-center justify-between text-[10px] text-[#30372F]/60">
                    <span>CTA: {slide.ctaText}</span>
                    <span className="font-mono">{slide.ctaLink}</span>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-3 border-t border-[#30372F]/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleSlideActive(slide.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#30372F] hover:text-[#C5A15A]"
                    >
                      {slide.isActive ? (
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      )}
                      <span>{slide.isActive ? "Active Slide" : "Disabled"}</span>
                    </button>

                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveSlide(index, "up")}
                        className="p-1 border border-[#30372F]/20 text-[#30372F] hover:bg-[#C5A15A] hover:text-[#30372F] disabled:opacity-30 rounded"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === slides.length - 1}
                        onClick={() => handleMoveSlide(index, "down")}
                        className="p-1 border border-[#30372F]/20 text-[#30372F] hover:bg-[#C5A15A] hover:text-[#30372F] disabled:opacity-30 rounded"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(slide)}
                      className="flex-1 bg-[#30372F] text-[#F5EBDD] hover:bg-[#C5A15A] hover:text-[#30372F] py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 rounded"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Slide
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlideToDelete(slide.id)}
                      className="border border-red-300 text-red-700 hover:bg-red-50 p-1.5 transition-colors rounded"
                      title="Remove Banner Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD / EDIT BANNER MODAL DIALOG */}
      {isModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFDF8] border border-[#30372F]/20 max-w-2xl w-full shadow-2xl rounded my-8 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 bg-[#30372F] text-[#F5EBDD]">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#C5A15A]" />
                {editingSlide.id.startsWith("slide-") &&
                !slides.some((s) => s.id === editingSlide.id)
                  ? "Add New Hero Banner Slide"
                  : `Edit Hero Banner #${editingSlide.displayOrder}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#F5EBDD] hover:text-[#C5A15A] transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-medium flex items-center gap-2 rounded">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {uploadError}
                </div>
              )}

              {/* DESKTOP IMAGE UPLOAD */}
              <div className="space-y-2">
                <label className="block font-bold text-[#30372F] uppercase tracking-wider">
                  Desktop Hero Image (16:9 Banner) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-6 relative aspect-[16/9] bg-[#30372F] rounded border border-[#30372F]/20 overflow-hidden">
                    <img
                      src={editingSlide.imageUrl || "/images/pearl-banner.png"}
                      alt="Desktop preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/pearl-banner.png";
                      }}
                    />
                  </div>
                  <div className="sm:col-span-6 space-y-2">
                    <label className="cursor-pointer bg-[#30372F] text-[#F5EBDD] hover:bg-[#C5A15A] hover:text-[#30372F] px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded w-full">
                      {modalDesktopUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>Upload Desktop Image</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleModalImageUpload(e.target.files[0], "desktop");
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or enter image URL..."
                      value={editingSlide.imageUrl}
                      onChange={(e) =>
                        setEditingSlide({
                          ...editingSlide,
                          imageUrl: e.target.value,
                        })
                      }
                      className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F] rounded"
                    />
                    <p className="text-[10px] text-[#30372F]/60">
                      Formats: JPG, PNG, WEBP • Max 10 MB
                    </p>
                  </div>
                </div>
              </div>

              {/* MOBILE IMAGE UPLOAD (OPTIONAL) */}
              <div className="space-y-2 pt-2 border-t border-[#30372F]/10">
                <label className="block font-bold text-[#30372F] uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#C5A15A]" /> Mobile Image (Optional 3:4 Crop)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4 relative aspect-[3/4] bg-[#30372F] rounded border border-[#30372F]/20 overflow-hidden max-h-32">
                    <img
                      src={
                        editingSlide.mobileImageUrl ||
                        editingSlide.imageUrl ||
                        "/images/pearl-banner-mobile.png"
                      }
                      alt="Mobile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="sm:col-span-8 space-y-2">
                    <label className="cursor-pointer border border-[#30372F]/20 text-[#30372F] hover:bg-[#F5EBDD] px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded w-full">
                      {modalMobileUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 text-[#C5A15A]" />
                      )}
                      <span>Upload Mobile Image</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleModalImageUpload(e.target.files[0], "mobile");
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Optional mobile image URL..."
                      value={editingSlide.mobileImageUrl || ""}
                      onChange={(e) =>
                        setEditingSlide({
                          ...editingSlide,
                          mobileImageUrl: e.target.value,
                        })
                      }
                      className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F] rounded"
                    />
                  </div>
                </div>
              </div>

              {/* SLIDE TEXT FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#30372F]/10">
                <div>
                  <label className="block font-medium text-[#30372F] mb-1">
                    Eyebrow / Subtitle Tagline
                  </label>
                  <input
                    type="text"
                    value={editingSlide.title}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, title: e.target.value })
                    }
                    className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F] rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#30372F] mb-1">
                    Main Banner Heading *
                  </label>
                  <input
                    type="text"
                    value={editingSlide.subtitle}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        subtitle: e.target.value,
                      })
                    }
                    className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F] rounded"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#30372F] mb-1">
                    Banner Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingSlide.description}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F] rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#30372F] mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={editingSlide.ctaText}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        ctaText: e.target.value,
                      })
                    }
                    className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F] rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#30372F] mb-1">
                    CTA Link Path
                  </label>
                  <input
                    type="text"
                    value={editingSlide.ctaLink}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        ctaLink: e.target.value,
                      })
                    }
                    className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F] rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#30372F] mb-1">
                    Image Position Focal Point
                  </label>
                  <select
                    value={editingSlide.imagePosition || "center center"}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        imagePosition: e.target.value as any,
                      })
                    }
                    className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F] rounded"
                  >
                    <option value="center center">Center Center (Default)</option>
                    <option value="center left">Center Left</option>
                    <option value="center right">Center Right (Model on Right)</option>
                    <option value="top center">Top Center</option>
                    <option value="bottom center">Bottom Center</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#30372F] mb-1">
                    Publish Status
                  </label>
                  <select
                    value={editingSlide.status}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2 text-xs text-[#30372F] rounded"
                  >
                    <option value="Published">Published (Live on site)</option>
                    <option value="Draft">Draft (Admin only)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between p-4 bg-[#F8F5F0] border-t border-[#30372F]/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingSlide.isActive}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      isActive: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-[#C5A15A]"
                />
                <span className="text-xs font-semibold text-[#30372F]">
                  Enable Active Slide
                </span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#30372F]/20 text-[#30372F] text-xs font-semibold uppercase tracking-wider hover:bg-[#F5EBDD] transition-colors rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalSlide}
                  className="px-5 py-2 bg-[#30372F] text-[#F5EBDD] hover:bg-[#C5A15A] hover:text-[#30372F] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm rounded"
                >
                  Save Banner Slide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE BANNER CONFIRMATION MODAL */}
      {slideToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#FFFDF8] border border-[#30372F]/20 p-6 max-w-md w-full shadow-2xl space-y-4 rounded">
            <h3 className="font-serif text-lg font-bold text-[#30372F] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" /> Remove Hero Banner Slide?
            </h3>
            <p className="text-xs text-[#30372F]/80 leading-relaxed">
              Are you sure you want to remove this hero banner slide? The customer-facing homepage carousel will automatically re-index the remaining slides.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSlideToDelete(null)}
                className="px-4 py-2 border border-[#30372F]/20 text-[#30372F] text-xs font-semibold uppercase tracking-wider hover:bg-[#F5EBDD] transition-colors rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoveSlide}
                className="px-4 py-2 bg-red-700 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-800 transition-colors shadow-sm rounded"
              >
                Remove Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: NEW ARRIVALS & DISCOVER CATEGORIES */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#30372F]/10">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#30372F]">
              2. New Arrivals & Category Curation
            </h3>
            <p className="text-xs text-[#30372F]/60">
              Product grid header and subtext on homepage
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-medium text-[#30372F]/70">
              Section Active
            </span>
            <input
              type="checkbox"
              checked={formData.discoverCategories.active}
              onChange={(e) =>
                updateSection("discoverCategories", "active", e.target.checked)
              }
              className="w-4 h-4 accent-[#C5A15A]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={formData.discoverCategories.title}
              onChange={(e) =>
                updateSection("discoverCategories", "title", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Section Subtitle
            </label>
            <input
              type="text"
              value={formData.discoverCategories.subtitle}
              onChange={(e) =>
                updateSection("discoverCategories", "subtitle", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: PEARL STORY NARRATIVE */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#30372F]/10">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#30372F]">
              3. Pearl Story Narrative Section
            </h3>
            <p className="text-xs text-[#30372F]/60">
              Brand legacy narrative block with side featured image
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-medium text-[#30372F]/70">
              Section Active
            </span>
            <input
              type="checkbox"
              checked={formData.pearlStory.active}
              onChange={(e) =>
                updateSection("pearlStory", "active", e.target.checked)
              }
              className="w-4 h-4 accent-[#C5A15A]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Heading Title
            </label>
            <input
              type="text"
              value={formData.pearlStory.heading}
              onChange={(e) =>
                updateSection("pearlStory", "heading", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Featured Image URL
            </label>
            <input
              type="text"
              value={formData.pearlStory.image}
              onChange={(e) =>
                updateSection("pearlStory", "image", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-[#30372F] mb-1">
              Narrative Content Body
            </label>
            <textarea
              rows={3}
              value={formData.pearlStory.content}
              onChange={(e) =>
                updateSection("pearlStory", "content", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              CTA Button Text
            </label>
            <input
              type="text"
              value={formData.pearlStory.ctaText}
              onChange={(e) =>
                updateSection("pearlStory", "ctaText", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              CTA Route Link
            </label>
            <input
              type="text"
              value={formData.pearlStory.ctaLink}
              onChange={(e) =>
                updateSection("pearlStory", "ctaLink", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: MASTER ARTISANRY & CRAFTSMANSHIP */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#30372F]/10">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#30372F]">
              4. Master Artisanry & Craftsmanship Section
            </h3>
            <p className="text-xs text-[#30372F]/60">
              5-step crafting sequence background and title
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-medium text-[#30372F]/70">
              Section Active
            </span>
            <input
              type="checkbox"
              checked={formData.craftsmanship.active}
              onChange={(e) =>
                updateSection("craftsmanship", "active", e.target.checked)
              }
              className="w-4 h-4 accent-[#C5A15A]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Heading Title
            </label>
            <input
              type="text"
              value={formData.craftsmanship.heading}
              onChange={(e) =>
                updateSection("craftsmanship", "heading", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Background Media URL
            </label>
            <input
              type="text"
              value={formData.craftsmanship.bgImage}
              onChange={(e) =>
                updateSection("craftsmanship", "bgImage", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-[#30372F] mb-1">
              Subtitle Description
            </label>
            <input
              type="text"
              value={formData.craftsmanship.subtitle}
              onChange={(e) =>
                updateSection("craftsmanship", "subtitle", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: BRIDAL CAMPAIGN */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#30372F]/10">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#30372F]">
              5. Sacred Bridal Campaign Section
            </h3>
            <p className="text-xs text-[#30372F]/60">
              Dedicated full-bleed bridal banner on homepage
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-medium text-[#30372F]/70">
              Section Active
            </span>
            <input
              type="checkbox"
              checked={formData.bridalSection.active}
              onChange={(e) =>
                updateSection("bridalSection", "active", e.target.checked)
              }
              className="w-4 h-4 accent-[#C5A15A]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Campaign Heading
            </label>
            <input
              type="text"
              value={formData.bridalSection.heading}
              onChange={(e) =>
                updateSection("bridalSection", "heading", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Bridal Image URL
            </label>
            <input
              type="text"
              value={formData.bridalSection.image}
              onChange={(e) =>
                updateSection("bridalSection", "image", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-[#30372F] mb-1">
              Campaign Subtitle
            </label>
            <textarea
              rows={2}
              value={formData.bridalSection.subtitle}
              onChange={(e) =>
                updateSection("bridalSection", "subtitle", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              CTA Button Text
            </label>
            <input
              type="text"
              value={formData.bridalSection.ctaText}
              onChange={(e) =>
                updateSection("bridalSection", "ctaText", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              CTA Route Link
            </label>
            <input
              type="text"
              value={formData.bridalSection.ctaLink}
              onChange={(e) =>
                updateSection("bridalSection", "ctaLink", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 6: PEARL EDUCATION SNIPPET */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#30372F]/10">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#30372F]">
              6. Pearl Education Snippet Section
            </h3>
            <p className="text-xs text-[#30372F]/60">
              Connoisseur guide section on homepage
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-medium text-[#30372F]/70">
              Section Active
            </span>
            <input
              type="checkbox"
              checked={formData.educationSection?.active ?? true}
              onChange={(e) =>
                updateSection(
                  "educationSection" as any,
                  "active",
                  e.target.checked,
                )
              }
              className="w-4 h-4 accent-[#C5A15A]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={formData.educationSection?.title ?? ""}
              onChange={(e) =>
                updateSection(
                  "educationSection" as any,
                  "title",
                  e.target.value,
                )
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Section Subtitle
            </label>
            <input
              type="text"
              value={formData.educationSection?.subtitle ?? ""}
              onChange={(e) =>
                updateSection(
                  "educationSection" as any,
                  "subtitle",
                  e.target.value,
                )
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 7: CORPORATE GIFTING */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#30372F]/10">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#30372F]">
              7. Corporate Gifting Section
            </h3>
            <p className="text-xs text-[#30372F]/60">
              Corporate bespoke gifting banner on homepage
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-medium text-[#30372F]/70">
              Section Active
            </span>
            <input
              type="checkbox"
              checked={formData.giftingSection?.active ?? true}
              onChange={(e) =>
                updateSection(
                  "giftingSection" as any,
                  "active",
                  e.target.checked,
                )
              }
              className="w-4 h-4 accent-[#C5A15A]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={formData.giftingSection?.title ?? ""}
              onChange={(e) =>
                updateSection("giftingSection" as any, "title", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Packaging Image URL
            </label>
            <input
              type="text"
              value={formData.giftingSection?.image ?? ""}
              onChange={(e) =>
                updateSection("giftingSection" as any, "image", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-[#30372F] mb-1">
              Section Subtitle
            </label>
            <textarea
              rows={2}
              value={formData.giftingSection?.subtitle ?? ""}
              onChange={(e) =>
                updateSection(
                  "giftingSection" as any,
                  "subtitle",
                  e.target.value,
                )
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 8: EDITORIAL GALLERY */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#30372F]/10">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#30372F]">
              8. Editorial Gallery Section
            </h3>
            <p className="text-xs text-[#30372F]/60">
              Visual Instagram editorial grid heading on homepage
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-medium text-[#30372F]/70">
              Section Active
            </span>
            <input
              type="checkbox"
              checked={formData.editorialGallery?.active ?? true}
              onChange={(e) =>
                updateSection(
                  "editorialGallery" as any,
                  "active",
                  e.target.checked,
                )
              }
              className="w-4 h-4 accent-[#C5A15A]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Gallery Title
            </label>
            <input
              type="text"
              value={formData.editorialGallery?.title ?? ""}
              onChange={(e) =>
                updateSection(
                  "editorialGallery" as any,
                  "title",
                  e.target.value,
                )
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 9: INNER CIRCLE NEWSLETTER */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#30372F]/10">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#30372F]">
              9. Inner Circle Newsletter Section
            </h3>
            <p className="text-xs text-[#30372F]/60">
              VIP newsletter signup subscription block on homepage
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-medium text-[#30372F]/70">
              Section Active
            </span>
            <input
              type="checkbox"
              checked={formData.newsletter.active}
              onChange={(e) =>
                updateSection("newsletter", "active", e.target.checked)
              }
              className="w-4 h-4 accent-[#C5A15A]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Newsletter Title
            </label>
            <input
              type="text"
              value={formData.newsletter.title}
              onChange={(e) =>
                updateSection("newsletter", "title", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#30372F] mb-1">
              Subtitle Invitation
            </label>
            <input
              type="text"
              value={formData.newsletter.subtitle}
              onChange={(e) =>
                updateSection("newsletter", "subtitle", e.target.value)
              }
              className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
