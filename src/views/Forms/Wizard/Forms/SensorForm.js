import React from "react";
import { Button, Row, Col, Form, FormGroup, FormLabel } from "react-bootstrap";
import { useI18n } from "context/i18n";

import Cookies from "universal-cookie";
import { BACKEND_API } from "config";
const cookies = new Cookies();
const axios = require("axios").default;

const SensorForm = ({ isPublic = true, description = "", upload }) => {
  const { i18n } = useI18n();

  const handleUploadClick = () => {
    if (description === "" || sensorProjectName === "") return;

    const yes = confirm(i18n.strings.upload.step2.upload.alert);
    if (!yes) return;

    var formData = new FormData();
    formData.append("sensorProjectName", sensorProjectName);
    formData.append("isPublic", isPublic);
    formData.append("description", description);

    upload(() =>
      axios.post(`${BACKEND_API}/api/sensor/project/create`, formData, {
        headers: {
          Authorization: "Bearer " + cookies.get("sdgs_access_token"),
          "Content-Type": "multipart/form-data",
        },
      })
    );
  };

  // attributes
  const [sensorProjectName, setSensorProjectName] = React.useState(null);

  return (
    <div className="sensor-attributes">
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.sensor.name}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            <Form.Control
              type="text"
              value={sensorProjectName ? sensorProjectName : ""}
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></Form.Control>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col
          md={{ span: 10, offset: 1 }}
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            className="btn-wd"
            variant="primary"
            onClick={handleUploadClick}
          >
            {i18n.strings.upload.step2.upload.button}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SensorForm;
