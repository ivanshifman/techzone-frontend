"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../interfaces/products.interface";
import { Button, Col, Row } from "react-bootstrap";
import { showErrorToast } from "../utils/toast";
import styles from "../styles/Home.module.css";
import ProductItem from "../components/Products/ProductItem";
import Loading from "../components/shared/Loading";

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<{
    latestProducts: Product[];
    topRatedProducts: Product[];
  }>({
    latestProducts: [],
    topRatedProducts: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const baseUrl =
          process.env.NODE_ENV !== "production"
            ? process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL
            : process.env.NEXT_PUBLIC_BASE_API_URL;

        const { data } = await axios.get(`${baseUrl}/products?homePage=true`);
        setProducts(
          data?.result[0] || { latestProducts: [], topRatedProducts: [] }
        );
      } catch (error) {
        showErrorToast("Error fetching products");
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  console.log("products", products);

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
                product={product}
                userType={"customer"}
                key={index}
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
                  userType="customer"
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
