"use client";

import OrderMessage from "../../components/Order/OrderMessage";

export const dynamic = "force-dynamic";

const OrderSuccess = () => {
  return (
    <OrderMessage
      title="Thank You!"
      message="Please check your order details. You will receive an email with order details."
      textColor=""
    />
  );
};

export default OrderSuccess;
