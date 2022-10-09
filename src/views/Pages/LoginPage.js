import React from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";

// react-bootstrap components
import { Button, Card, Form, Nav, Container, Col } from "react-bootstrap";

import { useAuth } from "../../context/Auth";
import { useI18n } from "../../context/i18n";

function LoginPage() {
  const { i18n } = useI18n();
  const { login } = useAuth();
  const history = useHistory();

  const [loginUsername, setLoginUsername] = React.useState(
    localStorage.getItem("username") || ""
  );
  const [loginUsernameState, setLoginUsernameState] = React.useState(true);
  const [loginPassword, setLoginPassword] = React.useState("");
  const [loginPasswordState, setLoginPasswordState] = React.useState(true);
  const [rememberMe, setRememberMe] = React.useState(
    localStorage.getItem("username") ? true : false
  );

  const [error, setError] = React.useState("");

  const [cardClasses, setCardClasses] = React.useState("card-hidden");
  React.useEffect(() => {
    setTimeout(function () {
      setCardClasses("");
    }, 1000);
  });

  const handleClick = (e) => {
    e.preventDefault();
    setError("");

    setLoginUsernameState(loginUsername !== "");
    setLoginPasswordState(loginPassword !== "");

    if (loginUsername !== "" && loginPassword !== "") {
      login(loginUsername, loginPassword)
        .then((response) => {
          if (rememberMe) {
            localStorage.setItem("username", loginUsername);
          } else {
            if (localStorage.getItem("username")) {
              localStorage.removeItem("username");
            }
          }

          console.log("success");
          history.push("/admin/dashboard");
        })
        .catch((e) => {
          setError(i18n.strings.login.error);
        });
    }
  };

  return (
    <>
      <div
        className="full-page section-image"
        data-color="black"
        data-image={require("assets/img/full-screen-image-2.jpg").default}
      >
        <div className="content d-flex align-items-center p-0">
          <Container>
            <Col className="mx-auto" lg="4" md="8">
              <Form action="" className="form" method="">
                <Card className={"card-login " + cardClasses}>
                  <Card.Header>
                    <h3 className="header text-center">
                      {i18n.strings.login.title}
                    </h3>
                  </Card.Header>
                  <Card.Body>
                    <Card.Body>
                      <Form.Group
                        className={
                          "has-label " +
                          (loginUsernameState ? "has-success" : "has-error")
                        }
                      >
                        <label>{i18n.strings.login.username}</label>
                        <Form.Control
                          placeholder={i18n.strings.login.usernamePlaceholder}
                          type="text"
                          value={loginUsername}
                          onChange={(e) => {
                            setLoginUsername(e.target.value);
                          }}
                        ></Form.Control>
                        {loginUsernameState ? null : (
                          <label className="error">
                            {i18n.strings.login.required}
                          </label>
                        )}
                      </Form.Group>
                      <Form.Group
                        className={
                          "has-label " +
                          (loginPasswordState ? "has-success" : "has-error")
                        }
                      >
                        <label>{i18n.strings.login.password}</label>
                        <Form.Control
                          placeholder={i18n.strings.login.passwordPlaceholder}
                          type="password"
                          value={loginPassword}
                          onChange={(e) => {
                            setLoginPassword(e.target.value);
                          }}
                        ></Form.Control>
                        {loginPasswordState ? null : (
                          <label className="error">
                            {i18n.strings.login.required}
                          </label>
                        )}
                      </Form.Group>
                      <Form.Check className="pl-0">
                        <Form.Check.Label>
                          <Form.Check.Input
                            checked={rememberMe}
                            type="checkbox"
                            onChange={(e) => setRememberMe(!rememberMe)}
                          ></Form.Check.Input>
                          <span className="form-check-sign"></span>
                          {i18n.strings.login.rememberMe}
                        </Form.Check.Label>
                      </Form.Check>
                    </Card.Body>
                  </Card.Body>
                  <Card.Footer className="ml-auto mr-auto">
                    <label className="error">{error}</label>
                    <br />
                    <Button
                      className="btn-wd"
                      type="submit"
                      variant="warning"
                      onClick={handleClick}
                    >
                      {i18n.strings.login.button}
                    </Button>
                  </Card.Footer>
                </Card>
              </Form>
            </Col>
          </Container>
        </div>
        <div
          className="full-page-background"
          style={{
            backgroundImage:
              "url(" +
              require("assets/img/full-screen-image-2.jpg").default +
              ")",
          }}
        ></div>
      </div>
    </>
  );
}

export default LoginPage;
