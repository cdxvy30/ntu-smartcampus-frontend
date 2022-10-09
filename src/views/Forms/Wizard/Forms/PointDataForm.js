import React from "react";
import {
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  FormLabel,
  Table,
  Modal,
} from "react-bootstrap";
import { makeStyles, Tooltip } from "@material-ui/core";
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import Select from "react-select";
import ModalForm from "../ModalForm";
import XLSX from "xlsx";
import { useAuth } from "context/Auth";
import { useI18n } from "context/i18n";
import { useAlert } from "context/Alert";

import Cookies from "universal-cookie";
import { BACKEND_API } from "config";
const cookies = new Cookies();
const axios = require("axios").default;

const coordOptions = [
  {
    value: "Default",
    label: "default",
  },
  {
    value: "EPSG:3826",
    label: "EPSG:3826",
  },
];

const useStyles = makeStyles((theme) => ({
  tooltip: {
    maxWidth: 500,
  },
}));

const PointDataForm = ({
  isPublic = true,
  downloadable = true,
  description = "",
  upload,
}) => {
  const classes = useStyles();
  const { info } = useAuth();
  const { i18n } = useI18n();
  const { pop, cancelPop } = useAlert();

  const handleUploadClick = () => {
    if (
      description === "" ||
      !file ||
      !keyPropertyName ||
      columnArray.length === 0 ||
      !xPropertyName ||
      !yPropertyName ||
      !coord
    )
      return;

    const yes = confirm(i18n.strings.upload.step2.upload.alert);
    if (!yes) return;

    var formData = new FormData();
    const fileName = file.name;
    const newName = info.displayName + "__" + fileName;
    const newfile = renameFile(file, newName);
    formData.append("fileName", newName);
    formData.append("data", newfile);
    formData.append("keyPropertyName", keyPropertyName.label);
    formData.append(
      "dataStruct",
      JSON.stringify(
        columnArray.map((c) => ({
          name: c.name,
          type: c.type.value,
        })),
        null,
        0
      )
    );
    formData.append("xPropertyName", xPropertyName.label);
    formData.append("yPropertyName", yPropertyName.label);
    formData.append("coordinateSystem", coord.label);
    formData.append("isPublic", isPublic);
    formData.append("isDownloadable", downloadable);
    formData.append("description", description);

    upload(() =>
      axios.post(`${BACKEND_API}/api/point/data/create`, formData, {
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

  // attributes
  const [file, setFile] = React.useState(null);
  const [keyPropertyName, setKeyPropertyName] = React.useState(null);
  const [keyPropertyNameOptions, setKeyPropertyNameOptions] = React.useState(
    []
  );
  const [columnArray, setColumnArray] = React.useState([]);
  const [noValueArray, setNoValueArray] = React.useState([]);
  const [nowEditingColumn, setNowEditingColumn] = React.useState(null);
  const [xPropertyName, setXPropertyName] = React.useState(null);
  const [yPropertyName, setYPropertyName] = React.useState(null);
  const [coord, setCoord] = React.useState(null);

  // utils
  const [modal, setModal] = React.useState(false);

  React.useEffect(() => {
    setCoord(coordOptions[0]);
  }, []);

  React.useEffect(() => {
    // init
    setColumnArray([]);
    setNoValueArray([]);
    setNowEditingColumn(null);

    if (!file) return;

    pop(
      i18n.strings.upload.alert.title,
      i18n.strings.upload.alert.process.title,
      false
    );

    try {
      if (file.name.endsWith(".xlsx")) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, {
            type: "binary",
            sheetRows: 2,
            sheets: 0,
          });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          /* Update state */
          const header = data[0];
          const _second = data[1];

          const _options = header.map((h, index) => ({
            value: index,
            label: h,
          }));
          setKeyPropertyNameOptions(_options);
          setKeyPropertyName({
            value: 0,
            label: header[0],
          });

          var _noValue = [];
          setColumnArray(
            header.map((h, index) => {
              if (!_second[index]) {
                _noValue.push(index);
              }
              return {
                name: h,
                type: _second[index]
                  ? typeDetector(_second[index])
                  : typeOptions[0],
              };
            })
          );

          setNoValueArray(_noValue);

          cancelPop();
        };
        reader.readAsBinaryString(file);
      } else if (file.name.endsWith(".json")) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const bstr = evt.target.result;
          const parsedJson = JSON.parse(bstr);
          const header = Object.keys(parsedJson[0]);
          const _second = Object.values(parsedJson[0]);
          const _options = Object.keys(parsedJson[0]).map((h, index) => ({
            value: index,
            label: h,
          }));
          setKeyPropertyNameOptions(_options);
          setKeyPropertyName({
            value: 0,
            label: header[0],
          });
          var _noValue = [];
          setColumnArray(
            header.map((h, index) => {
              if (!_second[index]) {
                _noValue.push(index);
              }
              return {
                name: h,
                type: _second[index]
                  ? typeDetector(_second[index])
                  : typeOptions[0],
              };
            })
          );
          setNoValueArray(_noValue);

          cancelPop();
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.log(err);
    }
  }, [file]);

  const deleteOnClick = (event) => {
    const id = parseInt(event.target.id);
    setColumnArray((prevColumnArray) => {
      prevColumnArray.splice(id, 1);
      return [...prevColumnArray];
    });
  };

  const onColumnEdit = (value) => {
    onColumnArrayChange((prevColumnArray) => {
      prevColumnArray[nowEditingColumn.key] = value;
      return prevColumnArray;
    });
    setModal(!modal);
  };

  const onColumnAdd = (value) => {
    onColumnArrayChange((prevColumnArray) => {
      return [...prevColumnArray, value];
    });
    setModal(!modal);
  };

  const typeOptions = [
    {
      value: "string",
      label: i18n.strings.upload.step2.columnSection.formats.string,
    },
    {
      value: "int",
      label: i18n.strings.upload.step2.columnSection.formats.int,
    },
    {
      value: "double",
      label: i18n.strings.upload.step2.columnSection.formats.double,
    },
  ];

  const typeDetector = (value) => {
    if (!value) return undefined;
    if (typeof value === "string") return typeOptions[0];
    if (typeof value === "number" && Number.isInteger(value))
      return typeOptions[1];
    if (typeof value === "number" && !Number.isInteger(value))
      return typeOptions[2];
    return undefined;
  };

  return (
    <div className="point-data-attributes">
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
              accept=".xlsx, .json"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.xCoord.title}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            <Select
              name="typeSelect"
              value={xPropertyName}
              options={keyPropertyNameOptions}
              placeholder={i18n.strings.upload.step2.xCoord.placeholder}
              onChange={(value) => {
                setXPropertyName(value);
              }}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.yCoord.title}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            <Select
              name="typeSelect"
              value={yPropertyName}
              options={keyPropertyNameOptions}
              placeholder={i18n.strings.upload.step2.yCoord.placeholder}
              onChange={(value) => {
                setYPropertyName(value);
              }}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <FormGroup>
            <FormLabel>
              {i18n.strings.upload.step2.coordinate.title}{" "}
              <span className="text-danger">*</span>
            </FormLabel>
            <Select
              name="typeSelect"
              value={coord}
              options={coordOptions}
              placeholder={i18n.strings.upload.step2.coordinate.placeholder}
              onChange={(value) => {
                setCoord(value);
              }}
            />
          </FormGroup>
        </Col>
      </Row>
      <div className="excel-data-attributes">
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
              <Select
                name="typeSelect"
                value={keyPropertyName}
                options={keyPropertyNameOptions}
                placeholder={i18n.strings.upload.step2.keyProperty.placeholder}
                onChange={setKeyPropertyName}
              />
            </FormGroup>
          </Col>
        </Row>
      </div>
      <div className="excel-header">
        {columnArray.length > 0 && (
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              <Table className="table-hover table-striped w-full">
                <thead>
                  <tr>
                    <th>
                      {i18n.strings.upload.step2.columnSection.header.number}
                    </th>
                    <th>
                      {i18n.strings.upload.step2.columnSection.header.name}
                    </th>
                    <th>
                      {i18n.strings.upload.step2.columnSection.header.format}
                    </th>
                    <th></th>
                    <th color="danger">
                      {i18n.strings.upload.step2.columnSection.header.notice}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {columnArray.map((column, key) => (
                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{column.name}</td>
                      <td>{column.type.label}</td>
                      <td>
                        <Button
                          className="btn-wd"
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setNowEditingColumn({
                              key,
                              column,
                            });
                            setModal(!modal);
                          }}
                          id={key}
                        >
                          {i18n.strings.upload.step2.columnSection.buttons.edit}
                        </Button>
                      </td>
                      <td>
                        {noValueArray.includes(key)
                          ? i18n.strings.upload.step2.columnSection.notice
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}
      </div>
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
      <Modal
        className="modal-mini modal-primary"
        onHide={() => {
          setModal(!modal);
          setNowEditingColumn(null);
        }}
        show={modal}
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-bulb-63"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          {nowEditingColumn ? (
            <ModalForm
              typeOptions={typeOptions}
              column={nowEditingColumn.column}
              submit={onColumnEdit}
              edit={true}
            />
          ) : (
            <ModalForm
              typeOptions={typeOptions}
              column={{ name: "", type: typeOptions[0] }}
              submit={onColumnAdd}
            />
          )}
        </Modal.Body>
        <div className="modal-footer">
          <Button
            className="btn-simple"
            onClick={() => setModal(!modal)}
            variant="link"
          >
            {i18n.strings.upload.step2.columnSection.modal.close}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PointDataForm;
