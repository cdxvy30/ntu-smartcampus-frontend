import React from "react";
import { Button, Row, Col, Form, FormGroup, FormLabel } from "react-bootstrap";
import { makeStyles, Tooltip } from "@material-ui/core";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import Select from "react-select";
import { useI18n } from "context/i18n";
import { useAuth } from "context/Auth";

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

const useStyles = makeStyles((theme) => ({
  tooltip: {
    maxWidth: 500,
  },
}));

const ShapeCommonFileForm = ({
  isPublic = true,
  downloadable = true,
  description = "",
  upload,
}) => {
  const classes = useStyles();
  const { i18n } = useI18n();
  const { info } = useAuth();

  const handleUploadClick = () => {
    if (description === "" || !file || !keyPropertyValue || !bindingShpName)
      return;

    const yes = confirm(i18n.strings.upload.step2.upload.alert);
    if (!yes) return;

    var formData = new FormData();
    const fileName = file.name;
    const newName = info.displayName + "__" + fileName;
    const newfile = renameFile(file, newName);
    formData.append("fileName", newName);
    formData.append("commonfile", newfile);
    formData.append("keyPropertyValue", keyPropertyValue);
    formData.append("bindingShpName", bindingShpName.label);
    formData.append("isPublic", isPublic);
    formData.append("isDownloadable", downloadable);
    formData.append("description", description);

    upload(() =>
      axios.post(`${BACKEND_API}/api/shp/common/create`, formData, {
        headers: {
          Authorization: "Bearer " + cookies.get("sdgs_access_token"),
          "Content-Type": "multipart/form-data",
        },
      })
    );
  };

  function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  }

  const [file, setFile] = React.useState(null);
  const [keyPropertyValue, setKeyPropertyValue] = React.useState(null);
  const [bindingShpName, setBindingShpName] = React.useState(null);
  const { data: bindingShpNameOptions, error: bindingShpNameOptionsError } =
    useSWR(`${BACKEND_API}/api/shp/file/list`, fetcher, {
      refreshInterval: 600000,
    });
  const [bindingkeyPropertyName, setBindingPropertyName] = React.useState("");
  React.useEffect(() => {
    if (bindingShpNameOptions && bindingShpNameOptions.length > 0) {
      setBindingShpName({
        value: bindingShpNameOptions[0].id,
        label: bindingShpNameOptions[0].name,
      });
      setBindingPropertyName(bindingShpNameOptions[0].keyPropertyName);
    }
  }, bindingShpNameOptions);

  if (!bindingShpNameOptions || bindingShpNameOptionsError) {
    return <></>;
  }

  return (
    <div className="shape-common-data-attributes">
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.file.title}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            <Form.File
              name="bootstrapSelect"
              onChange={(event) => {
                setFile(event.target.files[0]);
              }}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.bindingShpName.title}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            <Select
              name="bindingShpNameSelect"
              value={bindingShpName}
              options={bindingShpNameOptions.map((b) => ({
                value: b.id,
                label: b.name,
              }))}
              placeholder={i18n.strings.upload.step2.bindingShpName.placeholder}
              onChange={(value) => {
                setBindingShpName(value);
                setBindingPropertyName(
                  bindingShpNameOptions.find((elem) => elem.id === value.value)
                    .keyPropertyName
                );
              }}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel style={{ textTransform: "inherit" }}>
              {bindingkeyPropertyName} <span className="text-danger">*</span>
              <Tooltip
                className={classes.classes}
                title={i18n.strings.upload.step2.keyProperty.tooltip}
              >
                <ContactSupportIcon />
              </Tooltip>
            </FormLabel>
            <Form.Control
              placeholder={i18n.strings.upload.step2.keyProperty.title}
              type="text"
              value={keyPropertyValue ? keyPropertyValue : ""}
              onChange={(e) => {
                setKeyPropertyValue(e.target.value);
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

export default ShapeCommonFileForm;
