"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context";
import { useProducts } from "../../components/Hooks/useProducts";
import { Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import BreadcrumbDisplay from "../../components/shared/BreadcrumbDisplay";
import PaginationDisplay from "../../components/shared/PaginationDisplay";
import ProductFilter from "../../components/Products/ProductFilter";
import ProductItem from "../../components/Products/ProductItem";
import { Product } from "../../interfaces/products.interface";
import Loading from "../../components/shared/Loading";

const AllProducts = () => {
  const { state } = useAppContext();
  const {
    products,
    fetchProducts,
    metadata,
    loading,
    uniqueCategories,
    uniquePlatformsTypes,
  } = useProducts();

  const [userType, setUserType] = useState("customer");
  const [sortText, setSortText] = useState("Sort by");

  const user = state?.user;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user?.type && user.type !== userType) {
      setUserType(user.type);
    }
  }, [user?.type, userType]);

  const handleSort = (e: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("avgRating");
    newParams.delete("createdAt");

    if (e) {
      newParams.set(e.replace("-", ""), "desc");
    }

    const sortOptions: Record<string, string> = {
      "-avgRating": "Rating",
      "-createdAt": "Latest",
    };

    setSortText(sortOptions[e as string] || "Sort By");
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleDeleteProduct = async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    await fetchProducts(signal);
  };

  if (loading) return <Loading />;

  return (
    <>
      <Row>
        <Col md={8}>
          <BreadcrumbDisplay
            childrens={[
              {
                active: false,
                href: "/",
                text: "Home",
              },
              {
                active: true,
                href: "#",
                text: "Products",
              },
            ]}
          />
        </Col>
        <Col md={4}>
          <DropdownButton
            variant="outline-secondary"
            title={sortText}
            id="input-group-dropdown-2"
            onSelect={handleSort}
          >
            <Dropdown.Item eventKey="-avgRating">Rating</Dropdown.Item>
            <Dropdown.Item eventKey="-createdAt">Latest</Dropdown.Item>
            <Dropdown.Item eventKey="">Reset</Dropdown.Item>
          </DropdownButton>
          {userType?.toLowerCase() === "admin" && (
            <Link
              href="/update-product"
              className="btn btn-primary btnAddProduct"
            >
              <PlusCircle className="btnAddProductIcon" />
              Add Product
            </Link>
          )}
        </Col>
      </Row>
      <Row>
        <Col lg={2}>
          <ProductFilter
            platformsTypes={uniquePlatformsTypes}
            categories={uniqueCategories}
          />
        </Col>
        <Col lg={10}>
          {products && products.length > 0 ? (
            <Row xs={1} sm={2} md={3} className="g-3">
              {products.map((product: Product) => (
                <ProductItem
                  key={product._id as string}
                  userType={userType}
                  product={product}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </Row>
          ) : (
            <Col
              xs={12}
              className="d-flex justify-content-center align-content-center p-5"
            >
              <p className="text-center fs-1 text-danger fw-bold">
                No products found.
              </p>
            </Col>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <PaginationDisplay metadata={metadata} />
        </Col>
      </Row>
    </>
  );
};

export default AllProducts;
