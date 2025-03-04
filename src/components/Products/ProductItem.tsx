import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, Suspense, useState } from "react";
import { Products } from "../../services/product.service";
import { SkuDetail } from "../../interfaces/products.interface";
import { IProductItemProps } from "../../interfaces/productItem.interface";
import { getFormatedStringFromDays } from "../../utils/formatStringFromDays";
import { Button, Card, Col, Badge } from "react-bootstrap";
import { Eye, Pen, Trash, Upload } from "react-bootstrap-icons";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { Rating } from "react-simple-star-rating";
import Swal from "sweetalert2";

const ProductItem: FC<IProductItemProps> = ({
  userType,
  product,
  onDelete,
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(product?.image);

  const deleteProduct = async () => {
    setIsLoading(true);
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "You will lose all details, SKUs, and licenses for this product.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (isConfirmed) {
        const { success, message } = await Products.deleteProduct(product._id);
        if (!success) {
          throw new Error(message);
        }
        onDelete();
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
    <Suspense fallback={null}>
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
              {product?.skuDetails?.length > 0
                ? `USD${Math.min(
                    ...product.skuDetails.map((sku) => sku.price)
                  )} - USD${Math.max(
                    ...product.skuDetails.map((sku) => sku.price)
                  )}`
                : "USD000"}
            </span>
          </Card.Text>
          {product?.skuDetails &&
            product?.skuDetails?.length > 0 &&
            product?.skuDetails
              .sort(
                (a: SkuDetail, b: SkuDetail) =>
                  (a.validity ?? 0) - (b.validity ?? 0)
              )
              .map((sku: SkuDetail, key: any) => (
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
    </Suspense>
    
  );
};

export default ProductItem;
