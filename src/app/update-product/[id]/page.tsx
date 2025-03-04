"use client";

import { useParams } from "next/navigation";
import ProductForm from "../../../components/Products/ProductForm";
import AdminProtectedRoute from "../../../components/shared/AdminProtectedRoute";

export const dynamic = "force-dynamic";

const UpdateProductIdPage = () => {
  const { id } = useParams();
  const productId = Array.isArray(id) ? id[0] : id ?? "";

  return (
    <AdminProtectedRoute>
      <ProductForm productId={productId} />
    </AdminProtectedRoute>
  );
};

export default UpdateProductIdPage;
