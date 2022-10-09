import React from "react";
import { useHistory } from "react-router-dom";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Media,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import ImageUpload from "components/CustomUpload/ImageUpload.js";

import { useI18n } from "context/i18n";
import { BACKEND_API } from "config";

const axios = require("axios").default;

function RegisterPage() {
  const { i18n } = useI18n();
  const history = useHistory();

  const [firstName, setFirstName] = React.useState("");
  const [firstNameState, setFirstNameState] = React.useState(true);
  const [lastName, setLastName] = React.useState("");
  const [lastNameState, setLastNameState] = React.useState(true);
  const [department, setDepartment] = React.useState("");
  const [departmentState, setDepartmentState] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [usernameState, setUsernameState] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [emailState, setEmailState] = React.useState(true);
  const [staffCardImage, setStaffCardImage] = React.useState(null);
  const [staffCardImageState, setStaffCardImageState] = React.useState(true);
  // const [password, setPassword] = React.useState("");
  // const [passwordState, setPasswordState] = React.useState(true);
  // const [passwordConfirm, setPasswordConfirm] = React.useState("");
  // const [passwordConfirmState, setPasswordConfirmState] = React.useState(true);

  const [message, setMessage] = React.useState("");

  const handleClick = (e) => {
    e.preventDefault();
    setMessage("");

    setFirstNameState(firstName !== "");
    setLastNameState(lastName !== "");
    setDepartmentState(department !== "");
    setUsernameState(username !== "");
    setEmailState(email !== "");
    setStaffCardImageState(staffCardImage !== null)

    if (
      firstName !== "" &&
      lastName !== "" &&
      department !== "" &&
      username !== "" &&
      email !== "" &&
      staffCardImage !== null
    ) {
      axios
        .post(`${BACKEND_API}/api/user/register`, {
          username,
          email,
          displayName: `${firstName + " " + lastName}`,
          department,
          role: "user",
          staffCardImage: staffCardImage.result
        })
        .then((response) => {
          console.log(response);
          setMessage(i18n.strings.register.success);
        })
        .catch((error) => {
          setMessage(error.response.data);
        });
    }
  };

  return (
    <>
      <div
        className="full-page register-page section-image"
        data-image={require("assets/img/bg5.jpg").default}
      >
        <div className="content d-flex align-items-center">
          <Container>
            <Card className="card-register card-plain text-center">
              <Card.Header>
                <Row className="justify-content-center">
                  <Col md="8">
                    <div className="header-text">
                      <Card.Title as="h2">SDGs CAMPUS</Card.Title>
                      <Card.Subtitle as="h4">
                        {i18n.strings.register.subtitle}
                      </Card.Subtitle>
                      <hr></hr>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col className="ml-auto" md="7" lg="5">
                    <Media>
                      <div className="media-left">
                        <div className="icon">
                          <i className="nc-icon nc-circle-09"></i>
                        </div>
                      </div>
                      <Media.Body>
                        <h4>{i18n.strings.register.section1.title}</h4>
                        <p>{i18n.strings.register.section1.description}</p>
                      </Media.Body>
                    </Media>
                  </Col>
                  <Col className="mr-auto" md="5" lg="4">
                    <Form action="#" method="#">
                      <Card className="card-plain">
                        <div className="card-body">
                          <Form.Group
                            className={
                              "has-label " +
                              (firstNameState ? "has-success" : "has-error")
                            }
                          >
                            <Form.Control
                              placeholder={
                                i18n.strings.register.placeholders.firstName
                              }
                              type="text"
                              onChange={(e) => {
                                setFirstName(e.target.value);
                              }}
                            ></Form.Control>
                            {firstNameState ? null : (
                              <label className="error">
                                {i18n.strings.register.required}
                              </label>
                            )}
                          </Form.Group>
                          <Form.Group
                            className={
                              "has-label " +
                              (lastNameState ? "has-success" : "has-error")
                            }
                          >
                            <Form.Control
                              placeholder={
                                i18n.strings.register.placeholders.lastName
                              }
                              type="text"
                              onChange={(e) => {
                                setLastName(e.target.value);
                              }}
                            ></Form.Control>
                            {lastName ? null : (
                              <label className="error">
                                {i18n.strings.register.required}
                              </label>
                            )}
                          </Form.Group>
                          <Form.Group
                            className={
                              "has-label " +
                              (departmentState ? "has-success" : "has-error")
                            }
                          >
                            <Form.Control
                              placeholder={
                                i18n.strings.register.placeholders.department
                              }
                              type="text"
                              onChange={(e) => {
                                setDepartment(e.target.value);
                              }}
                            ></Form.Control>
                            {departmentState ? null : (
                              <label className="error">
                                {i18n.strings.register.required}
                              </label>
                            )}
                          </Form.Group>
                          <Form.Group
                            className={
                              "has-label " +
                              (usernameState ? "has-success" : "has-error")
                            }
                          >
                            <Form.Control
                              placeholder={
                                i18n.strings.register.placeholders.username
                              }
                              type="text"
                              onChange={(e) => {
                                setUsername(e.target.value);
                              }}
                            ></Form.Control>
                            {usernameState ? null : (
                              <label className="error">
                                {i18n.strings.register.required}
                              </label>
                            )}
                          </Form.Group>
                          <Form.Group
                            className={
                              "has-label " +
                              (emailState ? "has-success" : "has-error")
                            }
                          >
                            <Form.Control
                              placeholder={
                                i18n.strings.register.placeholders.email
                              }
                              type="email"
                              onChange={(e) => {
                                setEmail(e.target.value);
                              }}
                            ></Form.Control>
                            {emailState ? null : (
                              <label className="error">
                                {i18n.strings.register.required}
                              </label>
                            )}
                          </Form.Group>
                          <Form.Group
                            className={
                              "has-label " +
                              (staffCardImageState ? "has-success" : "has-error")
                            }
                          >
                            <Card.Title tag="h4">
                              {i18n.strings.register.image.title}
                            </Card.Title>
                            <ImageUpload
                              addBtnColor="default"
                              changeBtnColor="default"
                              onChange={setStaffCardImage}
                            />
                            {staffCardImageState ? null : (
                              <label className="error">
                                {i18n.strings.register.required}
                              </label>
                            )}
                          </Form.Group>
                        </div>
                        <div className="card-footer text-center">
                          <label className="error">{message}</label>
                          <br />
                          <Button
                            className="btn-fill btn-neutral btn-wd"
                            type="submit"
                            variant="default"
                            onClick={handleClick}
                          >
                            {i18n.strings.register.button}
                          </Button>
                        </div>
                      </Card>
                    </Form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Container>
        </div>
        <div
          className="full-page-background"
          style={{
            backgroundImage:
              "url(" + require("assets/img/bg11.jpg").default + ")",
          }}
        ></div>
      </div>
    </>
  );
}

export default RegisterPage;
