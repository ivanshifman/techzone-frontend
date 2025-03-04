import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { useAppContext } from "../../context";
import { Orders } from "../../services/order.service";
import { ICartOffCanvasProps } from "../../interfaces/cartCanvas.interface";
import CartItems from "./CartItems";
import { showErrorToast } from "../../utils/toast";

const CartOffCanvas: FC<ICartOffCanvasProps> = ({ show, setShow, items }) => {
  const handleClose = () => setShow(false);
  const router = useRouter();
  const { cartItems } = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      if (cartItems.length > 0) {
        const checkoutDetails = cartItems.map((item) => ({
          skuPriceId: item.skuPriceId,
          quantity: item.quantity,
          skuId: item.skuId,
        }));

        const { result, success, message } = await Orders.checkoutSession(
          checkoutDetails
        );

        if (!success) {
          throw new Error(message);
        }

        localStorage.setItem("purchase_in_progress", "true");

        router.push(result);
      }
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      showErrorToast(
        error.response?.data?.errorResponse.message || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Shoping Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <CartItems />
          <Button
            variant="primary"
            className="w-100"
            disabled={isLoading || items.length === 0}
            onClick={() => handleCheckout()}
          >
            {isLoading && (
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Checkout
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CartOffCanvas;
