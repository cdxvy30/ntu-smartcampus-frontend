import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

// core components
import Sidebar from "components/Sidebar/Sidebar.js";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";

// dinamically create dashboard routes
import routes from "routes.js";

import image3 from "assets/img/full-screen-image-3.jpg";

import { useAuth } from "../context/Auth";

function Admin() {
  const { loading, isAuthenticated, info } = useAuth();
  const history = useHistory();

  if (loading) return <></>;

  if (!loading && !isAuthenticated) {
    history.push("/auth/login-page");
    return <></>
  }

  const [sidebarImage, setSidebarImage] = React.useState(image3);
  const [sidebarBackground, setSidebarBackground] = React.useState("black");
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        if (prop.path === "/applicants" && info.role !== "admin") {
          return null;
        }

        return (
          <Route
            path={prop.layout + prop.path}
            key={key}
            component={prop.component}
          />
        );
      } else {
        return null;
      }
    });
  };
  return (
    <>
      <div className="wrapper">
        <AdminNavbar />
        <Sidebar
          routes={routes}
          image={sidebarImage}
          background={sidebarBackground}
        />
        <div className="main-panel">
          <div className="content">
            <Switch>{getRoutes(routes)}</Switch>
          </div>
          <AdminFooter />
          <div
            className="close-layer"
            onClick={() =>
              document.documentElement.classList.toggle("nav-open")
            }
          />
        </div>
      </div>
    </>
  );
}

export default Admin;
