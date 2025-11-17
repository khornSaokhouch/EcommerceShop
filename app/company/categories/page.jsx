"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Shapes, AlertTriangle } from "lucide-react";
import { useCategoryStore } from "../../stores/useCategoryStore";

// --- 1. Category Skeleton Row ---
function CategoryRowSkeleton() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-200 rounded"></div></td>
      <td className="px-6 py-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4"><div className="h-4 w-1/4 bg-gray-200 rounded"></div></td>
      {/* <td className="px-6 py-4"><div className="h-4 w-1/3 bg-gray-200 rounded"></div></td> */}
    </tr>
  );
}

// --- 2. Category Row ---
function CategoryRow({ category, index }) {
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => setImgError(true);

  const createdDate = category.created_at ? new Date(category.created_at).toLocaleDateString() : "—";

  return (
    <tr className="border-b border-gray-100 hover:bg-indigo-50/50 transition duration-150 cursor-pointer">
      <td className="px-6 py-4 text-sm text-gray-500 font-mono">{index + 1}</td>
      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center space-x-4">
        <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
          {category.image_url && !imgError ? (
            <Image
              src={category.image_url}
              alt={category.name}
              width={40}
              height={40}
              className="object-cover"
              onError={handleImageError}
              priority
            />
          ) : (
            <Shapes className="w-5 h-5 text-indigo-400" />
          )}
        </div>
        <div>{category.name}</div>
      </td>
      <td className="px-6 py-4 text-gray-600">
        <span className="font-semibold text-indigo-600">{category.product_count || 0}</span> Products
      </td>
      {/* <td className="px-6 py-4 text-gray-500 text-sm">{createdDate}</td> */}
    </tr>
  );
}

// --- 3. Categories Page ---
export default function CategoriesPage() {
  const { categories, loading, error, fetchCategories } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-100">
              {[...Array(8)].map((_, i) => <CategoryRowSkeleton key={i} />)}
            </tbody>
          </table>
        </div>
      );
    }

    if (error) {
      return (
        <p className="text-center text-red-600 bg-red-50 p-6 rounded-lg my-8 border border-red-200">
          <AlertTriangle className="w-5 h-5 inline mr-2" />
          <span className="font-semibold">Error loading data:</span> {error}
        </p>
      );
    }

    if (filteredCategories.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-xl shadow-md border border-gray-100 mt-8">
          <Shapes className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">
            {searchTerm ? `No categories found matching "${searchTerm}".` : "No categories have been created yet."}
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Products Count</th>
                {/* <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Created Date</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredCategories.map((category, index) => (
                <CategoryRow key={category.id} category={category} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Categories</h1>

        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 pb-4 border-b border-gray-200">
          <p className="text-gray-600 text-lg">
            Browse and view the structure of the product catalog.
          </p>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition shadow-sm"
            />
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
