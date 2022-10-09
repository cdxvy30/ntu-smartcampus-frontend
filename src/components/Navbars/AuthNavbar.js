import React from "react";
import { Link, useLocation } from "react-router-dom";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Navbar,
  Nav,
  Container,
  Col,
} from "react-bootstrap";

import { useI18n } from "../../context/i18n";

function AuthNavbar() {
  const { i18n, setLanguage } = useI18n();

  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const location = useLocation();
  return (
    <>
      <Navbar
        className="position-absolute w-100"
        expand="lg"
        variant={collapseOpen ? "white" : "transparent"}
      >
        <Container>
          <div className="navbar-wrapper">
            <Navbar.Brand href="#pablo" onClick={(e) => e.preventDefault()}>
              <span className="d-none d-md-block">
                SDGs CAMPUS
              </span>
              <span className="d-block d-md-none">SCAP</span>
            </Navbar.Brand>
          </div>
          <button
            className="navbar-toggler navbar-toggler-right border-0"
            type="button"
            onClick={() => setCollapseOpen(!collapseOpen)}
          >
            <span className="navbar-toggler-bar burger-lines"></span>
            <span className="navbar-toggler-bar burger-lines"></span>
            <span className="navbar-toggler-bar burger-lines"></span>
          </button>
          <Navbar.Collapse className="justify-content-end" in={collapseOpen}>
            <Nav navbar>
              <Nav.Item
                className={
                  location.pathname === "/auth/register-page"
                    ? "active mr-1"
                    : "mr-1"
                }
              >
                <Nav.Link to="/auth/register-page" as={Link}>
                  <i className="nc-icon nc-badge"></i>
                  {i18n.strings.navbar.register}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item
                className={
                  location.pathname === "/auth/login-page"
                    ? "active mr-1"
                    : "mr-1"
                }
              >
                <Nav.Link to="/auth/login-page" as={Link}>
                  <i className="nc-icon nc-mobile"></i>
                  {i18n.strings.navbar.login}
                </Nav.Link>
              </Nav.Item>
              <Dropdown as={Nav.Item} className="mr-1">
                <Dropdown.Toggle
                  as={Nav.Link}
                  id="dropdown-165516306"
                  variant="default"
                >
                  <i className="nc-icon nc-planet"></i>
                  {i18n.strings.navbar.lang}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      setLanguage("zh-TW");
                    }}
                  >
                    中文
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      setLanguage("en");
                    }}
                  >
                    English
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AuthNavbar;
