"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Products } from "../../../services/product.service";
import { useAppContext } from "../../../context";
import type { Product } from "../../../interfaces/products.interface";
import { SkuDetail } from "../../../interfaces/products.interface";
import { getFormatedStringFromDays } from "../../../utils/formatStringFromDays";
import {
  Badge,
  Button,
  Card,
  Col,
  Nav,
  Row,
  Tab,
  Table,
} from "react-bootstrap";
import InputNumber from "rc-input-number";
import { BagCheckFill, FileMinus, FilePlus } from "react-bootstrap-icons";
// import CartOffCanvas from "../../components/CartOffCanvas";
import SkuDetailsList from "../../../components/Product/SkuDetailsList";
import ReviewSection from "../../../components/Product/ReviewSection";
import ProductItem from "../../../components/Products/ProductItem";
import Loading from "../../../components/shared/Loading";
import { showErrorToast } from "../../../utils/toast";
import { Rating } from "react-simple-star-rating";

const Product = () => {
  const { cartDispatch, cartItems, state } = useAppContext();

  const router = useRouter();
  const { id } = useParams();
  const productId = Array.isArray(id) ? id[0] : id ?? "";
  const user = state?.user;

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [userType, setUserType] = useState("customer");
  const [allSkuDetails, setAllSkuDetails] = useState<SkuDetail[] | []>(
    product?.skuDetails || []
  );
  const [displaySku, setDisplaySku] = useState<SkuDetail | null>(null);

  useEffect(() => {
    if (user?.type && user.type !== userType) {
      setUserType(user.type);
    }
  }, [user?.type, userType]);

  useEffect(() => {
    if (product?.skuDetails) {
      setAllSkuDetails(product.skuDetails);
    }
  }, [product]);

  useEffect(() => {
    if (product?.skuDetails?.length) {
      setDisplaySku(
        product.skuDetails.sort((a, b) => a.price - b.price)[0] || null
      );
    }
  }, [product?.skuDetails]);

  const fetchProducts = async (signal?: AbortSignal) => {
    if (!/^[0-9a-fA-F]{24}$/.test(productId) || !productId) {
      showErrorToast("Invalid product ID");
      return router.replace("/products");
    }
    setLoading(true);
    try {
      const { result } = await Products.getProduct(productId);

      setProduct(result?.product || {});
      setRelatedProducts(result?.relatedProducts || []);
      console.log("producto", result.product);
    } catch (error: any) {
      if (error.response?.status === 404 && !signal?.aborted) {
        showErrorToast(
          error?.response?.data?.errorResponse.message || error?.message
        );
        return router.replace("/products");
      }
    } finally {
      !signal?.aborted && setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchProducts(abortController.signal);

    return () => abortController.abort();
  }, [productId]);

  const hasMultiplePrices =
    product?.skuDetails && product?.skuDetails?.length > 1;
  const minPrice = hasMultiplePrices
    ? Math.min(...product.skuDetails.map((sku) => sku.price))
    : 0;
  const maxPrice = hasMultiplePrices
    ? Math.max(...product.skuDetails.map((sku) => sku.price))
    : 0;

  const existingItem = cartItems.find(
    (item: { skuId: string }) => item.skuId === displaySku?._id
  );

  const handleCart = () => {
    const actionType = existingItem ? "UPDATE_CART" : "ADD_ITEM";

    cartDispatch({
      type: actionType,
      payload: {
        user,
        skuId: displaySku?._id || "",
        quantity: quantity,
        validity: displaySku?.lifetime ? 0 : displaySku?.validity,
        lifetime: displaySku?.lifetime || false,
        price: displaySku?.price || 0,
        productName: product?.productName || "",
        productImage: product?.image || "",
        productId: product?._id || "",
        skuPriceId: displaySku?.stripePriceId || "",
      },
      cartKey: state.user ? `_tech_cart_${state.user.name}` : "_tech_cart",
    });
    setShow(true);
  };

  if (loading) return <Loading />;

  return (
    <>
      <Row className="firstRow">
        <Col sm={4}>
          <Card className="productImgCard">
            <Card.Img variant="top" src={product?.image} />
          </Card>
        </Col>
        <Col sm={8}>
          <h2>{product?.productName}</h2>
          <div className="divStar mb-2">
            <Rating
              initialValue={product?.avgRating || 0}
              readonly
              size={20}
              className="mb-2"
            />
            ({product?.feedbackDetails?.length || 0} reviews)
          </div>
          <p className="productPrice me-2">
            {hasMultiplePrices ? `USD${minPrice} - USD${maxPrice}` : "USD000"}
            <Badge bg="warning" text="dark" className="ms-2">
              {displaySku?.lifetime
                ? "Lifetime"
                : getFormatedStringFromDays(displaySku?.validity)}
            </Badge>
          </p>
          <ul>
            {product?.highlights &&
              product?.highlights.length > 0 &&
              product?.highlights.map((highlight: string, key: any) => (
                <li key={key}>{highlight}</li>
              ))}
          </ul>
          <div>
            {product?.skuDetails &&
              product?.skuDetails?.length > 0 &&
              product?.skuDetails
                .sort(
                  (a: SkuDetail, b: SkuDetail) =>
                    (a.validity ?? 0) - (b.validity ?? 0)
                )
                .map((sku: SkuDetail) => (
                  <Badge
                    bg="info"
                    text="dark"
                    className="skuBtn cursor-pointer"
                    key={sku._id}
                    onClick={() => {
                      setDisplaySku(sku);
                      setQuantity(1);
                    }}
                  >
                    {sku.lifetime
                      ? "Lifetime"
                      : getFormatedStringFromDays(sku.validity)}
                  </Badge>
                ))}
          </div>
          {user && user?.type !== "admin" &&  (
            <div className="productSkuZone">
              <InputNumber
                min={1}
                max={displaySku?.stock || 0}
                controls={true}
                step={1}
                value={quantity}
                onChange={(value) => setQuantity(Number(value))}
                disabled={!displaySku?.price}
                downHandler={<FileMinus fontSize={35} cursor={"pointer"} />}
                upHandler={<FilePlus fontSize={35} cursor={"pointer"} />}
              />
              {/* <Form.Select
							aria-label='Default select example'
							className='selectValidity'
						>
							<option>Select validity</option>
							<option value='1'>One</option>
							<option value='2'>Two</option>
							<option value='3'>Three</option>
						</Form.Select> */}
              <Button
                variant="primary"
                className="cartBtn"
                onClick={handleCart}
                disabled={!displaySku?.price}
              >
                <BagCheckFill className="cartIcon" />
                {existingItem ? "Update cart" : "Add to cart"}
              </Button>
            </div>
          )}
        </Col>
      </Row>
      <br />
      <hr />
      <Row>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="g-3">
            <Col md={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Descriptions</Nav.Link>
                </Nav.Item>
                {product?.requirementSpecification &&
                  product?.requirementSpecification.length > 0 && (
                    <Nav.Item>
                      <Nav.Link eventKey="second">Requirements</Nav.Link>
                    </Nav.Item>
                  )}
                <Nav.Item>
                  <Nav.Link eventKey="third">Reviews</Nav.Link>
                </Nav.Item>
                {user?.type === "admin" && (
                  <Nav.Item>
                    <Nav.Link eventKey="fourth">Product SKUs</Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
            </Col>
            <Col md={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  {product?.description} <br />
                  <Link
                    target="_blank"
                    href={product?.productUrl || ""}
                    rel="noreferrer"
                    className="text-decoration-none float-end"
                  >
                    Get more info....
                  </Link>
                  <br />
                  <br />
                  <Link
                    target="_blank"
                    href={product?.downloadUrl || ""}
                    rel="noreferrer"
                    className="btn btn-primary text-center text-decoration-none  float-end"
                  >
                    Download this
                  </Link>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Table responsive>
                    <tbody>
                      {product?.requirementSpecification &&
                        product?.requirementSpecification.length > 0 &&
                        product?.requirementSpecification.map(
                          (requirement, key) => (
                            <tr key={key}>
                              <td width="30%">{Object.keys(requirement)[0]}</td>
                              <td width="70%">
                                {Object.values(requirement)[0]}
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <ReviewSection
                    reviews={product?.feedbackDetails || []}
                    productId={product?._id || ""}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="fourth">
                  <SkuDetailsList
                    skuDetails={allSkuDetails}
                    setAllSkuDetails={setAllSkuDetails}
                    productId={product?._id || ""}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Row>
      <br />
      <div className="separator">Related Products</div>
      <br />
      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {relatedProducts.map((relatedProduct) => (
          <Col key={relatedProduct._id}>
            <ProductItem
              product={relatedProduct}
              userType={userType || "customer"}
              onDelete={() => fetchProducts()}
            />
          </Col>
        ))}
      </Row>
      {/* <CartOffCanvas setShow={setShow} show={show} /> */}
    </>
  );
};

export default Product;
