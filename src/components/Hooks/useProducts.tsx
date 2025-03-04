"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Products } from "../../services/product.service";
import { showErrorToast } from "../../utils/toast";
import { MetadataProducts, Product } from "../../interfaces/products.interface";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [metadata, setMetadata] = useState<MetadataProducts>({
    skip: 0,
    limit: 0,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  const queryParams = useMemo(() => {
    const entries = [...searchParams.entries()];
    return Object.fromEntries(entries);
  }, [searchParams.toString()]);

  const uniquePlatformsTypes = useMemo(
    () =>
      products.length > 0
        ? [...new Set(products.map((p) => p.platformType))]
        : [],
    [products]
  );

  const uniqueCategories = useMemo(
    () =>
      products.length > 0 ? [...new Set(products.map((p) => p.category))] : [],
    [products]
  );

  const uniqueBasesTypes = useMemo(
    () =>
      products.length > 0 ? [...new Set(products.map((p) => p.baseType))] : [],
    [products]
  );

  const fetchProducts = async (signal: AbortSignal) => {
    setLoading(true);
    try {
      const { success, result } = await Products.getProducts(
        queryParams,
        false,
        signal
      );
      if (success) {
        setProducts(result?.products || []);
        setMetadata(result?.metadata || {});
      }
    } catch (error: any) {
      if (error.name !== "CanceledError" && error.message !== "canceled") {
        console.error("API Error:", error);
      }

      if (!signal.aborted) {
        showErrorToast(
          error?.response?.data?.errorResponse?.message || error?.message
        );
        console.error("Error fetching products", error);
      }
    } finally {
      !signal.aborted && setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetchProducts(signal);
    return () => abortController.abort();
  }, [queryParams]);

  return {
    fetchProducts,
    products,
    metadata,
    loading,
    uniqueCategories,
    uniquePlatformsTypes,
    uniqueBasesTypes,
  };
};
