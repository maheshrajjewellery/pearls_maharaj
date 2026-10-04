import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAdmin } from "../../context/AdminContext";
import {
  CorporateEnquiry,
  CorporateEnquiryStatus,
  CorporateEnquiryEvent,
  QuotationDetails,
  STAFF_MEMBERS,
  fetchCorporateEnquiriesFromDb,
  updateEnquiryStatusInDb,
  addEnquiryInternalNoteInDb,
  assignStaffToEnquiryInDb,
  recordQuotationInDb,
  convertEnquiryInDb,
  archiveEnquiryInDb,
  deleteEnquiryPermanentlyFromDb,
  exportEnquiriesToCSV,
} from "@/services/corporateEnquiryService";
import {
  Briefcase,
  Mail,
  Phone,
  Building,
  Calendar,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  Clock,
  User,
  Copy,
  FileText,
  Send,
  Download,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Tag,
  Globe,
  Archive,
  ExternalLink,
  Check,
  Plus,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const CorporateGiftingView: React.FC = () => {
  const { addToast, requestConfirmation, adminUser } = useAdmin();

  // State
  const [enquiries, setEnquiries] = useState<CorporateEnquiry[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalEnquiries: 0,
    newEnquiries: 0,
    contactedEnquiries: 0,
    inDiscussionEnquiries: 0,
    quotationSentEnquiries: 0,
    convertedEnquiries: 0,
    closedEnquiries: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Filters & Search State
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [budgetFilter, setBudgetFilter] = useState<string>("All");
  const [quantityFilter, setQuantityFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showArchived, setShowArchived] = useState<boolean>(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Detail Drawer State
  const [selectedEnquiry, setSelectedEnquiry] =
    useState<CorporateEnquiry | null>(null);

  // Form states in detail drawer
  const [internalNoteInput, setInternalNoteInput] = useState<string>("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [quotationAmount, setQuotationAmount] = useState<string>("");
  const [quotationValidUntil, setQuotationValidUntil] = useState<string>("");
  const [quotationRef, setQuotationRef] = useState<string>("");
  const [quotationNotes, setQuotationNotes] = useState<string>("");
  const [showQuotationForm, setShowQuotationForm] = useState<boolean>(false);

  // Copy Feedback state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Load Enquiries from Database / Service
  const loadEnquiries = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetchCorporateEnquiriesFromDb({
        status: statusFilter,
        dateFilter,
        startDate: dateFilter === "Custom" ? startDate : undefined,
        endDate: dateFilter === "Custom" ? endDate : undefined,
        budgetFilter,
        quantityFilter,
        searchTerm,
        page: currentPage,
        pageSize,
        showArchived,
      });

      setEnquiries(res.enquiries);
      setDashboardStats(res.dashboardStats);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Error loading corporate enquiries:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [
    statusFilter,
    dateFilter,
    startDate,
    endDate,
    budgetFilter,
    quantityFilter,
    searchTerm,
    currentPage,
    pageSize,
    showArchived,
  ]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  // Handle drawer selection update
  const handleSelectEnquiry = (enquiry: CorporateEnquiry) => {
    setSelectedEnquiry(enquiry);
    setInternalNoteInput(enquiry.internalNotes || "");
    setSelectedStaffId(enquiry.assignedTo || "");
    if (enquiry.quotation) {
      setQuotationAmount(
        enquiry.quotation.amount ? String(enquiry.quotation.amount) : "",
      );
      setQuotationValidUntil(
        enquiry.quotation.validUntil
          ? enquiry.quotation.validUntil.split("T")[0]
          : "",
      );
      setQuotationRef(enquiry.quotation.quotationRef || "");
      setQuotationNotes(enquiry.quotation.notes || "");
    } else {
      setQuotationAmount("");
      setQuotationValidUntil("");
      setQuotationRef("");
      setQuotationNotes("");
    }
    setShowQuotationForm(false);
  };

  // Copy Helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    addToast(`Copied ${label} to clipboard!`, "info");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Status Change Action
  const handleUpdateStatus = async (
    id: string,
    newStatus: CorporateEnquiryStatus,
  ) => {
    const res = await updateEnquiryStatusInDb(
      id,
      newStatus,
      undefined,
      adminUser?.name || "Admin",
    );
    if (res.success && res.enquiry) {
      addToast(
        `Enquiry ${res.enquiry.enquiryNumber} status updated to '${newStatus}'`,
        "success",
      );
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(res.enquiry);
      }
      loadEnquiries();
    } else {
      addToast(res.errorMessage || "Failed to update status", "error");
    }
  };

  // Internal Note Action
  const handleAddInternalNote = async () => {
    if (!selectedEnquiry || !internalNoteInput.trim()) return;
    const res = await addEnquiryInternalNoteInDb(
      selectedEnquiry.id,
      internalNoteInput.trim(),
      adminUser?.name || "Admin",
    );
    if (res.success && res.enquiry) {
      addToast("Internal note saved successfully", "success");
      setSelectedEnquiry(res.enquiry);
      loadEnquiries();
    }
  };

  // Staff Assignment Action
  const handleAssignStaff = async () => {
    if (!selectedEnquiry) return;
    const staffId = selectedStaffId || null;
    const res = await assignStaffToEnquiryInDb(
      selectedEnquiry.id,
      staffId,
      adminUser?.name || "Admin",
    );
    if (res.success && res.enquiry) {
      addToast(
        staffId
          ? `Assigned to ${res.enquiry.assignedToName}`
          : "Enquiry unassigned",
        "success",
      );
      setSelectedEnquiry(res.enquiry);
      loadEnquiries();
    }
  };

  // Record Quotation Action
  const handleRecordQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    const amountNum = parseFloat(quotationAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      addToast("Please enter a valid quotation amount", "warning");
      return;
    }

    const res = await recordQuotationInDb(
      selectedEnquiry.id,
      {
        amount: amountNum,
        validUntil: quotationValidUntil || undefined,
        quotationRef: quotationRef || undefined,
        notes: quotationNotes || undefined,
      },
      adminUser?.name || "Admin",
    );

    if (res.success && res.enquiry) {
      addToast(
        `Quotation #${res.enquiry.quotation?.quotationRef} recorded successfully!`,
        "success",
      );
      setSelectedEnquiry(res.enquiry);
      setShowQuotationForm(false);
      loadEnquiries();
    }
  };

  // Convert Enquiry Action
  const handleConvertEnquiry = (id: string) => {
    requestConfirmation({
      title: "Convert Corporate Enquiry",
      message:
        'Converting this enquiry will confirm the corporate request and generate an official Corporate Order record. The original enquiry will be preserved with a "Converted" status badge. Proceed?',
      confirmText: "Convert Enquiry",
      isDanger: false,
      onConfirm: async () => {
        const res = await convertEnquiryInDb(id, adminUser?.name || "Admin");
        if (res.success && res.enquiry) {
          addToast(
            `Enquiry ${res.enquiry.enquiryNumber} converted to Corporate Order #${res.orderId}!`,
            "success",
          );
          if (selectedEnquiry?.id === id) {
            setSelectedEnquiry(res.enquiry);
          }
          loadEnquiries();
        } else {
          addToast(res.errorMessage || "Failed to convert enquiry", "error");
        }
      },
    });
  };

  // Archive Action
  const handleArchive = (id: string) => {
    requestConfirmation({
      title: "Archive Corporate Enquiry",
      message: "Are you sure you want to move this enquiry to the archive?",
      confirmText: "Archive",
      isDanger: false,
      onConfirm: async () => {
        const res = await archiveEnquiryInDb(id, adminUser?.name || "Admin");
        if (res.success) {
          addToast("Enquiry moved to archive", "info");
          if (selectedEnquiry?.id === id) {
            setSelectedEnquiry(null);
          }
          loadEnquiries();
        }
      },
    });
  };

  // Permanent Delete Action
  const handleDeletePermanent = (id: string) => {
    requestConfirmation({
      title: "Permanently Delete Enquiry",
      message:
        "WARNING: This action is permanent and cannot be undone. All original requirements, quotes, and timeline history for this enquiry will be erased. Are you strictly sure?",
      confirmText: "Delete Permanently",
      isDanger: true,
      onConfirm: async () => {
        const res = await deleteEnquiryPermanentlyFromDb(id);
        if (res.success) {
          addToast("Enquiry permanently deleted", "warning");
          if (selectedEnquiry?.id === id) {
            setSelectedEnquiry(null);
          }
          loadEnquiries();
        }
      },
    });
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status: CorporateEnquiryStatus) => {
    switch (status) {
      case "New":
        return (
          <span className="px-2.5 py-1 text-[10px] bg-amber-100 text-amber-900 font-bold border border-amber-300 rounded-xs uppercase tracking-wider">
            New
          </span>
        );
      case "Contacted":
        return (
          <span className="px-2.5 py-1 text-[10px] bg-blue-100 text-blue-900 font-bold border border-blue-300 rounded-xs uppercase tracking-wider">
            Contacted
          </span>
        );
      case "In Discussion":
        return (
          <span className="px-2.5 py-1 text-[10px] bg-purple-100 text-purple-900 font-bold border border-purple-300 rounded-xs uppercase tracking-wider">
            In Discussion
          </span>
        );
      case "Quotation Sent":
        return (
          <span className="px-2.5 py-1 text-[10px] bg-indigo-100 text-indigo-900 font-bold border border-indigo-300 rounded-xs uppercase tracking-wider">
            Quotation Sent
          </span>
        );
      case "Converted":
        return (
          <span className="px-2.5 py-1 text-[10px] bg-emerald-100 text-emerald-950 font-bold border border-emerald-400 rounded-xs uppercase tracking-wider">
            Converted
          </span>
        );
      case "Closed":
        return (
          <span className="px-2.5 py-1 text-[10px] bg-gray-200 text-gray-800 font-bold border border-gray-300 rounded-xs uppercase tracking-wider">
            Closed
          </span>
        );
      case "Rejected":
        return (
          <span className="px-2.5 py-1 text-[10px] bg-red-100 text-red-900 font-bold border border-red-300 rounded-xs uppercase tracking-wider">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[10px] bg-gray-100 text-gray-800 font-bold rounded-xs">
            {status}
          </span>
        );
    }
  };

  const resetFilters = () => {
    setStatusFilter("All");
    setDateFilter("All");
    setStartDate("");
    setEndDate("");
    setBudgetFilter("All");
    setQuantityFilter("All");
    setSearchTerm("");
    setShowArchived(false);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. TOP HEADER & TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#30372F]/10 p-6 shadow-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A15A] font-bold">
            ADMIN PANEL MODULE
          </span>
          <h2 className="font-serif text-2xl font-semibold text-[#30372F] mt-0.5">
            Corporate Gifting Enquiries
          </h2>
          <p className="text-xs text-[#30372F]/70 mt-1">
            Receive, track, assign staff, send quotations, and convert corporate
            client requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportEnquiriesToCSV(enquiries)}
            disabled={enquiries.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F1EB] hover:bg-[#F5EBDD] text-[#30372F] border border-[#30372F]/20 text-xs font-semibold uppercase tracking-wider transition-all duration-200 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#C5A15A]" />
            <span>Export Enquiries</span>
          </button>

          <button
            onClick={loadEnquiries}
            className="p-2 bg-[#F5F1EB] hover:bg-[#F5EBDD] text-[#30372F] border border-[#30372F]/20 transition-all duration-200"
            title="Refresh Database"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-[#C5A15A]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* 2. REAL ENQUIRY DASHBOARD STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total */}
        <button
          onClick={() => {
            setStatusFilter("All");
            setShowArchived(false);
            setCurrentPage(1);
          }}
          className={`p-4 text-left border transition-all duration-200 ${
            statusFilter === "All" && !showArchived
              ? "bg-[#30372F] text-[#FFFDF8] border-[#30372F] shadow-md"
              : "bg-[#FFFDF8] hover:bg-[#F5F1EB] text-[#30372F] border-[#30372F]/10"
          }`}
        >
          <span className="block text-[10px] uppercase tracking-wider font-semibold opacity-70">
            Total
          </span>
          <span className="block text-xl font-serif font-bold mt-1">
            {dashboardStats.totalEnquiries}
          </span>
        </button>

        {/* New */}
        <button
          onClick={() => {
            setStatusFilter("New");
            setShowArchived(false);
            setCurrentPage(1);
          }}
          className={`p-4 text-left border transition-all duration-200 ${
            statusFilter === "New"
              ? "bg-amber-900 text-amber-50 border-amber-900 shadow-md"
              : "bg-[#FFFDF8] hover:bg-amber-50/50 text-[#30372F] border-[#30372F]/10"
          }`}
        >
          <span className="block text-[10px] uppercase tracking-wider font-semibold text-amber-800">
            New
          </span>
          <span className="block text-xl font-serif font-bold text-amber-900 mt-1">
            {dashboardStats.newEnquiries}
          </span>
        </button>

        {/* Contacted */}
        <button
          onClick={() => {
            setStatusFilter("Contacted");
            setShowArchived(false);
            setCurrentPage(1);
          }}
          className={`p-4 text-left border transition-all duration-200 ${
            statusFilter === "Contacted"
              ? "bg-blue-900 text-blue-50 border-blue-900 shadow-md"
              : "bg-[#FFFDF8] hover:bg-blue-50/50 text-[#30372F] border-[#30372F]/10"
          }`}
        >
          <span className="block text-[10px] uppercase tracking-wider font-semibold text-blue-800">
            Contacted
          </span>
          <span className="block text-xl font-serif font-bold text-blue-900 mt-1">
            {dashboardStats.contactedEnquiries}
          </span>
        </button>

        {/* In Discussion */}
        <button
          onClick={() => {
            setStatusFilter("In Discussion");
            setShowArchived(false);
            setCurrentPage(1);
          }}
          className={`p-4 text-left border transition-all duration-200 ${
            statusFilter === "In Discussion"
              ? "bg-purple-900 text-purple-50 border-purple-900 shadow-md"
              : "bg-[#FFFDF8] hover:bg-purple-50/50 text-[#30372F] border-[#30372F]/10"
          }`}
        >
          <span className="block text-[10px] uppercase tracking-wider font-semibold text-purple-800">
            In Discussion
          </span>
          <span className="block text-xl font-serif font-bold text-purple-900 mt-1">
            {dashboardStats.inDiscussionEnquiries}
          </span>
        </button>

        {/* Quotation Sent */}
        <button
          onClick={() => {
            setStatusFilter("Quotation Sent");
            setShowArchived(false);
            setCurrentPage(1);
          }}
          className={`p-4 text-left border transition-all duration-200 ${
            statusFilter === "Quotation Sent"
              ? "bg-indigo-900 text-indigo-50 border-indigo-900 shadow-md"
              : "bg-[#FFFDF8] hover:bg-indigo-50/50 text-[#30372F] border-[#30372F]/10"
          }`}
        >
          <span className="block text-[10px] uppercase tracking-wider font-semibold text-indigo-800">
            Quotation Sent
          </span>
          <span className="block text-xl font-serif font-bold text-indigo-900 mt-1">
            {dashboardStats.quotationSentEnquiries}
          </span>
        </button>

        {/* Converted */}
        <button
          onClick={() => {
            setStatusFilter("Converted");
            setShowArchived(false);
            setCurrentPage(1);
          }}
          className={`p-4 text-left border transition-all duration-200 ${
            statusFilter === "Converted"
              ? "bg-emerald-900 text-emerald-50 border-emerald-900 shadow-md"
              : "bg-[#FFFDF8] hover:bg-emerald-50/50 text-[#30372F] border-[#30372F]/10"
          }`}
        >
          <span className="block text-[10px] uppercase tracking-wider font-semibold text-emerald-800">
            Converted
          </span>
          <span className="block text-xl font-serif font-bold text-emerald-950 mt-1">
            {dashboardStats.convertedEnquiries}
          </span>
        </button>

        {/* Closed */}
        <button
          onClick={() => {
            setStatusFilter("Closed");
            setShowArchived(false);
            setCurrentPage(1);
          }}
          className={`p-4 text-left border transition-all duration-200 ${
            statusFilter === "Closed"
              ? "bg-gray-800 text-gray-50 border-gray-800 shadow-md"
              : "bg-[#FFFDF8] hover:bg-gray-50 text-[#30372F] border-[#30372F]/10"
          }`}
        >
          <span className="block text-[10px] uppercase tracking-wider font-semibold text-gray-600">
            Closed
          </span>
          <span className="block text-xl font-serif font-bold text-gray-800 mt-1">
            {dashboardStats.closedEnquiries}
          </span>
        </button>
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* SEARCH INPUT */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#30372F]/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search enquiries by ID, company, contact person, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F1EB] border border-[#30372F]/15 text-xs text-[#30372F] placeholder:text-[#30372F]/40 focus:outline-none focus:border-[#C5A15A]"
            />
          </div>

          {/* STATUS FILTER */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-[#F5F1EB] border border-[#30372F]/15 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="All">Status: All Statuses</option>
              <option value="New">Status: New</option>
              <option value="Contacted">Status: Contacted</option>
              <option value="In Discussion">Status: In Discussion</option>
              <option value="Quotation Sent">Status: Quotation Sent</option>
              <option value="Converted">Status: Converted</option>
              <option value="Closed">Status: Closed</option>
              <option value="Rejected">Status: Rejected</option>
              <option value="Archived">Status: Archived Only</option>
            </select>
          </div>

          {/* DATE FILTER */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-[#F5F1EB] border border-[#30372F]/15 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="All">Date: All Time</option>
              <option value="Today">Date: Today</option>
              <option value="Last 7 days">Date: Last 7 days</option>
              <option value="Last 30 days">Date: Last 30 days</option>
              <option value="Custom">Date: Custom Range</option>
            </select>
          </div>
        </div>

        {/* CUSTOM DATE RANGE ROW & SECONDARY FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#30372F]/5">
          {/* BUDGET FILTER */}
          <div>
            <select
              value={budgetFilter}
              onChange={(e) => {
                setBudgetFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[#F5F1EB] border border-[#30372F]/15 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="All">Budget: All Ranges</option>
              <option value="Under ₹25,000">Under ₹25,000</option>
              <option value="₹25,000–₹50,000">₹25,000–₹50,000</option>
              <option value="₹50,000–₹1,00,000">₹50,000–₹1,00,000</option>
              <option value="₹1,00,000+">₹1,00,000+</option>
            </select>
          </div>

          {/* QUANTITY FILTER */}
          <div>
            <select
              value={quantityFilter}
              onChange={(e) => {
                setQuantityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[#F5F1EB] border border-[#30372F]/15 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="All">Quantity: All Quantities</option>
              <option value="Under 25">Under 25 Gifts</option>
              <option value="25–50">25–50 Gifts</option>
              <option value="50–100">50–100 Gifts</option>
              <option value="100+">100+ Gifts</option>
            </select>
          </div>

          {/* PAGE SIZE SELECT */}
          <div>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[#F5F1EB] border border-[#30372F]/15 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
            >
              <option value={10}>Show 10 per page</option>
              <option value={25}>Show 25 per page</option>
              <option value={50}>Show 50 per page</option>
            </select>
          </div>

          {/* RESET BUTTON */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#30372F]/70 hover:text-[#30372F] underline transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>

        {/* CUSTOM DATE PICKERS (Conditional) */}
        {dateFilter === "Custom" && (
          <div className="flex flex-wrap items-center gap-4 p-3 bg-[#F5F1EB] border border-[#30372F]/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#30372F]">Start Date:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#FFFDF8] border border-[#30372F]/15 px-2.5 py-1 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#30372F]">End Date:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#FFFDF8] border border-[#30372F]/15 px-2.5 py-1 text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. MAIN ENQUIRIES CONTENT */}
      {isLoading ? (
        /* LOADING STATE */
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-12 text-center shadow-xs">
          <div className="inline-block p-4 rounded-full bg-[#F5F1EB] mb-4">
            <RefreshCw className="w-8 h-8 text-[#C5A15A] animate-spin" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#30372F]">
            Loading enquiries...
          </h3>
          <p className="text-xs text-[#30372F]/60 mt-1">
            Retrieving corporate data from backend database
          </p>
        </div>
      ) : isError ? (
        /* ERROR STATE */
        <div className="bg-[#FFFDF8] border border-red-200 p-12 text-center shadow-xs">
          <div className="inline-block p-4 rounded-full bg-red-50 text-red-700 mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-red-900">
            Unable to load enquiries.
          </h3>
          <p className="text-xs text-red-700/80 mt-1 mb-6">
            Failed to connect to backend server or database schema.
          </p>
          <button
            onClick={loadEnquiries}
            className="px-6 py-2.5 bg-[#30372F] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider hover:bg-[#C5A15A] hover:text-[#30372F] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : enquiries.length === 0 ? (
        /* EMPTY STATE */
        <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-12 text-center shadow-xs">
          <div className="inline-block p-4 rounded-full bg-[#F5F1EB] text-[#C5A15A] mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#30372F]">
            No corporate gifting enquiries found.
          </h3>
          <p className="text-xs text-[#30372F]/60 mt-1 mb-6">
            Try adjusting your filters, search term, or date range.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-[#30372F] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider hover:bg-[#C5A15A] hover:text-[#30372F] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* TABLE & CARDS */
        <>
          {/* DESKTOP / TABLET TABLE */}
          <div className="hidden md:block bg-[#FFFDF8] border border-[#30372F]/10 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#30372F]/10 text-[#30372F]/60 uppercase tracking-widest text-[10px] bg-[#F5F1EB]">
                    <th className="p-3.5">Enquiry ID</th>
                    <th className="p-3.5">Company Name</th>
                    <th className="p-3.5">Contact Person</th>
                    <th className="p-3.5">Email / Phone</th>
                    <th className="p-3.5 text-center">Gifts Qty</th>
                    <th className="p-3.5">Budget Range</th>
                    <th className="p-3.5">Submitted Date</th>
                    <th className="p-3.5">Enquiry Status</th>
                    <th className="p-3.5">Assigned To</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30372F]/5">
                  {enquiries.map((enq) => (
                    <tr
                      key={enq.id}
                      className="hover:bg-[#F5F1EB]/50 transition-colors cursor-pointer"
                      onClick={() => handleSelectEnquiry(enq)}
                    >
                      <td className="p-3.5 font-mono font-bold text-[#30372F]">
                        {enq.enquiryNumber}
                      </td>
                      <td className="p-3.5">
                        <p className="font-semibold text-[#30372F]">
                          {enq.companyName}
                        </p>
                        {enq.companyType && (
                          <p className="text-[10px] text-[#30372F]/50">
                            {enq.companyType}
                          </p>
                        )}
                      </td>
                      <td className="p-3.5">
                        <p className="font-medium text-[#30372F]">
                          {enq.contactName}
                        </p>
                        {enq.designation && (
                          <p className="text-[10px] text-[#30372F]/50">
                            {enq.designation}
                          </p>
                        )}
                      </td>
                      <td
                        className="p-3.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-[#30372F]/80">
                            <span className="truncate max-w-[140px]">
                              {enq.email}
                            </span>
                            <button
                              onClick={() => handleCopy(enq.email, "Email")}
                              className="text-[#30372F]/40 hover:text-[#C5A15A] p-0.5"
                              title="Copy Email"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-[#30372F]/60">
                            <span>{enq.phone}</span>
                            <button
                              onClick={() => handleCopy(enq.phone, "Phone")}
                              className="text-[#30372F]/40 hover:text-[#C5A15A] p-0.5"
                              title="Copy Phone"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-bold text-[#C5A15A]">
                        {enq.quantity}
                      </td>
                      <td className="p-3.5 text-[#30372F]/80">{enq.budget}</td>
                      <td className="p-3.5 text-[#30372F]/60 font-mono text-[11px]">
                        {enq.createdAt.split("T")[0]}
                      </td>
                      <td className="p-3.5">{getStatusBadge(enq.status)}</td>
                      <td className="p-3.5 text-[11px] text-[#30372F]/80">
                        {enq.assignedToName ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F5F1EB] border border-[#30372F]/15 font-medium">
                            <User className="w-3 h-3 text-[#C5A15A]" />
                            {enq.assignedToName.split("(")[0]}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td
                        className="p-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSelectEnquiry(enq)}
                            className="p-1.5 text-[#30372F]/60 hover:text-[#C5A15A] transition-colors"
                            title="View Enquiry Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <a
                            href={`mailto:${enq.email}?subject=Regarding%20Corporate%20Gifting%20Enquiry%20${enq.enquiryNumber}`}
                            className="p-1.5 text-[#30372F]/60 hover:text-blue-700 transition-colors"
                            title="Email Customer"
                          >
                            <Mail className="w-4 h-4" />
                          </a>

                          <a
                            href={`tel:${enq.phone}`}
                            className="p-1.5 text-[#30372F]/60 hover:text-emerald-700 transition-colors"
                            title="Call Customer"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => handleArchive(enq.id)}
                            className="p-1.5 text-[#30372F]/60 hover:text-amber-800 transition-colors"
                            title="Archive Enquiry"
                          >
                            <Archive className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeletePermanent(enq.id)}
                            className="p-1.5 text-[#30372F]/60 hover:text-red-700 transition-colors"
                            title="Permanently Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE RESPONSIVE CARDS */}
          <div className="md:hidden space-y-3">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                onClick={() => handleSelectEnquiry(enq)}
                className="bg-[#FFFDF8] border border-[#30372F]/10 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#30372F] text-xs">
                    {enq.enquiryNumber}
                  </span>
                  <div>{getStatusBadge(enq.status)}</div>
                </div>

                <div>
                  <h4 className="font-serif text-base font-semibold text-[#30372F]">
                    {enq.companyName}
                  </h4>
                  <p className="text-xs text-[#30372F]/80">
                    {enq.contactName} ({enq.designation || "Contact"})
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#F5F1EB] p-2.5 border border-[#30372F]/10">
                  <div>
                    <span className="text-[10px] text-[#30372F]/50 uppercase block">
                      Gifts Qty
                    </span>
                    <span className="font-bold text-[#C5A15A]">
                      {enq.quantity} Units
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#30372F]/50 uppercase block">
                      Budget
                    </span>
                    <span className="font-medium text-[#30372F]">
                      {enq.budget}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#30372F]/10 text-xs">
                  <span className="text-[#30372F]/50 font-mono text-[10px]">
                    {enq.createdAt.split("T")[0]}
                  </span>
                  <button
                    onClick={() => handleSelectEnquiry(enq)}
                    className="inline-flex items-center gap-1 text-[#C5A15A] font-semibold"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 5. SERVER-SIDE PAGINATION CONTROLS */}
          <div className="bg-[#FFFDF8] border border-[#30372F]/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs text-xs">
            <div className="text-[#30372F]/70">
              Showing{" "}
              <span className="font-bold text-[#30372F]">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-[#30372F]">
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              of <span className="font-bold text-[#30372F]">{totalCount}</span>{" "}
              enquiries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-[#F5F1EB] border border-[#30372F]/15 hover:bg-[#F5EBDD] disabled:opacity-50 flex items-center gap-1 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="px-3 py-1 bg-[#30372F] text-[#FFFDF8] font-bold font-mono">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 bg-[#F5F1EB] border border-[#30372F]/15 hover:bg-[#F5EBDD] disabled:opacity-50 flex items-center gap-1 font-medium"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* 6. DEDICATED ENQUIRY DETAILS SIDE DRAWER / MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#30372F]/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FFFDF8] w-full max-w-3xl h-full flex flex-col shadow-2xl border-l border-[#30372F]/20 overflow-hidden">
            {/* DRAWER HEADER */}
            <div className="p-6 bg-[#F5F1EB] border-b border-[#30372F]/15 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#C5A15A] uppercase tracking-wider">
                    {selectedEnquiry.enquiryNumber}
                  </span>
                  {getStatusBadge(selectedEnquiry.status)}
                  {selectedEnquiry.isArchived && (
                    <span className="px-2 py-0.5 text-[10px] bg-amber-200 text-amber-950 font-bold border border-amber-400">
                      Archived
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#30372F] mt-1">
                  {selectedEnquiry.companyName}
                </h3>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 text-[#30372F]/50 hover:text-[#30372F] hover:bg-[#F5EBDD]/50 rounded-xs"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* ACTION TOOLBAR INSIDE DRAWER */}
            <div className="p-4 bg-[#FFFDF8] border-b border-[#30372F]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Corporate%20Gifting%20Enquiry%20${selectedEnquiry.enquiryNumber}`}
                  className="px-3 py-1.5 bg-[#30372F] text-[#FFFDF8] hover:bg-[#C5A15A] hover:text-[#30372F] font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Customer</span>
                </a>

                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="px-3 py-1.5 bg-[#F5F1EB] border border-[#30372F]/15 hover:bg-[#F5EBDD] font-semibold transition-colors flex items-center gap-1.5 text-[#30372F]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Customer</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                {selectedEnquiry.status !== "Converted" && (
                  <button
                    onClick={() => handleConvertEnquiry(selectedEnquiry.id)}
                    className="px-3 py-1.5 bg-emerald-800 text-emerald-50 hover:bg-emerald-700 font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Convert Enquiry</span>
                  </button>
                )}

                <button
                  onClick={() => handleArchive(selectedEnquiry.id)}
                  className="px-3 py-1.5 bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive</span>
                </button>
              </div>
            </div>

            {/* DRAWER BODY (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* CONVERTED BADGE PROMINENT DISPLAY */}
              {selectedEnquiry.status === "Converted" && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <div>
                      <p className="font-bold text-sm">
                        Converted From Enquiry: {selectedEnquiry.enquiryNumber}
                      </p>
                      <p className="text-[11px] text-emerald-800">
                        Active Corporate Order Reference: #
                        {selectedEnquiry.convertedOrderId || "CORP-ORD-902"}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-200 text-emerald-950 font-bold uppercase tracking-wider text-[10px]">
                    Confirmed Contract
                  </span>
                </div>
              )}

              {/* SECTION A: COMPANY & CONTACT INFORMATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Information */}
                <div className="bg-[#F5F1EB] p-4 border border-[#30372F]/10 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A15A] font-bold">
                    Company Information
                  </span>
                  <div>
                    <span className="text-[10px] text-[#30372F]/50 block uppercase">
                      Company Name
                    </span>
                    <span className="font-bold text-sm text-[#30372F]">
                      {selectedEnquiry.companyName}
                    </span>
                  </div>
                  {selectedEnquiry.companyType && (
                    <div>
                      <span className="text-[10px] text-[#30372F]/50 block uppercase">
                        Organization Type
                      </span>
                      <span className="font-medium text-[#30372F]">
                        {selectedEnquiry.companyType}
                      </span>
                    </div>
                  )}
                  {selectedEnquiry.website && (
                    <div>
                      <span className="text-[10px] text-[#30372F]/50 block uppercase">
                        Company Website
                      </span>
                      <a
                        href={
                          selectedEnquiry.website.startsWith("http")
                            ? selectedEnquiry.website
                            : `https://${selectedEnquiry.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#C5A15A] hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <span>{selectedEnquiry.website}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="bg-[#F5F1EB] p-4 border border-[#30372F]/10 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A15A] font-bold">
                    Contact Information
                  </span>
                  <div>
                    <span className="text-[10px] text-[#30372F]/50 block uppercase">
                      Contact Person
                    </span>
                    <span className="font-bold text-sm text-[#30372F]">
                      {selectedEnquiry.contactName}
                    </span>
                    {selectedEnquiry.designation && (
                      <span className="text-xs text-[#30372F]/70 block">
                        {selectedEnquiry.designation}
                      </span>
                    )}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[#30372F]/80">
                      <span>Email: {selectedEnquiry.email}</span>
                      <button
                        onClick={() =>
                          handleCopy(selectedEnquiry.email, "Email")
                        }
                        className="text-[#C5A15A] font-semibold text-[10px]"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[#30372F]/80 mt-1">
                      <span>Phone: {selectedEnquiry.phone}</span>
                      <button
                        onClick={() =>
                          handleCopy(selectedEnquiry.phone, "Phone")
                        }
                        className="text-[#C5A15A] font-semibold text-[10px]"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: COMPLETE ORIGINAL REQUIREMENTS */}
              <div className="bg-[#FFFDF8] border border-[#30372F]/15 p-5 space-y-4">
                <h4 className="font-serif text-base font-semibold text-[#30372F] border-b border-[#30372F]/10 pb-2">
                  Submitted Enquiry Requirements
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-[#30372F]/50 uppercase block font-medium">
                      Number of Gifts
                    </span>
                    <span className="font-bold text-sm text-[#C5A15A]">
                      {selectedEnquiry.quantity} Units
                    </span>
                    <span className="text-[11px] text-[#30372F]/60 block">
                      {selectedEnquiry.quantityRange}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#30372F]/50 uppercase block font-medium">
                      Budget Range
                    </span>
                    <span className="font-bold text-sm text-[#30372F]">
                      {selectedEnquiry.budget}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#30372F]/50 uppercase block font-medium">
                      Occasion
                    </span>
                    <span className="font-medium text-[#30372F]">
                      {selectedEnquiry.occasion || "General Corporate"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#30372F]/50 uppercase block font-medium">
                      Preferred Jewellery
                    </span>
                    <span className="font-medium text-[#30372F]">
                      {selectedEnquiry.giftType || "Pearls"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#30372F]/50 uppercase block font-medium">
                      Delivery Date
                    </span>
                    <span className="font-medium text-[#30372F]">
                      {selectedEnquiry.preferredDeliveryDate ||
                        "As per agreement"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#30372F]/50 uppercase block font-medium">
                      Submitted Date
                    </span>
                    <span className="font-mono text-[#30372F]">
                      {selectedEnquiry.createdAt.split("T")[0]}
                    </span>
                  </div>
                </div>

                {/* Extended Requirements */}
                {(selectedEnquiry.customizationRequired ||
                  selectedEnquiry.packagingRequired ||
                  selectedEnquiry.brandingRequired) && (
                  <div className="bg-[#F5F1EB] p-3.5 border border-[#30372F]/10 space-y-2 mt-2">
                    {selectedEnquiry.customizationRequired && (
                      <div>
                        <span className="font-bold text-[#30372F] block text-[11px]">
                          Customization Requirements:
                        </span>
                        <p className="text-[#30372F]/80 leading-relaxed">
                          {selectedEnquiry.customizationRequired}
                        </p>
                      </div>
                    )}
                    {selectedEnquiry.packagingRequired && (
                      <div>
                        <span className="font-bold text-[#30372F] block text-[11px]">
                          Packaging Requirements:
                        </span>
                        <p className="text-[#30372F]/80 leading-relaxed">
                          {selectedEnquiry.packagingRequired}
                        </p>
                      </div>
                    )}
                    {selectedEnquiry.brandingRequired && (
                      <div>
                        <span className="font-bold text-[#30372F] block text-[11px]">
                          Branding Requirements:
                        </span>
                        <p className="text-[#30372F]/80 leading-relaxed">
                          {selectedEnquiry.brandingRequired}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Message */}
                {selectedEnquiry.message && (
                  <div>
                    <span className="font-bold text-[#30372F] block text-[11px] mb-1">
                      Additional Client Message:
                    </span>
                    <p className="p-3.5 bg-[#F5F1EB] border border-[#30372F]/10 text-[#30372F]/90 leading-relaxed italic">
                      "{selectedEnquiry.message}"
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION C: ENQUIRY STATUS WORKFLOW */}
              <div className="bg-[#FFFDF8] border border-[#30372F]/15 p-5 space-y-4">
                <h4 className="font-serif text-base font-semibold text-[#30372F]">
                  Enquiry Status Workflow
                </h4>

                {/* WORKFLOW PIPELINE BUTTONS */}
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      "New",
                      "Contacted",
                      "In Discussion",
                      "Quotation Sent",
                      "Converted",
                      "Closed",
                      "Rejected",
                    ] as CorporateEnquiryStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, st)}
                      className={`px-3 py-1.5 text-xs font-semibold tracking-wider transition-all border ${
                        selectedEnquiry.status === st
                          ? "bg-[#30372F] text-[#FFFDF8] border-[#30372F] shadow-xs font-bold"
                          : "bg-[#F5F1EB] text-[#30372F]/70 border-[#30372F]/15 hover:text-[#30372F]"
                      }`}
                    >
                      {selectedEnquiry.status === st && (
                        <Check className="w-3.5 h-3.5 inline mr-1 text-[#C5A15A]" />
                      )}
                      Set to {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION D: STAFF ASSIGNMENT */}
              <div className="bg-[#FFFDF8] border border-[#30372F]/15 p-5 space-y-3">
                <h4 className="font-serif text-base font-semibold text-[#30372F]">
                  Staff Assignment
                </h4>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="flex-1 bg-[#F5F1EB] border border-[#30372F]/15 p-2.5 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                  >
                    <option value="">-- Unassigned --</option>
                    {STAFF_MEMBERS.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} ({staff.role})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleAssignStaff}
                    className="px-4 py-2.5 bg-[#30372F] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider hover:bg-[#C5A15A] hover:text-[#30372F] transition-colors"
                  >
                    {selectedStaffId ? "Assign / Reassign" : "Unassign Staff"}
                  </button>
                </div>
              </div>

              {/* SECTION E: QUOTATION DETAILS */}
              <div className="bg-[#FFFDF8] border border-[#30372F]/15 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#30372F]/10 pb-2">
                  <h4 className="font-serif text-base font-semibold text-[#30372F]">
                    Quotation Information
                  </h4>
                  <button
                    onClick={() => setShowQuotationForm(!showQuotationForm)}
                    className="text-xs text-[#C5A15A] font-semibold underline hover:text-[#30372F]"
                  >
                    {showQuotationForm
                      ? "Close Form"
                      : selectedEnquiry.quotation
                        ? "Edit Quotation"
                        : "+ Record Quotation"}
                  </button>
                </div>

                {/* Display Saved Quote if exists */}
                {selectedEnquiry.quotation && !showQuotationForm && (
                  <div className="bg-[#F5F1EB] p-4 border border-[#30372F]/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-[#30372F]">
                        Ref: {selectedEnquiry.quotation.quotationRef || "N/A"}
                      </span>
                      <span className="font-serif text-lg font-bold text-[#C5A15A]">
                        ₹
                        {(selectedEnquiry.quotation.amount || 0).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#30372F]/80">
                      <div>
                        Date:{" "}
                        {selectedEnquiry.quotation.quotationDate?.split(
                          "T",
                        )[0] || "N/A"}
                      </div>
                      <div>
                        Valid Until:{" "}
                        {selectedEnquiry.quotation.validUntil?.split("T")[0] ||
                          "N/A"}
                      </div>
                    </div>

                    {selectedEnquiry.quotation.notes && (
                      <p className="text-xs text-[#30372F]/70 pt-1 border-t border-[#30372F]/10 italic">
                        "{selectedEnquiry.quotation.notes}"
                      </p>
                    )}
                  </div>
                )}

                {/* Quotation Form */}
                {(showQuotationForm ||
                  (!selectedEnquiry.quotation &&
                    selectedEnquiry.status === "Quotation Sent")) && (
                  <form
                    onSubmit={handleRecordQuotation}
                    className="bg-[#F5F1EB] p-4 border border-[#30372F]/15 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#30372F] mb-1">
                          Quotation Amount (₹){" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={quotationAmount}
                          onChange={(e) => setQuotationAmount(e.target.value)}
                          placeholder="e.g. 1850000"
                          className="w-full bg-[#FFFDF8] border border-[#30372F]/15 p-2 text-xs text-[#30372F]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#30372F] mb-1">
                          Valid Until Date
                        </label>
                        <input
                          type="date"
                          value={quotationValidUntil}
                          onChange={(e) =>
                            setQuotationValidUntil(e.target.value)
                          }
                          className="w-full bg-[#FFFDF8] border border-[#30372F]/15 p-2 text-xs text-[#30372F]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#30372F] mb-1">
                          Quotation Reference #
                        </label>
                        <input
                          type="text"
                          value={quotationRef}
                          onChange={(e) => setQuotationRef(e.target.value)}
                          placeholder="e.g. QT-2026-088"
                          className="w-full bg-[#FFFDF8] border border-[#30372F]/15 p-2 text-xs text-[#30372F]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#30372F] mb-1">
                          Terms / Notes
                        </label>
                        <input
                          type="text"
                          value={quotationNotes}
                          onChange={(e) => setQuotationNotes(e.target.value)}
                          placeholder="e.g. Includes 18K hallmarked gold clasps"
                          className="w-full bg-[#FFFDF8] border border-[#30372F]/15 p-2 text-xs text-[#30372F]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#30372F] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider hover:bg-[#C5A15A] hover:text-[#30372F]"
                      >
                        Save Quotation
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* SECTION F: INTERNAL ADMIN NOTES */}
              <div className="bg-[#FFFDF8] border border-[#30372F]/15 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-semibold text-[#30372F]">
                    Internal Executive Notes
                  </h4>
                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider bg-amber-100 px-2 py-0.5 border border-amber-300">
                    Admin Only (Invisible to Customer)
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={internalNoteInput}
                  onChange={(e) => setInternalNoteInput(e.target.value)}
                  placeholder="Add confidential notes, discussions, quote adjustments, packaging specifications..."
                  className="w-full bg-[#F5F1EB] border border-[#30372F]/15 p-3 text-xs text-[#30372F] focus:outline-none focus:border-[#C5A15A]"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddInternalNote}
                    className="px-4 py-2 bg-[#30372F] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider hover:bg-[#C5A15A] hover:text-[#30372F] transition-colors"
                  >
                    Save Internal Note
                  </button>
                </div>
              </div>

              {/* SECTION G: ENQUIRY TIMELINE HISTORY */}
              <div className="bg-[#FFFDF8] border border-[#30372F]/15 p-5 space-y-4">
                <h4 className="font-serif text-base font-semibold text-[#30372F] border-b border-[#30372F]/10 pb-2">
                  Enquiry Activity Timeline History
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#30372F]/15">
                  {selectedEnquiry.events &&
                  selectedEnquiry.events.length > 0 ? (
                    selectedEnquiry.events.map((ev) => (
                      <div key={ev.id} className="relative">
                        <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#C5A15A] border-2 border-[#FFFDF8]" />
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#30372F] text-xs">
                              {ev.message}
                            </span>
                            <span className="text-[10px] text-[#30372F]/50 font-mono">
                              {ev.createdAt.replace("T", " • ").split(".")[0]}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#30372F]/60 block mt-0.5">
                            By: {ev.createdBy}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="relative">
                      <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#C5A15A]" />
                      <p className="text-xs text-[#30372F]/70">
                        Enquiry Received on{" "}
                        {selectedEnquiry.createdAt.split("T")[0]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
