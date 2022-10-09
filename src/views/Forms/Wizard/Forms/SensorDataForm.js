import React from "react";
import { Button, Row, Col, Form, FormGroup, FormLabel } from "react-bootstrap";
import { useI18n } from "context/i18n";
import Select from "react-select";

import JSONInput from "react-json-editor-ajrm/index";
import locale from "react-json-editor-ajrm/locale/en";

import Cookies from "universal-cookie";
import useSWR from "swr";
import { BACKEND_API } from "config";
const cookies = new Cookies();
const axios = require("axios").default;

const fetcher = (url) =>
  axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + cookies.get("sdgs_access_token"),
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data);

const SensorDataForm = ({ isPublic = true, description = "", upload }) => {
  const { i18n } = useI18n();

  const handleUploadClick = () => {
    if (
      description === "" ||
      sensorName === "" ||
      url === "" ||
      query === "" ||
      body === "" ||
      response === "" ||
      date.in === "" ||
      date.name === "" ||
      date.format === ""
    )
      return;

    if (date.in !== "pathVariables") {
      if (query === "null" || body === "null") return;
    }

    const yes = confirm(i18n.strings.upload.step2.upload.alert);
    if (!yes) return;

    var formData = new FormData();
    formData.append("bindingSensorProject", bindingSensorProject)
    formData.append("sensorName", sensorName);
    formData.append("url", url);
    formData.append("query", query === "null" ? query : JSON.stringify(query));
    formData.append("body", body === "null" ? body : JSON.stringify(body));
    formData.append("X", X);
    formData.append("Y", Y);
    formData.append("response", response);
    formData.append("date", JSON.stringify(date));
    formData.append("contentType", "application/json");
    formData.append("isPublic", isPublic);
    formData.append("description", description);

    upload(() =>
      axios.post(
        `${BACKEND_API}/api/sensor/instance/create`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + cookies.get("sdgs_access_token"),
            "Content-Type": "multipart/form-data",
          },
        }
      )
    );
  };

  // attributes
  const [bindingSensorProject, setBindingSensorProject] = React.useState(null);
  const { data: bindingSensorProjectOptions, error: bindingSensorProjectOptionsError } = useSWR(
    `${BACKEND_API}/api/sensor/project/list`,
    fetcher,
    { refreshInterval: 600000 }
  );
  React.useEffect(() => {
    if (bindingSensorProjectOptions && bindingSensorProjectOptions.length > 0) {
      setBindingSensorProject({
        value: bindingSensorProjectOptions[0].id,
        label: bindingSensorProjectOptions[0].name,
      });
    }
  }, bindingSensorProjectOptions);
  const [sensorName, setSensorName] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [urlError, setUrlError] = React.useState(null);
  const [X, setX] = React.useState(0);
  const [Y, setY] = React.useState(0);
  const [query, setQuery] = React.useState("null");
  const [body, setBody] = React.useState("null");
  const [response, setResponse] = React.useState("");

  const [dateIn, setDateIn] = React.useState({
    value: "query",
    label: "query",
  });
  React.useEffect(() => {
    setDate((prev) => {
      return {
        ...prev,
        in: dateIn.value,
      };
    });
  }, [dateIn]);

  const [date, setDate] = React.useState({
    in: "",
    name: "",
    format: "YYYY-MM-DD",
  });
  React.useEffect(() => {
    try {
      const _url = new URL(url);
      setUrlError(null);

      const sub = url.split(_url.origin)[1];
      if (sub.split(":").length === 2) {
        setDate({
          in: "pathVariables",
          name: sub.split(":")[1].split("/")[0],
          format: "YYYY-MM-DD",
        });
      } else {
        if (date.in === "pathVariables") {
          setDate({
            in: "",
            name: "",
            format: "YYYY-MM-DD",
          });
        }
      }
    } catch (err) {
      setUrlError("invalid url");
      if (date.in === "pathVariables") {
        setDate({
          in: "",
          name: "",
          format: "YYYY-MM-DD",
        });
      }
    }
  }, [url]);

  if (!bindingSensorProjectOptions || bindingSensorProjectOptionsError) {
    return <></>;
  }

  return (
    <div className="sensor-attributes">
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.sensor.name}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            <Select
              name="bindingSensorProject"
              value={bindingSensorProject}
              options={bindingSensorProjectOptions.map((s) => ({
                value: s.id,
                label: s.name,
              }))}
              onChange={setBindingSensorProject}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.sensor.data.name}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => {
                setSensorName(e.target.value);
              }}
            ></Form.Control>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              URL <span className="text-danger">*</span>
            </FormLabel>
            <Form.Control
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            ></Form.Control>
            {urlError}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.sensor.data.date}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            {date.in !== "pathVariables" ? (
              <>
                <Select
                  name="typeSelect"
                  value={dateIn}
                  options={[
                    {
                      value: "query",
                      label: "query",
                    },
                    {
                      value: "body",
                      label: "Body",
                    },
                  ]}
                  onChange={setDateIn}
                />
                <>
                  <span className="text-danger">*</span>{" "}
                  {i18n.strings.upload.step2.sensor.data.hint}{" "}
                  <span className="text-danger">*</span>
                </>
                <br />
                {/* <FormLabel>
                  Name <span className="text-danger">*</span>
                </FormLabel>
                <Form.Control
                  type="text"
                  value={date.name}
                  onChange={(e) => {
                    setDate((prev) => {
                      return {
                        ...prev,
                        name: e.target.value,
                      };
                    });
                  }}
                ></Form.Control> */}
              </>
            ) : (
              <div>Path Variables</div>
            )}
            <FormLabel>
              Date Format <span className="text-danger">*</span>
            </FormLabel>
            <Form.Control
              type="text"
              value={date.format}
              onChange={(e) => {
                setDate((prev) => {
                  return {
                    ...prev,
                    format: e.target.value,
                  };
                });
              }}
            ></Form.Control>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.sensor.data.query}{" "}
              {date.in !== "pathVariables" && (
                <span className="text-danger">*</span>
              )}
            </FormLabel>
            <div>
              <JSONInput
                theme="light_mitsuketa_tribute"
                locale={locale}
                colors={{
                  string: "#DAA520",
                  background: "#000000",
                }}
                height="200px"
                width="100%"
                onChange={(value) => {
                  if (!value.error) {
                    if (!value.jsObject) {
                      setQuery("null");
                    } else {
                      setQuery(JSON.stringify(value.jsObject));
                    }
                  }
                }}
              />
            </div>
          </FormGroup>
        </Col>
      </Row>
      {/* <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.sensor.data.contentType}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            <Select
                name="typeSelect"
                value={contentType}
                options={[
                  {
                    value: "application/json",
                    label: "application/json",
                  },
                  {
                    value: "application/x-www-form-urlencoded",
                    label: "application/x-www-form-urlencoded",
                  },
                ]}
                onChange={(value) => {
                  setContentType(value);
                  onFormChange(prevForm => {
                    return {
                      ...prevForm,
                      contentType: value.value
                    }
                  })
                }}
              />
          </FormGroup>
        </Col>
      </Row> */}
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.sensor.data.body}{" "}
              {date.in !== "pathVariables" && (
                <span className="text-danger">*</span>
              )}{" "}
            </FormLabel>
            <div>
              <JSONInput
                theme="light_mitsuketa_tribute"
                locale={locale}
                colors={{
                  string: "#DAA520",
                  background: "#000000",
                }}
                height="200px"
                width="100%"
                onChange={(value) => {
                  if (!value.error) {
                    if (!value.jsObject) {
                      setBody("null");
                    } else {
                      setBody(JSON.stringify(value.jsObject));
                    }
                  }
                }}
              />
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              X <span className="text-danger">*</span>
            </FormLabel>
            <Form.Control
              type="number"
              value={X}
              onChange={(e) => {
                setX(Number(e.target.value));
              }}
            ></Form.Control>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              Y <span className="text-danger">*</span>
            </FormLabel>
            <Form.Control
              type="number"
              value={Y}
              onChange={(e) => {
                setY(Number(e.target.value));
              }}
            ></Form.Control>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.sensor.data.response}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            <br />
            <span>
              Separate key or array index with "." e.g. readings.0.data
            </span>
            <Form.Control
              type="text"
              value={response}
              onChange={(e) => {
                setResponse(e.target.value);
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

export default SensorDataForm;
