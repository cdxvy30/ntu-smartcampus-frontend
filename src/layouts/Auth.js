import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

// dinamically create auth routes
import routes from "routes.js";

import { useAuth } from "../context/Auth";

function Auth() {
  const history = useHistory();
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <></>;

  if (!loading && isAuthenticated) {
    history.push("/admin/dashboard");
    return <></>
  }

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
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
      <div className="wrapper wrapper-full-page">
        {/* Navbar */}
        <AuthNavbar />
        {/* End Navbar */}
        <Switch>{getRoutes(routes)}</Switch>
        <AuthFooter />
      </div>
    </>
  );
}

export default Auth;
