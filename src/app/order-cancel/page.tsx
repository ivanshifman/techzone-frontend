"use client";

import OrderMessage from "../../components/Order/OrderMessage";

const OrderCancel = () => {
  return (
    <OrderMessage
      title="Oops! Cancelled!"
      message="Payment failed! Your order got cancelled. Please try again."
      textColor="text-danger"
    />
  );
};

export default OrderCancel;
