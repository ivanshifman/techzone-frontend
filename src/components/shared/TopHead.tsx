"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/index";
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
import { useProducts } from "../Hooks/useProducts";
import CartOffCanvas from "./CartOffCanvas";

const TopHead = () => {
  const { state, cartItems } = useAppContext();
  const { uniqueBasesTypes } = useProducts();

  const [searchText, setSearchText] = useState<string>("");
  const [baseType, setBaseType] = useState<string>("Applications");
  const [total, setTotal] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);

  const user = state?.user;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateTo = (path: string) => router.push(path);

  const handleSearch = () => {
    if (searchText.trim()) {
      navigateTo(`/products?search=${searchText}`);
      setSearchText("");
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

  useEffect(() => {
    const queryBaseType = searchParams.get("baseType");
    if (queryBaseType && queryBaseType !== baseType) {
      setBaseType(queryBaseType);
    } else if (!queryBaseType) {
      setBaseType("Applications");
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    setTotal(
      cartItems.reduce(
        (total: number, item: { quantity: number; price: number }) =>
          total + Number(item.price) * Number(item.quantity),
        0
      )
    );
    setItemCount(cartItems.length);
  }, [cartItems]);

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
              className="form-control-no-focus"
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
              {uniqueBasesTypes.map((type) => (
                <NavDropdown.Item
                  key={type}
                  onClick={() => handleBaseTypeChange(type)}
                >
                  {type}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          {user && user?.type !== "admin" && (
            <Nav>
              <Nav.Link
                className={styles.cartItems}
                onClick={() => setShow(true)}
              >
                Items: <Badge bg="secondary">{itemCount}</Badge> (USD {total})
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
      <CartOffCanvas setShow={setShow} show={show} items={cartItems}/>
    </>
  );
};

export default TopHead;
