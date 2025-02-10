import { Col, Row } from "react-bootstrap";
import RegisterLogin from "../../components/Auth/RegisterLogin";


const AuthPage = () => {
  return (
    <Row>
      <Col sm={6} className="mt-3">
        <RegisterLogin />
      </Col>
      <Col sm={6} className="mt-3">
        <RegisterLogin isRegisterForm={true} />
      </Col>
    </Row>
  );
};

export default AuthPage;
