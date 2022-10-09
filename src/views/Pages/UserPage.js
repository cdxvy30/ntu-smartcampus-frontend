import React from "react";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";

import { useAuth } from "../../context/Auth";
import { useI18n } from "../../context/i18n";
import { useAlert } from "context/Alert";

function UserPage() {
  const { changePassword } = useAuth();
  const { i18n } = useI18n();
  const { pop } = useAlert();

  const [oldPassword, setOldPassword] = React.useState("");
  const [oldPasswordState, setOldPasswordState] = React.useState(true);
  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordState, setNewPasswordState] = React.useState(true);
  const [newConfirmPassword, setNewConfirmPassword] = React.useState("");
  const [newConfirmPasswordState, setNewConfirmPasswordState] = React.useState(
    true
  );

  const equalTo = (value1, value2) => value1 === value2;
  const minLength = (value, length) => value.length >= length;

  return (
    <>
      <Container fluid>
        <div className="section-image" data-image="../../assets/img/bg5.jpg">
          {/* you can change the color of the filter page using: data-color="blue | purple | green | orange | red | rose " */}
          <Container>
            <Row>
              <Col md="12" sm="12">
                <Form action="" id="ChangePasswordValidation" method="">
                  <Card>
                    <Card.Header>
                      <Card.Title as="h4">
                        {i18n.strings.userSetting.title}
                      </Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group
                        className={
                          "has-label " +
                          (oldPasswordState ? "has-success" : "has-error")
                        }
                      >
                        <label>
                          {i18n.strings.userSetting.old}{" "}
                          <span className="star">*</span>
                        </label>
                        <Form.Control
                          id="oldPassword"
                          name="password"
                          type="password"
                          value={oldPassword}
                          onChange={(e) => {
                            setOldPassword(e.target.value);
                          }}
                        ></Form.Control>
                        {oldPassword ? null : (
                          <label className="error">
                            {i18n.strings.userSetting.requiredMessage}
                          </label>
                        )}
                      </Form.Group>
                      <Form.Group
                        className={
                          "has-label " +
                          (newPasswordState ? "has-success" : "has-error")
                        }
                      >
                        <label>
                          {i18n.strings.userSetting.new}{" "}
                          <span className="star">*</span>
                        </label>
                        <Form.Control
                          id="newPassword"
                          name="password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                          }}
                        ></Form.Control>
                        {newPassword ? null : (
                          <label className="error">
                            {i18n.strings.userSetting.requiredMessage}
                          </label>
                        )}
                      </Form.Group>
                      <Form.Group
                        className={
                          "has-label " +
                          (newConfirmPasswordState
                            ? "has-success"
                            : "has-error")
                        }
                      >
                        <label>
                          {i18n.strings.userSetting.confirm}{" "}
                          <span className="star">*</span>
                        </label>
                        <Form.Control
                          equalto="#newPassword"
                          id="newPasswordConfirmation"
                          name="password_confirmation"
                          type="password"
                          value={newConfirmPassword}
                          onChange={(e) => {
                            setNewConfirmPassword(e.target.value);
                          }}
                        ></Form.Control>
                        {newConfirmPasswordState ? null : (
                          <label className="error">
                            {i18n.strings.userSetting.confirmMessage}
                          </label>
                        )}
                      </Form.Group>
                      <div className="card-category form-category">
                        <span className="star">*</span>
                        {i18n.strings.userSetting.star}
                      </div>
                    </Card.Body>
                    <Card.Footer className="text-right">
                      <Button
                        className="btn-fill pull-right"
                        variant="info"
                        onClick={() => {
                          setOldPasswordState(oldPassword !== "");
                          setNewPasswordState(newPassword !== "");
                          setNewConfirmPasswordState(
                            newPassword === newConfirmPassword
                          );

                          if (
                            oldPassword !== "" &&
                            newPassword !== "" &&
                            newPassword === newConfirmPassword
                          ) {
                            changePassword(oldPassword, newPassword)
                              .then((response) => {
                                pop(i18n.strings.upload.alert.title, i18n.strings.userSetting.successMessage, true, "info");
                              })
                              .catch((response) => {
                                pop(
                                  i18n.strings.upload.alert.title,
                                  response.data,
                                  true,
                                  "danger"
                                );
                              });
                          }
                        }}
                      >
                        {i18n.strings.userSetting.button}
                      </Button>
                      <div className="clearfix"></div>
                    </Card.Footer>
                  </Card>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
    </>
  );
}

export default UserPage;
