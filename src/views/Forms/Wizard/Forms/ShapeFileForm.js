import React from "react";
import { Button, Row, Col, Form, FormGroup, FormLabel } from "react-bootstrap";
import { makeStyles, Tooltip } from "@material-ui/core";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import { useAuth } from "context/Auth";
import { useI18n } from "context/i18n";
import Cookies from "universal-cookie";
import { BACKEND_API } from "config";
const cookies = new Cookies();
const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  tooltip: {
    maxWidth: 500,
  },
}));

const ShapeFileForm = ({
  isPublic = true,
  downloadable = true,
  description = "",
  upload,
}) => {
  const classes = useStyles();
  const { info } = useAuth();
  const { i18n } = useI18n();
  const [file, setFile] = React.useState(null);
  const [keyPropertyName, setKeyPropertyName] = React.useState(null);

  const handleUploadClick = () => {
    if (description === "" || !file || !keyPropertyName) return;

    const yes = confirm(i18n.strings.upload.step2.upload.alert);
    if (!yes) return;

    var formData = new FormData();
    const fileName =
      file.name.indexOf(".") === -1
        ? file.name
        : file.name.substr(0, file.name.indexOf("."));
    const newName = info.displayName + "__" + fileName;
    console.log(newName)
    const newfile = renameFile(file, newName + '.zip');
    console.log(newfile)
    formData.append("fileName", newName);
    formData.append("shapefile", newfile);
    formData.append("keyPropertyName", keyPropertyName);
    formData.append("isPublic", isPublic);
    formData.append("isDownloadable", downloadable);
    formData.append("description", description);

    upload(() =>
      axios.post(`${BACKEND_API}/api/shp/file/create`, formData, {
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

  return (
    <div className="shape-file-attributes">
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
              accept="application/zip"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.keyProperty.title}{" "}
              <span className="text-danger">*</span>
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
              value={keyPropertyName ? keyPropertyName : ""}
              onChange={(e) => {
                setKeyPropertyName(e.target.value);
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

export default ShapeFileForm;
