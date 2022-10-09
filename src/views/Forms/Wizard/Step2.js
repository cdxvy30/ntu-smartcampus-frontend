import React from "react";
import { Row, Col, Form, FormGroup, FormLabel } from "react-bootstrap";
import Select from "react-select";
import { useAuth } from "context/Auth";
import { useI18n } from "context/i18n";
import { useAlert } from "context/Alert";

import PointDataForm from "./Forms/PointDataForm";
import ShapeDataForm from "./Forms/ShapeDataForm";
import ShapeCommonFileForm from "./Forms/ShapeCommonFileForm";
import ShapeFileForm from "./Forms/ShapeFileForm";
import SensorForm from "./Forms/SensorForm";
import SensorDataForm from "./Forms/SensorDataForm";

const Step2 = React.forwardRef((props, ref) => {
  const { info } = useAuth();
  const { i18n } = useI18n();
  const { pop } = useAlert();

  const upload = (uploader) => {
    pop(
      i18n.strings.upload.alert.title,
      i18n.strings.upload.alert.upload.title,
      false
    );

    uploader()
      .then((response) => {
        console.log(response);
        pop(i18n.strings.upload.alert.title, response.data, true, "info");
      })
      .catch((error) => {
        pop(
          i18n.strings.upload.alert.title,
          i18n.strings.upload.alert.failed,
          true,
          "danger"
        );
      });
  };

  // Select Options
  const fileTypeSelectOptions =
    info.role === "admin"
      ? [
          {
            value: "shp/file",
            label: i18n.strings.upload.step2.fileType.shapeFile,
            accept: ".zip",
          },
          {
            value: "shp/data",
            label: i18n.strings.upload.step2.fileType.shapeDataFile,
            accept: ".xlsx",
          },
          {
            value: "shp/common",
            label: i18n.strings.upload.step2.fileType.commonFile,
          },
          {
            value: "point/data",
            label: i18n.strings.upload.step2.fileType.pointFile,
            accept: ".xlsx",
          },
          {
            value: "sensor/project",
            label: "Sensor Project",
          },
          {
            value: "sensor/instance",
            label: "Sensor",
          },
        ]
      : [
          {
            value: "shp/file",
            label: i18n.strings.upload.step2.fileType.shapeFile,
            accept: ".zip",
          },
          {
            value: "shp/data",
            label: i18n.strings.upload.step2.fileType.shapeDataFile,
            accept: ".xlsx",
          },
          {
            value: "shp/common",
            label: i18n.strings.upload.step2.fileType.commonFile,
          },
          {
            value: "point/data",
            label: i18n.strings.upload.step2.fileType.pointFile,
            accept: ".xlsx",
          },
        ];
  const ppOptions = [
    {
      value: true,
      label: "Public",
    },
    {
      value: false,
      label: "Private",
    },
  ];

  // general
  const [fileTypeSelect, setFileTypeSelect] = React.useState(
    fileTypeSelectOptions[0]
  );
  const [pp, setPP] = React.useState(ppOptions[0]);
  const [downloadable, setDownloadable] = React.useState({
    value: true,
    label: i18n.strings.upload.step2.isDownloadable.downloadable,
  });
  const [description, setDescription] = React.useState("");

  const isValidated = () => {
    return true;
  };

  React.useImperativeHandle(ref, () => ({
    isValidated: () => {
      return isValidated();
    },
    state: {
      fileTypeSelect,
      pp,
      description,
    },
  }));

  return (
    <div className="wizard-step">
      <p className="text-center mt-4">{i18n.strings.upload.step2.subtitle}</p>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.fileType.title}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            <Select
              name="fileTypeSelect"
              value={fileTypeSelect}
              options={fileTypeSelectOptions}
              placeholder={i18n.strings.upload.step2.fileType.placeholder}
              onChange={(value) => setFileTypeSelect(value)}
            />
          </FormGroup>
        </Col>
      </Row>
      {fileTypeSelect.value !== "sensor/instance" && (
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <FormGroup>
              <FormLabel>
                {i18n.strings.upload.step2.isPublic.title}{" "}
                <span className="text-danger">*</span>
              </FormLabel>
              <Select
                name="ppSelect"
                value={pp}
                options={ppOptions}
                placeholder={i18n.strings.upload.step2.isPublic.placeholder}
                onChange={(value) => setPP(value)}
              />
            </FormGroup>
          </Col>
        </Row>
      )}
      {fileTypeSelect.value !== "sensor/project" &&
        fileTypeSelect.value !== "sensor/instance" && (
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              <FormGroup>
                <FormLabel>
                  {i18n.strings.upload.step2.isDownloadable.title}{" "}
                  <span className="text-danger">*</span>
                </FormLabel>
                <Select
                  name="downloadableSelect"
                  value={downloadable}
                  options={[
                    {
                      value: true,
                      label:
                        i18n.strings.upload.step2.isDownloadable.downloadable,
                    },
                    {
                      value: false,
                      label:
                        i18n.strings.upload.step2.isDownloadable
                          .notDownloadable,
                    },
                  ]}
                  placeholder={
                    i18n.strings.upload.step2.isDownloadable.placeholder
                  }
                  onChange={(value) => setDownloadable(value)}
                />
              </FormGroup>
            </Col>
          </Row>
        )}
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.description.title}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            <Form.Control
              placeholder={i18n.strings.upload.step2.description.placeholder}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </FormGroup>
        </Col>
      </Row>
      {fileTypeSelect.value === "shp/file" && (
        <ShapeFileForm
          isPublic={pp.value}
          downloadable={downloadable.value}
          description={description}
          upload={upload}
        />
      )}
      {fileTypeSelect.value === "shp/data" && (
        <ShapeDataForm
          isPublic={pp.value}
          downloadable={downloadable.value}
          description={description}
          upload={upload}
        />
      )}
      {fileTypeSelect.value === "shp/common" && (
        <ShapeCommonFileForm
          isPublic={pp.value}
          downloadable={downloadable.value}
          description={description}
          upload={upload}
        />
      )}
      {fileTypeSelect.value === "point/data" && (
        <PointDataForm
          isPublic={pp.value}
          downloadable={downloadable.value}
          description={description}
          upload={upload}
        />
      )}
      {fileTypeSelect.value === "sensor/project" && (
        <SensorForm
          isPublic={pp.value}
          description={description}
          upload={upload}
        />
      )}
      {fileTypeSelect.value === "sensor/instance" && (
        <SensorDataForm
          isPublic={pp.value}
          description={description}
          upload={upload}
        />
      )}
    </div>
  );
});

export default Step2;
