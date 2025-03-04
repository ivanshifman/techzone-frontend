import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  Form,
  Button,
  InputGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { Products } from "../../services/product.service";
import { ISkuDetailsFormProps } from "../../interfaces/skuDetails.interface";
import { getFormatedStringFromDays } from "../../utils/formatStringFromDays";
import { showErrorToast } from "../../utils/toast";

const initialState = {
  skuName: "",
  price: 0,
  stock: 0,
  validity: 0,
  validityType: "Select Type",
  lifetime: false,
};

const SkuDetailsForm: FC<ISkuDetailsFormProps> = ({
  productId,
  setSkuDetailsFormShow,
  allSkuDetails,
  setAllSkuDetails,
  skuIdForUpdate,
  setSkuIdForUpdate,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: initialState });

  const lifetime = watch("lifetime");

  useEffect(() => {
    if (skuIdForUpdate && allSkuDetails.length > 0) {
      const sku = allSkuDetails.find((sku) => sku._id === skuIdForUpdate);
      if (sku) {
        const periodTimes = getFormatedStringFromDays(sku.validity);
        reset({
          skuName: sku.skuName,
          price: sku.price,
          stock: sku.stock,
          validity: Number(periodTimes.split(" ")[0]) || 0,
          validityType: periodTimes.split(" ")[1] || "Select Type",
          lifetime: sku.lifetime,
        });
      }
    } else {
      reset(initialState);
    }
  }, [skuIdForUpdate, allSkuDetails, reset]);

  const onSubmit = async (data: typeof initialState) => {
    try {
      if (!data.skuName || !data.price || (!data.lifetime && !data.validity)) {
        throw new Error("Invalid data");
      }
      if (!data.lifetime && data.validityType === "Select Type") {
        throw new Error("Invalid data");
      }

      if (!data.lifetime) {
        data.validity =
          data.validityType === "months"
            ? data.validity * 30
            : data.validity * 365;
      } else {
        data.validity = Number.MAX_SAFE_INTEGER;
      }

      const { validityType, ...sanitizedData } = data;

      const { result, success, message } = skuIdForUpdate
        ? await Products.updateSku(productId, skuIdForUpdate, sanitizedData)
        : await Products.addSku(productId, { skuDetails: [sanitizedData] });

      if (!success) {
        throw new Error(message);
      }
      setSkuDetailsFormShow(false);
      setSkuIdForUpdate("");
      setAllSkuDetails(result?.skuDetails);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      showErrorToast(
        error?.response?.data?.errorResponse.message || error?.message
      );
    }
  };

  return (
    <Card className="p-3">
      <h6 className="text-success">SKU information ::</h6>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="skuName">
          <Form.Label>SKU Name</Form.Label>
          <Form.Control
            type="text"
            className="form-control-no-focus"
            placeholder="Enter SKU Name"
            {...register("skuName", {
              required: "SKU Name is required",
              minLength: {
                value: 3,
                message: "SKU Name must be at least 3 characters",
              },
            })}
          />
          {errors.skuName && (
            <span className="text-danger">{errors.skuName.message}</span>
          )}
        </Form.Group>

        <Form.Group controlId="price">
          <Form.Label>SKU Price For Each License</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter SKU Price"
            className="form-control-no-focus"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: {
                value: 100,
                message: "Price must be at least 100",
              },
            })}
          />
          {errors.price && (
            <span className="text-danger">{errors.price.message}</span>
          )}
        </Form.Group>

        <Form.Group controlId="validity">
          <Form.Label>SKU Validity</Form.Label>
          <span className="text-muted">
            (If validity is lifetime then check the box)
            <Form.Check
              type="switch"
              className="form-control-no-focus"
              id="custom-switch"
              label="Lifetime"
              {...register("lifetime")}
            />
          </span>
          <InputGroup className="mb-3">
            <Form.Control
              type="number"
              className="form-control-no-focus"
              disabled={lifetime}
              {...register("validity", {
                valueAsNumber: true,
                validate: (value) => {
                  if (!lifetime && value <= 0) {
                    return "Validity must be greater than zero";
                  }
                  return true;
                },
              })}
            />
            <DropdownButton
              variant="outline-secondary"
              title={watch("validityType") || "Select Type"}
              id="input-group-dropdown-9"
              disabled={lifetime}
              align="end"
              {...register("validityType", {
                validate: (value) => {
                  if (!lifetime && !value) {
                    return "Please select a validity type (Months or Years)";
                  }
                  return true;
                },
              })}
            >
              <Dropdown.Item onClick={() => setValue("validityType", "Months")}>
                Months
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setValue("validityType", "Years")}>
                Years
              </Dropdown.Item>
            </DropdownButton>
          </InputGroup>
          {errors.validity && (
            <span className="text-danger">{errors.validity.message}</span>
          )}
          {errors.validityType && (
            <span className="text-danger">{errors.validityType.message}</span>
          )}
          {!lifetime && !watch("validityType") && (
            <span className="text-danger">
              Please select a validity type (Months or Years)
            </span>
          )}
        </Form.Group>

        <Form.Group controlId="stock">
          <Form.Label>SKU Stock</Form.Label>
          <Form.Control
            type="number"
            className="form-control-no-focus"
            placeholder="Enter SKU Stock"
            {...register("stock", {
              required: "Stock is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Stock must be at least 1",
              },
            })}
          />
          {errors.stock && (
            <span className="text-danger">{errors.stock.message}</span>
          )}
        </Form.Group>

        <div className="mt-3">
          <Button
            variant="outline-info"
            onClick={() => setSkuDetailsFormShow(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outline-primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Submit
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default SkuDetailsForm;
