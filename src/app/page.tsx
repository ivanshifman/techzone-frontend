"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import axios from "axios";
import ProductItem from "../components/Products/ProductItem";
import { showErrorToast } from "../utils/toast";

const Home = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any>({
    latestProducts: [],
    topSoldProducts: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const baseUrl =
          process.env.NODE_ENV !== "production"
            ? process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL
            : process.env.NEXT_PUBLIC_BASE_API_URL;

        const { data } = await axios.get(`${baseUrl}/products?homePage=true`);
        setProducts(data?.result[0] || {});
      } catch (error) {
        showErrorToast("Error fetching products");
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, []);

  console.log("products", products);
  return (
    <>
      <h3 className={styles.productCats}>Latest Products</h3>
      {products.latestProducts ? (
        <Row xs={1} md={2} lg={4} className="g-4 my-4">
          {products.latestProducts.map(
            (product: any, index: React.Key | null | undefined) => (
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
      {products.topRatedProducts ? (
        <>
          <Row xs={1} md={2} lg={4} className="g-4 my-4">
            {products.topRatedProducts.map(
              (product: any, index: React.Key | null | undefined) => (
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
