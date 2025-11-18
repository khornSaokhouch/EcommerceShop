"use client";
import { useParams } from "next/navigation";
import ProductsByCategoryPage from "../../../components/user/ProductsByCategoryPage";

export default function CategoryPage() {
  const params = useParams();
  const name = params.name;

  return <ProductsByCategoryPage categoryName={name} />;
}
