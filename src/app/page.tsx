"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "../context";
import axios from "axios";
import { Product } from "../interfaces/products.interface";
import { Button, Col, Row } from "react-bootstrap";
import { showErrorToast } from "../utils/toast";
import styles from "../styles/Home.module.css";
import ProductItem from "../components/Products/ProductItem";
import Loading from "../components/shared/Loading";

export const dynamic = "force-dynamic";

const Home = () => {
  const { state } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<{
    latestProducts: Product[];
    topRatedProducts: Product[];
  }>({
    latestProducts: [],
    topRatedProducts: [],
  });

  const userType = state?.user?.type;
  const router = useRouter();

  const fetchProducts = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const baseUrl =
        process.env.NODE_ENV !== "production"
          ? process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL
          : process.env.NEXT_PUBLIC_BASE_API_URL;

      const { data } = await axios.get(`${baseUrl}/products?homePage=true`, {
        signal,
      });

      setProducts(
        data?.result[0] || { latestProducts: [], topRatedProducts: [] }
      );
    } catch (error: any) {
      if (!axios.isCancel(error)) {
        showErrorToast(
          error?.response?.data?.errorResponse.message || error?.message
        );
        console.error("Error fetching products", error);
      }
    } finally {
      !signal?.aborted && setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchProducts(abortController.signal);

    return () => abortController.abort();
  }, []);

  console.log("products", products);

  const handleDeleteProduct = async () => {
    await fetchProducts();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <h3 className={styles.productCats}>Latest Products</h3>
      {products.latestProducts.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4 my-4">
          {products.latestProducts.map(
            (product: Product, index: React.Key | null | undefined) => (
              <ProductItem
                key={index}
                product={product}
                userType={userType || "customer"}
                onDelete={handleDeleteProduct}
              />
            )
          )}
        </Row>
      ) : (
        <div className="flex justify-content-center align-content-center p-5">
          <p className="text-center fs-1 text-danger fw-bold">
            No products found.
          </p>
        </div>
      )}
      <hr />
      <h3 className={styles.productCats}>Top Rated Products</h3>
      {products.topRatedProducts.length > 0 ? (
        <>
          <Row xs={1} md={2} lg={4} className="g-4 my-4">
            {products.topRatedProducts.map(
              (product: Product, index: React.Key | null | undefined) => (
                <ProductItem
                  key={index}
                  product={product}
                  userType={userType || "customer"}
                  onDelete={handleDeleteProduct}
                />
              )
            )}
          </Row>
          <Row>
            <Col>
              <Button
                variant="primary"
                className={styles.viewMoreBtn}
                onClick={() => router.push("/products")}
              >
                View More
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <div className="flex justify-content-center align-content-center p-5">
          <p className="text-center fs-1 text-danger fw-bold">
            No top-rated products available at the moment.
          </p>
        </div>
      )}
    </>
  );
};

export default Home;
