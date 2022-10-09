import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import { useMemoizedValue } from "./use-memorized-value";
import { BACKEND_API } from "config";
import jwt_decode from "jwt-decode";

import useSWR from "swr";
const axios = require("axios").default;
const cookies = new Cookies();

const fetcher = (url) =>
  axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + cookies.get("sdgs_access_token"),
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data);

export const AuthContext = React.createContext({
  info: {},
  login: async () => {},
  changePassword: async () => {},
  logout: async () => {},
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = React.memo(({ children }) => {
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [info, setInfo] = React.useState({});

  React.useEffect(() => {
    if (cookies.get("sdgs_access_token")) {
      fetcher(`${BACKEND_API}/api/user/get`)
      .then((userData) => {
        cookies.set("sdgs_access_token", userData.access_token, { path: "/" });
        setInfo(userData.info);
        setIsAuthenticated(true);
        setLoading(false)
      })
      .catch(err => {
        cookies.remove("sdgs_access_token");
        setInfo({});
        setIsAuthenticated(false);
        setLoading(false)
      })
    }
    else {
      setInfo({});
      setIsAuthenticated(false);
      setLoading(false)
    }
  }, [])

  const login = (username, password) => {
    return axios
      .post(`${BACKEND_API}/api/user/login`, {
        username,
        password,
      })
      .then((response) => {
        cookies.set("sdgs_access_token", response.data.access_token, { path: "/" });
        setInfo(response.data.info);
        setIsAuthenticated(true);
      })
      .catch((err) => {
        console.log(err);
        setIsAuthenticated(false);
        throw err;
      });
  };

  const changePassword = (oldPassword, newPassword) => {
    const sdgs_access_token = cookies.get("sdgs_access_token");

    return axios
      .put(
        `${BACKEND_API}/api/user/changePassword`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: "Bearer " + sdgs_access_token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err.response;
      });
  };

  const logout = () => {
    cookies.remove("sdgs_access_token", { path: "/" });
    setInfo({});
    history.push("/auth/login-page");
    setIsAuthenticated(false);
  };

  const value = useMemoizedValue({
    loading,
    isAuthenticated,
    info,
    login,
    changePassword,
    logout,
  });
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
});
