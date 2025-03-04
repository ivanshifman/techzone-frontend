import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Dropdown,
  DropdownButton,
  Row,
  Table,
} from "react-bootstrap";
import { Orders } from "../../services/order.service";
import { showErrorToast } from "../../utils/toast";
import { IOrder } from "../../interfaces/order.interface";

const AllOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filterTitle, setFilterTitle] = useState<string>("Filter by status");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (status?: string) => {
    setOrders([]);
    try {
      const { result, success, message } = await Orders.getAllOrders(status);
      if (!success) {
        throw new Error(message);
      }
      setOrders(result.length > 0 ? result : []);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      showErrorToast(
        error?.response?.data?.errorResponse.message || error?.message
      );
      setOrders([]);
    }
  };

  const dateTOLocal = (date: string | number | Date) => {
    return new Date(date).toLocaleString();
  };

  const handleSelect = (status: string | null) => {
    setFilterTitle(status ? `Filter by ${status}` : "Filter by status");
    fetchItems(status ?? "");
  };

  return (
    <>
      <Row>
        <DropdownButton
          variant="outline-secondary"
          title={filterTitle}
          id="input-group-dropdown-2"
          onSelect={handleSelect}
        >
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
          <Dropdown.Item eventKey="completed">Completed</Dropdown.Item>
        </DropdownButton>
      </Row>
      <Table responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Order Status</th>
            <th>Order Total</th>
            <th>Order Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order: IOrder) => (
              <tr key={order._id}>
                <td className="cursor-pointer text-success">
                  <Link href={`/orders/${order._id}`}>
                    <span>{order.orderId}</span>
                  </Link>
                </td>

                <td>{dateTOLocal(order.paymentInfo.paymentDate)}</td>
                <td>
                  <Badge key={order.orderStatus}>
                    {order.orderStatus.toUpperCase()}
                  </Badge>
                </td>
                <td>USD{order.paymentInfo.paymentAmount} </td>
                <td>
                  <Link href={`/orders/${order._id}`}>
                    <Button variant="outline-dark">View Order Details</Button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No orders found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default AllOrders;
