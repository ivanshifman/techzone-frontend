import { Col, Row } from "react-bootstrap";
import { Atom } from "react-loading-indicators";

const Loading = () => {
  return (
    <>
      <Row className="justify-content-center align-items-center min-vh-75 p-5">
        <Col xs="auto">
          <Atom size="large" color="#082508" />
        </Col>
      </Row>
    </>
  );
};

export default Loading;
