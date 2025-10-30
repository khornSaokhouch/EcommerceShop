"use client"

import { useEffect, useState, useCallback } from "react"
import { useCategoryStore } from "../../stores/useCategoryStore"
import { useAuthStore } from "../../stores/authStore"
import { motion, AnimatePresence } from "framer-motion" // Ensure AnimatePresence is imported
import {
  Plus,
  Search,
  AlertTriangle,
  Grid3X3,
  List,
  Filter,
  Download,
  RefreshCw,
  Package,
  TrendingUp,
  BarChart3,
  Rocket, // New icon for a fresh look!
} from "lucide-react"
import CategoriesTable from "../../components/admin/category/CategoriesTable"
import CategoryForm from "../../components/admin/category/CategoryForm"
import { useToast, ToastContainer } from "../../components/ui/Toast"
import DeleteCategoryModal from "../../components/admin/category/DeleteCategoryModal"

export default function CategoriesPage() {
  const { categories, loading, error, fetchCategories, saveCategory, deleteCategory, search, setSearch } =
    useCategoryStore()

  const token = useAuthStore((state) => state.token)

  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryName, setCategoryName] = useState("")
  const [categoryImage, setCategoryImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [viewMode, setViewMode] = useState("grid") // 'grid' or 'table'

  const { toasts, success, error: showError, info, removeToast } = useToast()

  useEffect(() => {
    if (token) {
      console.log("Token found, fetching categories...");
      fetchCategories();
    } else {
      console.log("No token found, not fetching categories yet.");
      // Optional: if token is null, you might want to clear categories or redirect
      // useCategoryStore.setState({ categories: [] });
    }
  }, [fetchCategories, token]);

  const openForm = useCallback(
    (category = null) => {
      setEditingCategory(category)
      setCategoryName(category?.name || "")
      setCategoryImage(null)
      setPreviewUrl(category?.image_url || null)
      setSubmitError(null)
      setIsFormOpen(true)
      info(category ? `Editing "${category.name}"` : "Creating new category", {
        title: category ? "Edit Mode" : "Create Mode",
        duration: 3000,
      })
    },
    [info],
  )

  const closeForm = useCallback(() => {
    setIsFormOpen(false)
  }, [])

  const handleModalCloseAnimation = useCallback(() => {
    setEditingCategory(null)
    setCategoryName("")
    setCategoryImage(null)
    setPreviewUrl(null)
    setSubmitError(null)
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showError("File is too large. Maximum size is 2MB.", {
          title: "File Too Large",
          duration: 4000,
        })
        setCategoryImage(null)
        setPreviewUrl(null)
        return
      }
      setCategoryImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setCategoryImage(null)
      setPreviewUrl(editingCategory?.image_url || null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryName.trim()) {
      setSubmitError("Category name cannot be empty")
      showError("Category name cannot be empty.", { title: "Validation Error" })
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await saveCategory({
        id: editingCategory?.id,
        name: categoryName,
        image: categoryImage,
      })

      success(editingCategory ? `"${categoryName}" updated successfully!` : `"${categoryName}" created successfully!`, {
        title: editingCategory ? "Category Updated" : "Category Created",
        duration: 4000,
      })
      closeForm()
    } catch (err) {
      const message = err.message || "Operation failed"
      showError(message, {
        title: "Operation Failed",
        duration: 5000,
      })
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmId) return

    try {
      const categoryToDelete = categories.find((cat) => cat.id === deleteConfirmId)
      await deleteCategory(deleteConfirmId)
      success(`"${categoryToDelete?.name || "Category"}" deleted successfully!`, {
        title: "Category Deleted",
        duration: 4000,
      })
      setDeleteConfirmId(null)
    } catch (err) {
      const message = err.message || "Delete failed"
      showError(message, {
        title: "Delete Failed",
        duration: 5000,
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.08 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  // --- Dynamic class names for Tailwind ---
  const getStatCardColors = (color) => {
    const colors = {
      blue: { bg: "bg-blue-50", text: "text-blue-600" },
      green: { bg: "bg-green-50", text: "text-green-600" },
      purple: { bg: "bg-purple-50", text: "text-purple-600" },
      orange: { bg: "bg-orange-50", text: "text-orange-600" },
    };
    return colors[color] || colors.blue; // Default to blue
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <motion.div className="p-6 md:p-10 space-y-8 bg-gray-50 min-h-screen" variants={containerVariants} initial="hidden" animate="visible">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Rocket className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">Category Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage product categories and monitor performance.</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(37, 99, 235, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openForm()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center lg:w-auto w-full"
          >
            <Plus className="w-5 h-5" />
            New Category
          </motion.button>
        </motion.div>

        {/* Stats Cards Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Categories",
              value: categories.length,
              icon: Package,
              color: "blue",
              change: "+12%",
            },
            {
              label: "Active Categories",
              value: categories.filter((cat) => cat.status === "active").length || 0, // Ensure default 0
              icon: Grid3X3,
              color: "green",
              change: "+8%",
            },
            {
              label: "Products Managed",
              value: "1,234", // Placeholder - would be dynamic
              icon: TrendingUp,
              color: "purple",
              change: "+23%",
            },
            {
              label: "New This Month",
              value: "24", // Placeholder - would be dynamic
              icon: BarChart3,
              color: "orange",
              change: "+5%",
            },
          ].map((stat, index) => {
            const colors = getStatCardColors(stat.color);
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-xs font-semibold ${colors.text} mt-1`}>{stat.change} from last month</p>
                  </div>
                  <div className={`w-14 h-14 ${colors.bg} rounded-full flex items-center justify-center shadow-inner`}>
                    <stat.icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filters and Search Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-grow flex items-center gap-3">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors w-full md:w-80"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-700 font-medium"
              >
                <Filter className="w-4 h-4" />
                Filter
              </motion.button>
              <motion.button
                whileHover={{ rotate: 15, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  fetchCategories()
                  info("Category data refreshed.", { duration: 2000 })
                }}
                className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors text-gray-700"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-1 bg-gray-50">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-blue-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "table" ? "bg-blue-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area: Categories Table/Grid or Status Messages */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-md">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-20 px-6">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
                  ></motion.div>
                  <div className="text-lg text-gray-600 font-medium">Loading categories... please wait.</div>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-20 px-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="text-xl text-red-600 font-bold">Error Loading Categories</div>
                  <p className="text-gray-600 max-w-md mx-auto">{error}</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fetchCategories()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto mt-4"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="table-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CategoriesTable
                  categories={categories}
                  search={search}
                  openForm={openForm}
                  setDeleteConfirmId={setDeleteConfirmId}
                  viewMode={viewMode}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Category Form Modal */}
      <CategoryForm
        isFormOpen={isFormOpen}
        closeForm={closeForm}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryImage={categoryImage}
        setCategoryImage={setCategoryImage}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        submitError={submitError}
        setSubmitError={setSubmitError}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        handleModalCloseAnimation={handleModalCloseAnimation}
        editingCategory={editingCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        category={categories.find((cat) => cat.id === deleteConfirmId)}
        onConfirm={handleDelete}
      />
    </>
  )
}