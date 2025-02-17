"use client";

import { useRouter } from "next/navigation";
import { useAppContext } from "../../context";
import { Users } from "../../services/user.service";
import { ResponsePayload } from "../../services/api";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import AccountDetails from "../../components/MyAccount/AccountDetails";
// import AllOrders from '../components/MyAccount/AllOrders';

const MyAccountPage = () => {
  const { state, dispatch } = useAppContext();

  const user = state?.user;
  const token = state?.token;

  console.log("token", token);
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      dispatch({
        type: "LOGOUT",
      });
      const { success, message }: ResponsePayload = await Users.logoutUser();
      if (!success) throw new Error(message);

      localStorage.removeItem("_tech_user");
      showSuccessToast(message);
      router.push("/auth");
    } catch (error: any) {
      showErrorToast(
        error.response?.data?.errorResponse.message || error.message
      );
    }
  };

  return (
    <ProtectedRoute>
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">Account Details</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">All Orders</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third" onClick={logoutHandler}>
                  Logout
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <AccountDetails
                  user={user}
                  dispatch={dispatch}
                  token={token}
                  state={state}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="second">{/* <AllOrders /> */}</Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </ProtectedRoute>
  );
};

export default MyAccountPage;
