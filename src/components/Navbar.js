import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../images/logo2.png";

const AppNavbar = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark" collapseOnSelect>
      {/* <Navbar bg="dark" variant="dark" collapseOnSelect> */}
      <Container >
        {/* <Row> */}
        <Col md="auto">
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-2">
            <img
              src={logo}
              width="40"
              height="40"
              className="d-inline-block align-top"
              alt="Logo"
            />
            Prismoon
          </Navbar.Brand>
        </Col>
        {/* Text */}
        <Col md="auto">
          <Navbar.Text className="fs-2 fw-bold text-light text-center">
            AdvertiseAI App
          </Navbar.Text>
        </Col>
        {/* Links */}
        <Col md="auto">
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav" className="justify-content-end">
            <Nav variant="pills" className="fs-5 fw-bold">
              <Nav.Link as={Link} to="/google-ads">
                Google Ads
              </Nav.Link>
              <Nav.Link as={Link} to="/social-ads">
                Social Ads
              </Nav.Link>
              {/* <Nav.Link as={Link} to="/seo">
                SEO
              </Nav.Link> */}
            </Nav>
            {/* <Nav fill variant="tabs" defaultActiveKey="/google-ads">
              <Nav.Item>
                <Nav.Link as={Link} to="/google-ads">
                  Google Ads
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/seo">
                  SEO
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/social-ads">
                  Social Ads
                </Nav.Link>
              </Nav.Item>
            </Nav> */}
          </Navbar.Collapse>
        </Col>
        {/* </Row> */}
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
