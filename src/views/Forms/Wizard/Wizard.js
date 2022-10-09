import React from "react";
import { useHistory } from "react-router-dom";
// react component that creates a form divided into multiple steps
import ReactWizard from "react-bootstrap-wizard";
// react-bootstrap components
import { Container, Row, Col } from "react-bootstrap";

import Step1 from "./Step1.js";
import Step2 from "./Step2.js";

import { useI18n } from "../../../context/i18n";

function Wizard() {
  let history = useHistory();
  const { i18n } = useI18n();

  const steps = [
    { stepName: i18n.strings.upload.step1.tabTitle, component: Step1 },
    { stepName: i18n.strings.upload.step2.tabTitle, component: Step2 },
  ];

  return (
    <>
      <Container fluid>
        <Row>
          <Col className="ml-auto mr-auto" md="8">
            <ReactWizard
              steps={steps}
              navSteps
              title={i18n.strings.upload.step1.title}
              description={i18n.strings.upload.step1.subtitle}
              headerTextCenter
              validate
              color="blue"
              previousButtonText="Back"
              nextButtonText="Next"
              finishButtonClasses="btn-info btn-wd"
              nextButtonClasses="btn-info btn-wd"
              previousButtonClasses="btn-wd"
              finishButtonClick={() => {
                history.push("/admin/dashboard");
              }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Wizard;
