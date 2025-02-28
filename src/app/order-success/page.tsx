"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "../../context";
import { Col, Row } from "react-bootstrap";

const OrderSuccess = () => {
  const router = useRouter();
  const { state, cartDispatch } = useAppContext();

  const user = state?.user;

  useEffect(() => {
    const purchaseInProgress = localStorage.getItem("purchase_in_progress");

    if (!purchaseInProgress) {
      router.replace("/");
      return;
    }

    cartDispatch({
      type: "CLEAR_CART",
      cartKey: user ? `_tech_cart_${user.name}` : "_tech_cart",
    });

    const handleBeforeUnload = () => {
      localStorage.removeItem("purchase_in_progress");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [router, user, cartDispatch]);

  const handleBack = () => {
    localStorage.removeItem("purchase_in_progress");
    router.push("/");
  };

  return (
    <Row>
      <Col md={{ span: 6, offset: 3 }}>
        <div className="jumbotron text-center">
          <h1 className="display-3">Thank You!</h1>
          <p className="lead">
            <strong>Please check your order details</strong> for further
            instructions. You will recieve an email with order details.
          </p>
          <hr />
          <p className="lead">
            <Link
              href={`/products`}
              className="btn btn-primary btn-sm"
              role="button"
              onClick={handleBack}
            >
              Shop More
            </Link>
          </p>
        </div>
      </Col>
    </Row>
  );
};

export default OrderSuccess;
