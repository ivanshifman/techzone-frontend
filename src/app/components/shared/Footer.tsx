import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-light text-center py-3 mt-4">
      <Container>
        <hr />
        <p className="mb-0 text-dark">
          &copy; {new Date().getFullYear()} TechZone. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
