"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, Trash2, Archive, Eye, Package, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useParams } from "next/navigation"
import Image from "next/image"

const CategoriesTable = ({ categories, search, openForm, setDeleteConfirmId, viewMode = "grid" }) => {
  const { id } = useParams() // Assuming 'id' is for admin/store ID from URL
  const [currentPage, setCurrentPage] = useState(1)
  const categoriesPerPage = viewMode === "grid" ? 8 : 7 // Adjusted for potentially better grid layout

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories
    const lowerSearch = search.toLowerCase()
    return categories.filter((cat) => cat.name.toLowerCase().includes(lowerSearch))
  }, [categories, search])

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage)

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * categoriesPerPage
    const endIndex = startIndex + categoriesPerPage
    return filteredCategories.slice(startIndex, endIndex)
  }, [filteredCategories, currentPage, categoriesPerPage])

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  // Variants for container and individual items animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Subtle delay for items to appear
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  }

  // --- Category Card for Grid View ---
  const CategoryCard = ({ category }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="hidden" // For AnimatePresence in the parent
      whileHover={{ y: -7, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 relative"
    >
      {/* Category Image / Placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
            <Package className="w-14 h-14" />
            <span className="mt-2 text-sm font-semibold">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>

        {/* Hover Actions */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); openForm(category); }}
            className="p-2.5 bg-white/30 backdrop-blur-sm rounded-full text-white hover:bg-white/50 transition-colors shadow-md"
            title="Edit Category"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(category.id); }}
            className="p-2.5 bg-red-500/70 backdrop-blur-sm rounded-full text-white hover:bg-red-600/80 transition-colors shadow-md"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Category Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 truncate pr-2 leading-tight">
            {category.name}
          </h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 shadow-sm">
            Active
          </span>
        </div>
        {/* <p className="text-sm text-gray-500 mb-4">ID: {category.id}</p> */}

        {/* Action Button */}
        <Link
          href={`/admin/category/${category.id}`} // Ensure 'id' for admin is correctly used
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md group-hover:shadow-lg"
        >
          <Eye className="w-4 h-4" />
          View Products
        </Link>
      </div>
    </motion.div>
  )

  // --- Category Table Row for List View ---
  const CategoryTableRow = ({ category, index }) => (
    <motion.tr
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="hidden" // For AnimatePresence in the parent
      whileHover={{ backgroundColor: "#f9fafb", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
      className="border-b border-gray-100 transition-all duration-200"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{index + (currentPage - 1) * categoriesPerPage + 1}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
            {category.image_url ? (
              <Image
                src={category.image_url}
                alt={category.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <div className="text-base font-semibold text-gray-900">{category.name}</div>
            {/* <div className="text-xs text-gray-500">ID: {category.id}</div> */}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 shadow-sm">
          Active
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            href={`/admin/${id}/category/${category.id}`}
            className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="View Products"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openForm(category)}
            className="p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
            title="Edit Category"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDeleteConfirmId(category.id)}
            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  )

  // --- No Categories Found State ---
  if (filteredCategories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="p-12 text-center bg-white rounded-2xl shadow-inner min-h-[400px] flex flex-col items-center justify-center"
      >
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
          <Archive className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Categories Found</h3>
        <p className="text-gray-600 mb-8 max-w-md">
          {search
            ? "Your search for '"+ search +"' did not match any categories. Try adjusting your search terms."
            : "It looks like you haven't created any categories yet. Let's get started!"}
        </p>
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(37, 99, 235, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openForm()}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold text-lg shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create New Category
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="p-6">
      {/* Categories Grid/Table */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid-view"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {paginatedCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="table-view" variants={containerVariants} initial="hidden" animate="visible" exit="hidden">
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedCategories.map((category, index) => (
                    <CategoryTableRow key={category.id} category={category} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 px-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{(currentPage - 1) * categoriesPerPage + 1}</span> to{" "}
            <span className="font-semibold">{Math.min(currentPage * categoriesPerPage, filteredCategories.length)}</span> of{" "}
            <span className="font-semibold">{filteredCategories.length}</span> categories
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-5 py-2 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </motion.button>
            <span className="px-4 py-2 text-sm text-gray-700 font-medium">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-5 py-2 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoriesTable