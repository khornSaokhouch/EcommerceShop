"use client";

import { useEffect, useState } from "react";
import LeftProfile from "../../components/company/LeftProfile";
import RightForm from "../../components/company/RightForm";

import { useCompanyInfoStore } from "../../stores/useCompanyInfoStore";
import { useUserStore } from "../../stores/userStore";
import { toast } from "react-hot-toast";

export default function CompanyProfilePage() {
  const { user, fetchUser, updateUser } = useUserStore();
  const userId = user?.id;

  const company = useCompanyInfoStore((state) => state.company);
  const loading = useCompanyInfoStore((state) => state.loading);
  const createCompany = useCompanyInfoStore((state) => state.createCompany);
  const updateCompany = useCompanyInfoStore((state) => state.updateCompany);
  const setFieldValue = useCompanyInfoStore((state) => state.setFieldValue);
  const fetchCompanyByUserId = useCompanyInfoStore(
    (state) => state.fetchCompanyByUserId
  );

  const [updating, setUpdating] = useState(false);
  const isNew = !company?.id;

  // Load logged-in user
  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  // Fetch company after user loads
  useEffect(() => {
    if (!userId) return;
    fetchCompanyByUserId(userId);
  }, [userId]);

  // Input handler
  const handleInputChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      const file = files?.[0] ?? null;
      setFieldValue(name, file);
    } else {
      setFieldValue(name, value);
    }
  };

  // Save company info
  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdating(true);
    try {
      if (isNew) {
        await createCompany(company);
        toast.success("Company created successfully!");
      } else {
        await updateCompany(company.id, company);
        toast.success("Company updated successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to save company");
    } finally {
      setUpdating(false);
    }
  };

  // Save user profile (name + image)
  const handleSaveProfile = async ({ name, imageFile }) => {
    if (!userId) {
      toast.error("User not loaded");
      return;
    }

    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);

      await updateUser(formData);
      toast.success("Profile updated");

      fetchUser();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen  p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-indigo-100 pb-4">
          {isNew ? "Add New Company Profile" : "Edit Company Profile"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <LeftProfile user={user} onSaveProfile={handleSaveProfile} updating={updating} />
          <RightForm
            companyData={company}
            handleInputChange={handleInputChange}
            loading={loading}
            isNew={isNew}
          />
        </div>
      </div>
    </form>
  );
}