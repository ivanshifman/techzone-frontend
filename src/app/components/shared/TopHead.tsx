"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Context } from "../../context/index";
import {
  Badge,
  Button,
  Col,
  Form,
  InputGroup,
  Nav,
  Navbar,
  NavDropdown,
  Row,
} from "react-bootstrap";
import { PersonCircle, Search } from "react-bootstrap-icons";
import styles from "../../styles/Home.module.css";

const TopHead = () => {
  const [searchText, setSearchText] = useState("");
  const [baseType, setBaseType] = useState("Applications");

  const {
    state: { user },
    cartItems,
  } = useContext(Context);

  const router = useRouter();

  const navigateTo = (path: string) => router.push(path);

  const handleSearch = () => {
    if (searchText.trim()) {
      navigateTo(`/products?search=${searchText}`);
    }
  };

  const handleUserClick = () => {
    user && user.email ? navigateTo("/my-account") : navigateTo("/auth");
  };

  const handleBaseTypeChange = (type: string | null) => {
    if (type) {
      setBaseType(type);
      type === "Applications"
        ? navigateTo("/products")
        : navigateTo(`/products?baseType=${type}`);
    }
  };

  return (
    <>
      <Row className="mt-3">
        <Col xs={6} md={4}>
          <h3 className={styles.logoHeading} onClick={() => navigateTo("/")}>
            TechZone
          </h3>
        </Col>
        <Col xs={6} md={4}>
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              aria-label="Search product"
              placeholder="Search the product here..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="outline-success" onClick={handleSearch}>
              Search
            </Button>
          </InputGroup>
        </Col>
        <Col xs={6} md={4}>
          <PersonCircle
            height="40"
            width="40"
            color="#4c575f"
            className={styles.personIcon}
            onClick={handleUserClick}
          />
        </Col>
      </Row>
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigateTo("/")}>Home</Nav.Link>
            <NavDropdown title={baseType} id="collasible-nav-dropdown">
              {["Computer", "Mobile", "Applications"].map((type) => (
                <NavDropdown.Item
                  key={type}
                  eventKey={type}
                  onClick={() => handleBaseTypeChange(type)}
                >
                  {type}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link className={styles.cartItems} onClick={() => {}}>
              Items: <Badge bg="secondary">{cartItems.length}</Badge> (USD{" "}
              {cartItems.reduce(
                (total: number, item: { quantity: number; price: number }) =>
                  total + Number(item.price) * Number(item.quantity),
                0
              )}
              )
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default TopHead;
