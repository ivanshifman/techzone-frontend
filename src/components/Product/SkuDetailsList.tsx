import { FC, useState } from "react";
import { Badge, Button, Table } from "react-bootstrap";
import { Archive, Pen } from "react-bootstrap-icons";
import { Products } from "../../services/product.service";
import { ISkuDetailsListProps } from "../../interfaces/skuDetails.interface";
import { getFormatedStringFromDays } from "../../utils/formatStringFromDays";
// import SkuDetailsForm from "./SkuDetailsForm";
// import SkuDetailsLicense from "./SkuDetailsLicense";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Swal from "sweetalert2";
import { SkuDetail } from "../../interfaces/products.interface";

const SkuDetailsList: FC<ISkuDetailsListProps> = ({
  skuDetails: allSkuDetails,
  setAllSkuDetails,
  productId,
}) => {
  const [skuDetailsFormShow, setSkuDetailsFormShow] = useState(false);
  const [skuIdForUpdate, setSkuIdForUpdate] = useState("");
  const [licensesListFor, setLicensesListFor] = useState("");
  const [isLoadingForDelete, setIsLoadingForDelete] = useState({
    status: false,
    id: "",
  });

  console.log("allSkuDetails", allSkuDetails);

  const deleteHandler = async (skuId: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Want to delete? You will lost all licenses for this sku.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (isConfirmed) {
        setIsLoadingForDelete({ status: true, id: skuId });
        const { success, message } = await Products.deleteSku(productId, skuId);
        if (success) {
          setAllSkuDetails(
            allSkuDetails.filter((sku: { _id: string }) => sku._id !== skuId)
          );
          showSuccessToast(message);
        }
      }
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.errorResponse.message || error?.message
      );
    } finally {
      setIsLoadingForDelete({ status: false, id: "" });
    }
  };

  return (
    <>
      {!skuDetailsFormShow && !licensesListFor && (
        <>
          <Button
            variant="secondary"
            onClick={() => setSkuDetailsFormShow(true)}
          >
            Add SKU Details
          </Button>
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>License Keys</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {allSkuDetails && allSkuDetails.length > 0 ? (
                allSkuDetails.map((skuDetail: SkuDetail) => (
                  <tr key={skuDetail?._id}>
                    <td>{skuDetail?.skuName}</td>
                    <td>
                      USD{skuDetail?.price}{" "}
                      <Badge bg="warning" text="dark">
                        {skuDetail?.lifetime
                          ? "Lifetime"
                          : getFormatedStringFromDays(skuDetail?.validity)}
                      </Badge>
                    </td>
                    <td>{skuDetail?.stock}</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => {
                          setLicensesListFor(skuDetail?._id);
                          setSkuDetailsFormShow(false);
                        }}
                      >
                        View
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="outline-dark"
                        id={skuDetail?._id}
                        onClick={() => {
                          setSkuIdForUpdate(skuDetail?._id);
                          setSkuDetailsFormShow(true);
                        }}
                      >
                        <Pen />
                      </Button>{" "}
                      <Button
                        variant="outline-dark"
                        onClick={() => deleteHandler(skuDetail?._id)}
                      >
                        {isLoadingForDelete.status &&
                        isLoadingForDelete.id === skuDetail?._id ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          <Archive />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No SKU Details found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}

      {/* {skuDetailsFormShow && (
        <SkuDetailsForm
          setSkuDetailsFormShow={setSkuDetailsFormShow}
          setAllSkuDetails={setAllSkuDetails}
          allSkuDetails={allSkuDetails}
          productId={productId}
          skuIdForUpdate={skuIdForUpdate}
          setSkuIdForUpdate={setSkuIdForUpdate}
        />
      )} */}

      {/* {licensesListFor && (
        <SkuDetailsLicense
          licensesListFor={licensesListFor}
          setLicensesListFor={setLicensesListFor}
          productId={productId}
        />
      )} */}
    </>
  );
};

export default SkuDetailsList;
