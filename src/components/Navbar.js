import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from './logo.png';

const AppNavbar = () => {
  return (
    <Navbar bg="light" variant="light" expand="lg" collapseOnSelect>
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <img
            src={logo}
            width="100"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>

        {/* Text */}
        <Navbar.Text className="mx-auto fs-3 fw-bold text-dark text-center">
          AdvertiseAI App
        </Navbar.Text>

        {/* Links */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/google-ads">
              Google Ads
            </Nav.Link>
            <Nav.Link as={Link} to="/seo">SEO</Nav.Link>
            <Nav.Link as={Link} to="/social-ads">
              Social Ads
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

