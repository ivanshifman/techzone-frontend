import { Suspense } from "react";
import { Col, Row } from "react-bootstrap";
import Loading from "../../components/shared/Loading";
import RegisterLogin from "../../components/Auth/RegisterLogin";

const AuthPage = () => {
  return (
    <Suspense fallback={<Loading />}>
    <Row>
      <Col sm={6} className="mt-3">
        <RegisterLogin />
      </Col>
      <Col sm={6} className="mt-3">
        <RegisterLogin isRegisterForm={true} />
      </Col>
    </Row>
    </Suspense>
    
  );
};

export default AuthPage;
