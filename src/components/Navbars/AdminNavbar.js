import React from "react";

// react-bootstrap components
import {
  Button,
  Dropdown,
  Navbar,
  Nav,
  Container,
} from "react-bootstrap";

import { useAuth } from "../../context/Auth";
import { useI18n } from "../../context/i18n";

function AdminNavbar() {
  const { logout } = useAuth();
  const { i18n, setLanguage } = useI18n();

  const [collapseOpen, setCollapseOpen] = React.useState(false);
  return (
    <>
      <Navbar expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-minimize">
              <Button
                className="btn-fill btn-round btn-icon d-block d-lg-block bg-dark border-dark"
                variant="dark"
                onClick={() =>
                  document.documentElement.classList.toggle("nav-open")
                }
              >
                <i className="fas fa-ellipsis-v visible-on-sidebar-regular"></i>
                <i className="fas fa-bars visible-on-sidebar-mini"></i>
              </Button>
            </div>
            <Navbar.Brand href="#pablo" onClick={(e) => e.preventDefault()}>
              SDGs CAMPUS
            </Navbar.Brand>
          </div>
          <Navbar.Collapse className="justify-content-end" in={true}>
            <Nav navbar>
              <Dropdown as={Nav.Item}>
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
              <Nav.Item
              >
                <Nav.Link onClick={logout}>
                  <i className="nc-icon nc-mobile"></i>
                  {i18n.strings.navbar.logout}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
