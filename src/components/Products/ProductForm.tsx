import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Products } from "../../services/product.service";
import { ResponsePayload } from "../../services/api";
import { Product } from "../../interfaces/products.interface";
import type { ProductFormType } from "../../interfaces/products.interface";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import { Archive, Check2Circle, Pen } from "react-bootstrap-icons";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const initialForm: ProductFormType = {
  productName: "",
  description: "",
  category: "",
  platformType: "",
  baseType: "",
  productUrl: "",
  requirementSpecification: [],
  highlights: [],
  downloadUrl: "",
};

interface UpdateProductProps {
  product?: Product;
  productId?: string;
}

const ProductForm: FC<UpdateProductProps> = ({ productId }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormType>({
    defaultValues: initialForm,
  });
  const [productForm, setProductForm] = useState(initialForm);
  const [requirementName, setRequirementName] = useState("");
  const [requirementDescription, setRequirementDescription] = useState("");
  const [highlight, setHighlight] = useState("");
  const [updateRequirementIndex, setUpdateRequirementIndex] = useState(-1);
  const [updateHighlightIndex, setUpdateHighlightIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(!productId);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
        showErrorToast("Invalid product ID");
        return router.replace("/products");
      }

      try {
        if (productId) {
          const { result } = await Products.getProduct(productId);
          if (result?.product) {
            Object.keys(result.product).forEach((key) => {
              setValue(key as keyof ProductFormType, result.product[key]);
            });
            setProductForm(result?.product);
            setIsCreating(false);
            console.log(result.product);
          }
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          showErrorToast(
            error?.response?.data?.errorResponse.message || error?.message
          );
          return router.replace("/products");
        }
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId, setValue]);

  useEffect(() => {
    if (
      JSON.stringify(productForm.requirementSpecification) !==
      JSON.stringify(initialForm.requirementSpecification)
    ) {
      setValue(
        "requirementSpecification",
        productForm.requirementSpecification
      );
    }
    if (
      JSON.stringify(productForm.highlights) !==
      JSON.stringify(initialForm.highlights)
    ) {
      setValue("highlights", productForm.highlights);
    }
  }, [productForm, setValue]);

  const handleHighlightAdd = () => {
    if (!highlight.trim()) return;

    setProductForm((prevState) => {
      const updatedHighlights = [...prevState.highlights];
      if (updateHighlightIndex > -1) {
        updatedHighlights[updateHighlightIndex] = highlight;
      } else {
        updatedHighlights.push(highlight);
      }
      return { ...prevState, highlights: updatedHighlights };
    });

    setHighlight("");
    setUpdateHighlightIndex(-1);
  };

  const handleRequirementAdd = () => {
    if (!requirementName.trim() || !requirementDescription.trim()) return;

    if (updateRequirementIndex > -1) {
      setProductForm((prevState) => ({
        ...prevState,
        requirementSpecification: prevState.requirementSpecification.map(
          (req, index) =>
            index === updateRequirementIndex
              ? { ...req, [requirementName]: requirementDescription }
              : req
        ),
      }));
    } else {
      setProductForm((prevState) => ({
        ...prevState,
        requirementSpecification: [
          ...prevState.requirementSpecification,
          { [requirementName]: requirementDescription },
        ],
      }));
    }

    setRequirementName("");
    setRequirementDescription("");
    setUpdateRequirementIndex(-1);
  };

  const onSubmit = async (data: ProductFormType) => {
    try {
      setIsLoading(true);

      const validData: ProductFormType = {
        productName: data.productName,
        description: data.description,
        category: data.category,
        platformType: data.platformType,
        baseType: data.baseType,
        productUrl: data.productUrl,
        requirementSpecification: data.requirementSpecification,
        highlights: data.highlights,
        downloadUrl: data.downloadUrl,
      };

      const { success, message }: ResponsePayload = productId
        ? await Products.updateProduct(productId, validData)
        : await Products.saveProduct(validData);

      if (!success) throw new Error(message);
      showSuccessToast(message);
      router.push("/");
    } catch (error: any) {
      showErrorToast(
        error.response?.data?.errorResponse.message || error.message
      );
      console.log("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset(initialForm);
  };

  return (
    <Card className="updateProductCard p-3 mt-4">
      <Row>
        <h4 className="text-center productFormHeading">Product Details Form</h4>
        <hr />
        <Col md={6}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="productName">
              <Form.Label>Product name</Form.Label>
              <Form.Control
                type="text"
                className="form-control-no-focus"
                {...register("productName", {
                  required: isCreating ? "Product name is required" : false,
                })}
                placeholder="Enter Product name"
                autoComplete="Product name"
              />
              {errors.productName && (
                <Form.Text className="text-danger mx-2">
                  {errors.productName.message as string}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                className="form-control-no-focus resize-none"
                {...register("description", {
                  required: isCreating
                    ? "Product description is required"
                    : false,
                })}
                placeholder="Enter Product Description"
                autoComplete="Product description"
              />
              {errors.description && (
                <Form.Text className="text-danger mx-2">
                  {errors.description.message as string}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="requirementSpecification" className="mb-3">
              <Form.Label>Product Requirements</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="form-control-no-focus resize-none"
                  value={requirementName}
                  onChange={(e) => setRequirementName(e.target.value)}
                  placeholder="Enter Requirement Name"
                  autoComplete="Product requirement name"
                />
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="form-control-no-focus resize-none"
                  value={requirementDescription}
                  onChange={(e) => setRequirementDescription(e.target.value)}
                  placeholder="Enter Requirement Description"
                  autoComplete="Product requirement description"
                />
                <Button
                  variant="outline-secondary"
                  onClick={handleRequirementAdd}
                >
                  <Check2Circle />
                </Button>
              </InputGroup>
              <Form.Control
                type="hidden"
                {...register("requirementSpecification", {
                  validate: (value) =>
                    isCreating && (!value || value.length === 0)
                      ? "At least one requirement is required"
                      : true,
                })}
              />
              {errors.requirementSpecification && (
                <Form.Text className="text-danger mx-2">
                  {errors.requirementSpecification.message as string}
                </Form.Text>
              )}
            </Form.Group>
            <div>
              <p className="text-primary">Requirements are listed here:</p>
              <Table
                striped
                bordered
                hover
                responsive
                className="overflow-auto"
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productForm.requirementSpecification.length > 0 ? (
                    productForm.requirementSpecification.map((item, index) =>
                      Object.entries(item).map(([key, value], subIndex) => (
                        <tr key={`${index}-${subIndex}`}>
                          <td>{key}</td>
                          <td>{value}</td>
                          <td>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="me-2"
                              onClick={() => {
                                setUpdateRequirementIndex(index);
                                setRequirementName(key);
                                setRequirementDescription(value);
                              }}
                            >
                              <Pen />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                setProductForm({
                                  ...productForm,
                                  requirementSpecification:
                                    productForm.requirementSpecification
                                      .map((req, i) =>
                                        i === index
                                          ? Object.fromEntries(
                                              Object.entries(req).filter(
                                                ([k]) => k !== key
                                              )
                                            )
                                          : req
                                      )
                                      .filter(
                                        (req) => Object.keys(req).length > 0
                                      ),
                                });
                              }}
                            >
                              <Archive />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        No Requirements
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Form>
        </Col>
        <Col md={6}>
          <Form>
            <Form.Group controlId="category">
              <Form.Label>Product Category</Form.Label>
              <Form.Select
                aria-label="Default select example"
                {...register("category", {
                  required: isCreating ? "Product category is required" : false,
                })}
                onChange={(e) => setValue("category", e.target.value)}
              >
                <option value="">Choose the category</option>
                <option value="Operating System">Operating System</option>
                <option value="Application Software">
                  Application Software
                </option>
              </Form.Select>
              {errors.category && (
                <Form.Text className="text-danger mx-2">
                  {errors.category.message as string}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="platformType">
              <Form.Label>Platform Type</Form.Label>
              <Form.Select
                aria-label="Default select example"
                {...register("platformType", {
                  required: isCreating ? "Platform type is required" : false,
                })}
                onChange={(e) => setValue("platformType", e.target.value)}
              >
                <option value="">Choose the platform type</option>
                <option value="Android">Android</option>
                <option value="Windows">Windows</option>
                <option value="iOS">iOS</option>
                <option value="Linux">Linux</option>
                <option value="Mac">Mac</option>
              </Form.Select>
              {errors.platformType && (
                <Form.Text className="text-danger mx-2">
                  {errors.platformType.message as string}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="baseType">
              <Form.Label>Base Type</Form.Label>
              <Form.Select
                aria-label="Default select example"
                {...register("baseType", {
                  required: isCreating ? "Base type is required" : false,
                })}
                onChange={(e) => setValue("baseType", e.target.value)}
              >
                <option>Choose the base type</option>
                <option value="Computer">Computer</option>
                <option value="Mobile">Mobile</option>
              </Form.Select>
              {errors.baseType && (
                <Form.Text className="text-danger mx-2">
                  {errors.baseType.message as string}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="productUrl">
              <Form.Label>Product URL</Form.Label>
              <Form.Control
                type="text"
                className="form-control-no-focus"
                {...register("productUrl", {
                  required: isCreating ? "Product URL is required" : false,
                })}
                placeholder="Enter Product URL"
                autoComplete="Product URL"
              />
              {errors.productUrl && (
                <Form.Text className="text-danger mx-2">
                  {errors.productUrl.message as string}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="downloadUrl">
              <Form.Label>Product Download URL</Form.Label>
              <Form.Control
                type="text"
                className="form-control-no-focus"
                {...register("downloadUrl", {
                  required: isCreating ? "Download URL is required" : false,
                })}
                placeholder="Enter Product Download URL"
                autoComplete="Product Download URL"
              />
              {errors.downloadUrl && (
                <Form.Text className="text-danger mx-2">
                  {errors.downloadUrl.message as string}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="highlights">
              <Form.Label>Product Highlights</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  className="form-control-no-focus"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  placeholder="Enter Product Highlight"
                  autoComplete="Product Highlight"
                  onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === "Enter") {
                      handleHighlightAdd();
                    }
                  }}
                />
                <Button variant="secondary" onClick={handleHighlightAdd}>
                  <Check2Circle />
                </Button>
              </InputGroup>
              <Form.Control
                type="hidden"
                {...register("highlights", {
                  validate: (value) =>
                    isCreating && (!value || value.length === 0)
                      ? "At least one highlights is required"
                      : true,
                })}
              />
              {errors.highlights && (
                <Form.Text className="text-danger mx-2">
                  {errors.highlights.message as string}
                </Form.Text>
              )}
            </Form.Group>
            <p className="text-primary">Product highlights are listed below:</p>
            <ListGroup className="overflow-auto">
              {productForm.highlights.length > 0 ? (
                productForm.highlights.map((highlight, index) => (
                  <ListGroup.Item key={index}>
                    {highlight}
                    <span className="float-end">
                      <Pen
                        className="pointer"
                        onClick={() => {
                          setHighlight(highlight);
                          setUpdateHighlightIndex(index);
                        }}
                      />{" "}
                      &nbsp;&nbsp;
                      <Archive
                        className="pointer"
                        onClick={() => {
                          setProductForm({
                            ...productForm,
                            highlights: productForm.highlights.filter(
                              (highlight, key) => key !== index
                            ),
                          });
                          setHighlight("");
                        }}
                      />
                    </span>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center">
                  No Highlights
                </ListGroup.Item>
              )}
            </ListGroup>
            <br />
            <Row className="mt-4 g-2">
              <Col xs={12} className="text-center">
                <Link href="/products">
                  <Button variant="secondary">Back</Button>
                </Link>{" "}
                <Button variant="danger" onClick={handleCancel}>
                  Cancel
                </Button>{" "}
                <Button
                  className="xs-mt-2"
                  variant="primary"
                  type="submit"
                  disabled={isLoading}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isLoading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  {isCreating ? "Create Product" : "Update Product"}
                </Button>
              </Col>{" "}
            </Row>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductForm;
