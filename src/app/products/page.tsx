"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import { Products } from "../../services/product.service";
import { Context } from "../../context";
import { Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
// import styles from "../../styles/Product.module.css";
import BreadcrumbDisplay from "../../components/shared/BreadcrumbDisplay";
import PaginationDisplay from "../../components/shared/PaginationDisplay";
import ProductFilter from "../../components/Products/ProductFilter";
import ProductItem from "../../components/Products/ProductItem";
import { MetadataProducts, Product } from "../../interfaces/products.interface";
import { showErrorToast } from "../../utils/toast";
import Loading from "../../components/shared/Loading";

const AllProducts = () => {
  const { state } = useContext(Context);
  const [products, setProducts] = useState<Product[]>([]);
  const [metadata, setMetadata] = useState<MetadataProducts>({
    skip: 0,
    limit: 0,
    total: 0,
    pages: 0,
  });
  const [userType, setUserType] = useState("customer");
  const [sortText, setSortText] = useState("Sort by");
  const [loading, setLoading] = useState(true);

  const user = state?.user;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user?.type && user.type !== userType) {
      setUserType(user.type);
    }
  }, [user, userType]);

  const queryParams = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const uniquePlatformsTypes = useMemo(() => {
    const plataformsTypesSet = new Set(
      products.map((product) => product.platformType)
    );
    return Array.from(plataformsTypesSet);
  }, [products]);

  const uniqueCategories = useMemo(() => {
    const categoriesSet = new Set(products.map((product) => product.category));
    return Array.from(categoriesSet);
  }, [products]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchProducts = async () => {
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
    fetchProducts();
    return () => abortController.abort();
  }, [queryParams]);

  const handleSort = (e: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());

    const sortOptions: Record<string, string> = {
      "-avgRating": "Rating",
      "-createdAt": "Latest",
    };

    setSortText(sortOptions[e as string] || "Sort By");

    e ? newParams.set("sort", e) : newParams.delete("sort");

    router.push(`${pathname}?${newParams.toString()}`);
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
            // className={styles.dropdownBtn}
            onSelect={handleSort}
          >
            <Dropdown.Item eventKey="-avgRating">Rating</Dropdown.Item>
            <Dropdown.Item eventKey="-createdAt">Latest</Dropdown.Item>
            <Dropdown.Item eventKey="">Reset</Dropdown.Item>
          </DropdownButton>
          {userType?.toLowerCase() === "admin" && (
            <Link
              href="/products/update-product"
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
            plataformsTypes={uniquePlatformsTypes}
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
          <PaginationDisplay metadata={metadata || {}} />
        </Col>
      </Row>
    </>
  );
};

export default AllProducts;
