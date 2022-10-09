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
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import Select from "react-select";
import ModalForm from "../ModalForm";
import XLSX from "xlsx";
import { useAuth } from "context/Auth";
import { useI18n } from "context/i18n";
import { useAlert } from "context/Alert";

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

const ShapeDataForm = ({
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
      !bindingShpName
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
    formData.append("bindingShpName", bindingShpName.label);
    formData.append("isPublic", isPublic);
    formData.append("isDownloadable", downloadable);
    formData.append("description", description);

    upload(() =>
      axios.post(`${BACKEND_API}/api/shp/data/create`, formData, {
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

  const [bindingkeyPropertyName, setBindingPropertyName] = React.useState("");
  // attributes
  const [file, setFile] = React.useState(null);
  const [keyPropertyName, setKeyPropertyName] = React.useState(null);
  const [keyPropertyNameOptions, setKeyPropertyNameOptions] = React.useState(
    []
  );
  const [columnArray, setColumnArray] = React.useState([]);
  const [noValueArray, setNoValueArray] = React.useState([]);
  const [nowEditingColumn, setNowEditingColumn] = React.useState(null);
  const [bindingShpName, setBindingShpName] = React.useState(null);
  const { data: bindingShpNameOptions, error: bindingShpNameOptionsError } =
    useSWR(`${BACKEND_API}/api/shp/file/list`, fetcher, {
      refreshInterval: 600000,
    });
  React.useEffect(() => {
    if (bindingShpNameOptions && bindingShpNameOptions.length > 0) {
      setBindingShpName({
        value: bindingShpNameOptions[0].id,
        label: bindingShpNameOptions[0].name,
      });
      setBindingPropertyName(bindingShpNameOptions[0].keyPropertyName);
    }
  }, bindingShpNameOptions);

  // utils
  const [modal, setModal] = React.useState(false);

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
          const wb = XLSX.read(bstr, { type: "binary" });
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
    setColumnArray((prevColumnArray) => {
      prevColumnArray[nowEditingColumn.key] = value;
      return prevColumnArray;
    });
    setModal(!modal);
  };

  const onColumnAdd = (value) => {
    setColumnArray((prevColumnArray) => {
      return [...prevColumnArray, value];
    });
    setModal(!modal);
  };

  const typeDetector = (value) => {
    if (!value) return undefined;
    if (typeof value === "string") return typeOptions[0];
    if (typeof value === "number" && Number.isInteger(value))
      return typeOptions[1];
    if (typeof value === "number" && !Number.isInteger(value))
      return typeOptions[2];
    return undefined;
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

  if (!bindingShpNameOptions || bindingShpNameOptionsError) {
    return <></>;
  }

  return (
    <div className="shape-data-attributes">
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
                placeholder={`- ${bindingkeyPropertyName} -`}
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

export default ShapeDataForm;
