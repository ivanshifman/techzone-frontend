import { FC, useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  InputGroup,
  Badge,
  ListGroup,
} from "react-bootstrap";
import {
  Archive,
  ArrowLeft,
  Check2Circle,
  Pen,
  Plus,
} from "react-bootstrap-icons";
import { Products } from "../../services/product.service";
import {
  ISkuDetailsLicense,
  ISkuDetailsLicenseProps,
} from "../../interfaces/skuDetails.interface";
import { useForm } from "react-hook-form";
import { showErrorToast } from "../../utils/toast";
import Swal from "sweetalert2";

const SkuDetailsLicense: FC<ISkuDetailsLicenseProps> = ({
  licensesListFor,
  setLicensesListFor,
  productId,
}) => {
  const [licenses, setLicenses] = useState<ISkuDetailsLicense[]>([]);
  const [addFormShow, setAddFormShow] = useState(false);
  const [licenseIdForUpdate, setLicenseIdForUpdate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForDelete, setIsLoadingForDelete] = useState({
    status: false,
    id: "",
  });
  const [isLoadingForFetch, setIsLoadingForFetch] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ licenseKey: string }>({
    defaultValues: { licenseKey: "" },
  });

  useEffect(() => {
    if (licensesListFor && productId) {
      fetchAllLicenses(productId, licensesListFor);
    }
  }, [licensesListFor, productId]);

  const fetchAllLicenses = async (productId: string, skuId: string) => {
    if (!productId || !skuId) return;
    setIsLoadingForFetch(true);
    try {
      const { result, success, message } = await Products.getLicenses(
        productId,
        skuId
      );
      if (!success) throw new Error(message);
      setLicenses(result);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      showErrorToast(
        error?.response?.data?.errorResponse.message || error?.message
      );
    } finally {
      setIsLoadingForFetch(false);
    }
  };

  const deleteLicense = async (licenseId: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Want to delete? You will lose all licenses for this SKU.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });
      if (!isConfirmed) return;

      setIsLoadingForDelete({ status: true, id: licenseId });
      const { success, message } = await Products.deleteLicense(licenseId);
      if (!success) throw new Error(message);

      await fetchAllLicenses(productId, licensesListFor);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      showErrorToast(
        error?.response?.data?.errorResponse.message || error?.message
      );
    } finally {
      setIsLoadingForDelete({ status: false, id: "" });
    }
  };

  const onSubmit = async (data: { licenseKey: string }) => {
    setIsLoading(true);
    try {
      if (licenseIdForUpdate) {
        const { success, message } = await Products.updateLicense(
          productId,
          licensesListFor,
          licenseIdForUpdate,
          data
        );
        if (!success) throw new Error(message);

        setLicenses((prev) =>
          prev.map((license) =>
            license._id === licenseIdForUpdate
              ? { ...license, licenseKey: data.licenseKey }
              : license
          )
        );
      } else {
        const { success, message, result } = await Products.addLicense(
          productId,
          licensesListFor,
          data
        );
        if (!success) throw new Error(message);

        setLicenses((prev) => [...prev, result]);
      }

      reset();
      setAddFormShow(false);
      setLicenseIdForUpdate("");
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      showErrorToast(
        error?.response?.data?.errorResponse.message || error?.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-3">
      <Button
        variant="info"
        className="btnBackLicense w-auto m-2"
        onClick={() => setLicensesListFor("")}
      >
        <ArrowLeft />
      </Button>
      {(!addFormShow || licenseIdForUpdate) && (
        <Button
          variant="secondary"
          className="btnAddLicense w-auto m-2"
          onClick={() => {
            setAddFormShow(true);
            reset();
          }}
        >
          <Plus />
          Add New
        </Button>
      )}

      {addFormShow && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h6 className="text-success">
            License Keys Information ({licenses.length}):
          </h6>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>SKU License Keys</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                className="form-control-no-focus"
                placeholder="Enter License Key"
                {...register("licenseKey", {
                  required: "License key is required",
                })}
              />
              <Button variant="secondary" type="submit" disabled={isLoading}>
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                <Check2Circle /> Submit
              </Button>
            </InputGroup>
            {errors.licenseKey && (
              <span className="text-danger">{errors.licenseKey.message}</span>
            )}
          </Form.Group>
        </Form>
      )}

      <div>License Keys are listed below:</div>
      <ListGroup className="licenceLists">
        {licenses.length > 0 ? (
          licenses.map((license) => (
            <ListGroup.Item key={license._id}>
              <Badge bg="info">{license.licenseKey}</Badge>{" "}
              <span
                className="editLBtn"
                onClick={() => {
                  setLicenseIdForUpdate(license._id);
                  setValue("licenseKey", license.licenseKey);
                  setAddFormShow(true);
                }}
              >
                <Pen />
              </span>
              <span
                className="delLBtn"
                onClick={() => deleteLicense(license._id)}
              >
                {isLoadingForDelete.status &&
                isLoadingForDelete.id === license._id ? (
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <Archive />
                )}
              </span>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>
            <span>
              {isLoadingForFetch ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span>Loading...</span>
                </>
              ) : (
                "No License Keys Found"
              )}
            </span>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default SkuDetailsLicense;
