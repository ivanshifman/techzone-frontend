import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Products } from "../../services/product.service";
import { getFormatedStringFromDays } from "../../utils/formatStringFromDays";
import { Button, Card, Col, Badge } from "react-bootstrap";
import { Eye, Pen, Trash, Upload } from "react-bootstrap-icons";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { Rating } from "react-simple-star-rating";
import { SkuDetail } from "../../interfaces/products.interface";
import { IProductItemProps } from "../../interfaces/productItem.interface";

const ProductItem: FC<IProductItemProps> = ({ userType, product }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(product?.image);

  const deleteProduct = async () => {
    try {
      setIsLoading(true);
      const deleteConfirm = confirm(
        "Want to delete? You will lost all details, skus and licences for this product"
      );
      if (deleteConfirm) {
        const { success, message } = await Products.deleteProduct(product._id);
        if (!success) {
          throw new Error(message);
        }
        router.push("/products/");
        showSuccessToast(message);
      }
    } catch (error: any) {
      showErrorToast(
        error.response?.data?.errorResponse.message || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProductImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("productImage", file);
      const { success, message, result } = await Products.uploadProductImage(
        product._id,
        formData
      );
      if (!success) {
        throw new Error(message);
      }

      setImage(result);
      showSuccessToast(message);
    } catch (error: any) {
      showErrorToast(
        error.response?.data?.errorResponse.message || error.message
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Col>
      <Card className="productCard">
        <Card.Img
          onClick={() => router.push(`/products/${product?._id}`)}
          variant="top"
          src={
            uploading ? "https://www.ebi.ac.uk/training/progressbar.gif" : image
          }
        />
        <Card.Body>
          <Card.Title onClick={() => router.push(`/products/${product?._id}`)}>
            {product.productName}
          </Card.Title>
          <Rating initialValue={product?.avgRating || 0} readonly size={20} />

          <Card.Text>
            <span className="priceText">
              <span className="priceText">
                {product?.skuDetails
                  ? product?.skuDetails?.length > 1
                    ? `USD${Math.min.apply(
                        Math,
                        product?.skuDetails.map(
                          (sku: { price: number }) => sku.price
                        )
                      )} - USD${Math.max.apply(
                        Math,
                        product?.skuDetails.map(
                          (sku: { price: number }) => sku.price
                        )
                      )}`
                    : `USD${product?.skuDetails?.[0]?.price || "000"}`
                  : "USD000"}{" "}
              </span>
            </span>
          </Card.Text>
          {product?.skuDetails &&
            product?.skuDetails?.length > 0 &&
            product?.skuDetails
              .sort(
                (a: SkuDetail, b: SkuDetail) =>
                  (a.validity ?? 0) - (b.validity ?? 0)
              )
              .map((sku: Record<string, any>, key: any) => (
                <Badge bg="warning" text="dark" className="skuBtn" key={key}>
                  {sku.lifetime
                    ? "Lifetime"
                    : getFormatedStringFromDays(sku.validity)}
                </Badge>
              ))}
          <br />
          {userType === "admin" ? (
            <div className="btnGrpForProduct">
              <div className="file btn btn-md btn-outline-primary fileInputDiv">
                <Upload />
                <input
                  type="file"
                  name="file"
                  className="fileInput"
                  onChange={uploadProductImage}
                />
              </div>
              <Link
                href={`/update-product/${product?._id}`}
                className="btn btn-outline-dark viewProdBtn"
              >
                <Pen />
              </Link>
              <Button
                variant="outline-dark"
                className="btn btn-outline-dark viewProdBtn"
                onClick={() => deleteProduct()}
              >
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                <Trash />
              </Button>
              <Link
                href={`/products/${product?._id}`}
                className="btn btn-outline-dark viewProdBtn"
              >
                <Eye />
              </Link>
            </div>
          ) : (
            <Link
              href={`/products/${product?._id}`}
              className="btn btn-outline-dark viewProdBtn"
            >
              <Eye /> View details
            </Link>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductItem;
