"use client";

import ProductForm from "../../components/Products/ProductForm";
import AdminProtectedRoute from "../../components/shared/AdminProtectedRoute";

const UpdateProductPage = () => {
  return (
    <AdminProtectedRoute>
      <ProductForm />
    </AdminProtectedRoute>
  );
};

export default UpdateProductPage;
