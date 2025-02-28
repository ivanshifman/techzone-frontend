import Link from "next/link";
import { FC } from "react";
import { Badge, Button, Image } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { useAppContext } from "../../context";
import { CartItem } from "../../types/context.types";
import { getFormatedStringFromDays } from "../../utils/formatStringFromDays";
import { ICartItemsProps } from "../../interfaces/cartCanvas.interface";

const CartItems: FC<ICartItemsProps> = ({ rmvdeleteBtn }) => {
  const { state, cartItems, cartDispatch } = useAppContext();

  const cartDeleteHandler = (id: string) => {
    cartDispatch({
      type: "REMOVE_ITEM",
      payload: { skuId: id },
      cartKey: state.user ? `_tech_cart_${state.user.name}` : "_tech_cart",
    });
  };
  return (
    <>
      {cartItems.length > 0 ? (
        cartItems.map((item: CartItem, index: number) => (
          <div
            className="d-flex justify-content-between align-items-center mt-3 p-2 items rounded"
            key={index}
          >
            <div className="d-flex flex-row">
              <Image
                alt=""
                height={50}
                width={50}
                roundedCircle={true}
                src={item.productImage}
              />
              <div className="ml-2">
                <span className="d-block">{item.productName}</span>
                <span className="spec">
                  <Badge bg="info" text="dark">
                    {item.lifetime
                      ? "Lifetime"
                      : getFormatedStringFromDays(item.validity)}
                  </Badge>
                </span>
              </div>
            </div>
            <div className="d-flex flex-row align-items-center">
              <span>
                {item.quantity} X USD{item.price}
              </span>
              {!rmvdeleteBtn && (
                <Button
                  variant="outline-danger"
                  className="ms-2"
                  onClick={() => cartDeleteHandler(item.skuId)}
                >
                  <Trash />
                </Button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="d-flex flex-row">
          <h4>No items in cart</h4>
          <Link href={`/products`}>
            <Button variant="outline-primary" className="ms-3">
              Shop Now
            </Button>
          </Link>
        </div>
      )}
      <hr />
      <div className="calPlace">
        <p className="cartTotal text-end">
          Total: USD
          {cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          )}
        </p>
      </div>
    </>
  );
};

export default CartItems;
