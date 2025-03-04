"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  Col,
  Image,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import { Clipboard } from "react-bootstrap-icons";
import { Orders } from "../../../services/order.service";
import { IOrderOne } from "../../../interfaces/order.interface";
import { ISkuDetailsLicense } from "../../../interfaces/skuDetails.interface";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import Loading from "../../../components/shared/Loading";

const Order: FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<IOrderOne | null>(null);
  console.log(order);

  useEffect(() => {
    const abortController = new AbortController();

    if (typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      showErrorToast("Invalid order ID");
      router.replace("/products");
      return;
    }

    const fetchOrder = async (signal?: AbortSignal) => {
      try {
        const { result, success } = await Orders.getOrder(id);
        if (success) {
          setOrder(result);
        }
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (
          (error.response?.status === 404 || error.response?.status === 400) &&
          !signal?.aborted
        ) {
          showErrorToast(
            error?.response?.data?.errorResponse.message || error?.message
          );
          router.replace("/products");
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    };

    fetchOrder(abortController.signal);
    return () => abortController.abort();
  }, [id]);

  const renderLicenses = (licenses: ISkuDetailsLicense[] | string[]) => {
    if (!licenses.length) return "Not Found";

    return (
      <>
        {licenses.map((license, index) => (
          <span key={index}>
            {typeof license === "string"
              ? license
              : license.licenseKey || "Unknown License"}
          </span>
        ))}
        <Button
          variant="light"
          size="sm"
          onClick={() => {
            const licensesText = licenses
              .map((l) => (typeof l === "string" ? l : l.licenseKey))
              .join(", ");
            navigator.clipboard.writeText(licensesText);
            showSuccessToast("License key copied successfully");
          }}
        >
          <Clipboard />
        </Button>
      </>
    );
  };

  if (loading || !order) return <Loading />;

  return (
    <>
      <Row>
        <Col>
          <Card className="mt-4">
            <Card.Header>Order Details</Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Products</th>
                    <th>License Keys</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderedItems.map((item) => (
                    <tr key={item.skuCode}>
                      <td>
                        <div className="itemTitle d-flex align-items-center">
                          <Image
                            height={50}
                            width={50}
                            roundedCircle
                            src={item.productImage || "/default-product.jpg"}
                            alt="Product"
                          />
                          <div className="ms-2">
                            <Link
                              href={`/products/${item.productId}`}
                              className="text-decoration-none"
                            >
                              {item.productName || "Demo Product"}
                            </Link>
                            <p className="fw-bold">
                              {item.quantity} x ${item.price}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{renderLicenses(item.licenses)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mt-4">
            <Card.Header>
              <Card.Title>
                Total Amount: USD {order.paymentInfo?.paymentAmount}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  Order Date & Time:{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  Payment Method:{" "}
                  {order.paymentInfo?.paymentMethod.toUpperCase()}
                </ListGroup.Item>
                <ListGroup.Item>
                  Order Status: <Badge>{order.orderStatus.toUpperCase()}</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  Address:{" "}
                  {Object.values(order.customerAddress)
                    .filter(Boolean)
                    .join(", ")}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Order;
