import React from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// react-bootstrap components
import {
  Collapse,
  Nav,
} from "react-bootstrap";

import { useAuth } from "../../context/Auth";
import { useI18n } from "../../context/i18n";

function Sidebar({ routes, image, background }) {
  const { info } = useAuth();
  const { lang } = useI18n();

  // to check for active links and opened collapses
  let location = useLocation();
  // this is for the user collapse
  const [userCollapseState, setUserCollapseState] = React.useState(false);
  // this is for the rest of the collapses
  const [state, setState] = React.useState({});
  React.useEffect(() => {
    setState(getCollapseStates(routes));
  }, []);
  // this creates the intial state of this component based on the collapse routes
  // that it gets through routes prop
  const getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: getCollapseInitialState(prop.views),
          ...getCollapseStates(prop.views),
          ...initialState,
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.jsx - route /admin/regular-forms
  const getCollapseInitialState = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (location.pathname === routes[i].layout + routes[i].path) {
        return true;
      }
    }
    return false;
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <Nav.Item
            className={getCollapseInitialState(prop.views) ? "active" : ""}
            as="li"
            key={key}
          >
            <Nav.Link
              className={state[prop.state] ? "collapsed" : ""}
              data-toggle="collapse"
              onClick={(e) => {
                e.preventDefault();
                setState({ ...state, ...st });
              }}
              aria-expanded={state[prop.state]}
            >
              <i className={prop.icon}></i>
              {prop.name === "User" ? (
                <p>
                  {info.displayName}<b className="caret"></b>
                </p>
              ) : (
                <p>
                  {lang === "en" ? prop.name : prop.zhName}
                  <b className="caret"></b>
                </p>
              )}
            </Nav.Link>
            <Collapse in={state[prop.state]}>
              <div>
                <Nav as="ul">{createLinks(prop.views)}</Nav>
              </div>
            </Collapse>
          </Nav.Item>
        );
      }

      if (prop.adminOnly && info.role !== "admin") {
        return null;
      }

      return (
        <Nav.Item
          className={activeRoute(prop.layout + prop.path)}
          key={key}
          as="li"
        >
          <Nav.Link to={prop.layout + prop.path} as={Link}>
            {prop.icon ? (
              <>
                <i className={prop.icon} />
                <p>{lang === "en" ? prop.name : prop.zhName}</p>
              </>
            ) : (
              <>
                <span className="sidebar-mini">{prop.mini}</span>
                <span className="sidebar-normal">
                  {lang === "en" ? prop.name : prop.zhName}
                </span>
              </>
            )}
          </Nav.Link>
        </Nav.Item>
      );
    });
  };
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  return (
    <>
      <div className="sidebar" data-color={background} data-image={image}>
        <div className="sidebar-wrapper">
          <div className="logo">
            <a className="simple-text logo-normal">SDGs CAMPUS</a>
          </div>
          <Nav as="ul">{createLinks(routes)}</Nav>
        </div>
        <div
          className="sidebar-background"
          style={{
            backgroundImage: "url('" + image + "')",
          }}
        ></div>
      </div>
    </>
  );
}

let linkPropTypes = {
  path: PropTypes.string,
  layout: PropTypes.string,
  name: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};

Sidebar.defaultProps = {
  image: "",
  background: "black",
  routes: [],
};

Sidebar.propTypes = {
  image: PropTypes.string,
  background: PropTypes.oneOf([
    "black",
    "azure",
    "green",
    "orange",
    "red",
    "purple",
  ]),
  routes: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        ...linkPropTypes,
        icon: PropTypes.string,
      }),
      PropTypes.shape({
        collapse: true,
        path: PropTypes.string,
        name: PropTypes.string,
        state: PropTypes.string,
        icon: PropTypes.string,
        views: PropTypes.shape({
          ...linkPropTypes,
          mini: PropTypes.string,
        }),
      }),
    ])
  ),
};

export default Sidebar;
