import React from "react";
// react plugin used to create DropdownMenu for selecting items
import Select from "react-select";

// react-bootstrap components
import { Button, Card, Form, Row, Col, Table } from "react-bootstrap";

import clsx from "clsx";
import {
  makeStyles,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link,
  Box,
} from "@material-ui/core";
import * as _ from "lodash";

import { useI18n } from "../../context/i18n";
import { useAuth } from "../../context/Auth";
import { useAlert } from "context/Alert";

import { saveAs } from "file-saver";
import Cookies from "universal-cookie";
import { BACKEND_API } from "config";
const cookies = new Cookies();
const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: "scroll",
  },
  parent: {},
  child: {},
  childTitle: {
    display: "flex",
  },
}));

const ListTable = ({
  parentList,
  childrenList,
  hiddenChildrenList,
  keyValue,
  fileType,
  parentType,
  childrenType,
  onHide,
  onDelete = () => {}
}) => {
  const classes = useStyles();
  const { i18n } = useI18n();
  const { info } = useAuth();
  const { pop } = useAlert();

  return (
    <Box className={classes.root}>
      <MuiTable>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parentList.map((p, index) => {
            return (
              <>
                <TableRow>
                  <TableCell>
                    <Typography>{p.name}</Typography>
                  </TableCell>
                  {p.downloadable && (
                    <>
                      <TableCell>
                        <Link
                          href={`/admin/data-table?fileType=${fileType}&fileName=${p.name}&version=${p.version}`}
                          target="_blank"
                        >
                          <Button
                            className="btn-social btn-link"
                            variant="github"
                          >
                            <i className="fa fa-table"></i>
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Button
                          className="btn-social btn-link"
                          variant="github"
                          onClick={() => {
                            axios
                              .get(
                                `${BACKEND_API}/api/${fileType}/${parentType}/download/${p.name}`,
                                {
                                  headers: {
                                    Authorization:
                                      "Bearer " +
                                      cookies.get("sdgs_access_token"),
                                  },
                                  responseType: "blob",
                                }
                              )
                              .then((res) => {
                                saveAs(res.data, p.name);
                              });
                          }}
                        >
                          <i className="fa fa-download"></i>
                        </Button>
                      </TableCell>
                    </>
                  )}
                  {info._id === p["owner-id"] && (
                    <TableCell>
                      <Button
                        className="btn-link remove text-danger"
                        variant="github"
                        onClick={async () => {
                          const yes = confirm(
                            i18n.strings.approveDashboard.confirms.remove(
                              p.name
                            )
                          );
                          if (!yes) return;

                          axios
                            .delete(
                              `${BACKEND_API}/api/${fileType}/${parentType}/remove/${p.name}`,
                              {
                                headers: {
                                  Authorization:
                                    "Bearer " +
                                    cookies.get("sdgs_access_token"),
                                },
                                responseType: "blob",
                              }
                            )
                            .then((response) => {
                              pop(
                                i18n.strings.upload.alert.title,
                                i18n.strings.approveDashboard.notifications.removeSuccess(
                                  p.name
                                ),
                                true,
                                "info"
                              );
                              onDelete()
                            })
                            .catch((error) => {
                              pop(
                                i18n.strings.upload.alert.title,
                                i18n.strings.upload.alert.failed,
                                true,
                                "danger"
                              );
                            });
                        }}
                      >
                        <i className="fa fa-times" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
                {childrenList
                  .filter((elem) => elem[keyValue] === p.id)
                  .map((c, index) => {
                    return (
                      <TableRow>
                        <TableCell className={classes.childTitle}>
                          <Button
                            className="btn-social btn-link"
                            variant={
                              hiddenChildrenList.includes(c.id)
                                ? "facebook"
                                : "twitter"
                            }
                            onClick={() => onHide(c.id)}
                          >
                            {hiddenChildrenList.includes(c.id) ? (
                              <i className="fa fa-eye-slash"></i>
                            ) : (
                              <i className="fa fa-eye"></i>
                            )}
                          </Button>
                          <Typography>{c.name}</Typography>
                        </TableCell>
                        {c.downloadable && (
                          <>
                            <TableCell>
                              <Link
                                href={`/admin/data-table?fileType=${fileType}&fileName=${c.name}&version=${c.version}`}
                                target="_blank"
                              >
                                <Button
                                  className="btn-social btn-link"
                                  variant="github"
                                >
                                  <i className="fa fa-table"></i>
                                </Button>
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Button
                                className="btn-social btn-link"
                                variant="github"
                                onClick={() => {
                                  axios
                                    .get(
                                      `${BACKEND_API}/api/${fileType}/${childrenType}/download/${c.name}`,
                                      {
                                        headers: {
                                          Authorization:
                                            "Bearer " +
                                            cookies.get("sdgs_access_token"),
                                        },
                                        responseType: "blob",
                                      }
                                    )
                                    .then((res) => {
                                      saveAs(res.data, c.name);
                                    });
                                }}
                              >
                                <i className="fa fa-download"></i>
                              </Button>
                            </TableCell>
                          </>
                        )}
                        {info._id === p["owner-id"] && (
                          <Button
                            className="btn-link remove text-danger"
                            variant="github"
                            onClick={async () => {
                              const yes = confirm(
                                i18n.strings.approveDashboard.confirms.remove(
                                  c.name
                                )
                              );
                              if (!yes) return;

                              axios
                                .delete(
                                  `${BACKEND_API}/api/${fileType}/${childrenType}/remove/${c.name}`,
                                  {
                                    headers: {
                                      Authorization:
                                        "Bearer " +
                                        cookies.get("sdgs_access_token"),
                                    },
                                    responseType: "blob",
                                  }
                                )
                                .then((response) => {
                                  pop(
                                    i18n.strings.upload.alert.title,
                                    i18n.strings.approveDashboard.notifications.removeSuccess(
                                      c.name
                                    ),
                                    true,
                                    "info"
                                  );
                                  onDelete()
                                })
                                .catch((error) => {
                                  pop(
                                    i18n.strings.upload.alert.title,
                                    i18n.strings.upload.alert.failed,
                                    true,
                                    "danger"
                                  );
                                });
                            }}
                          >
                            <i className="fa fa-times" />
                          </Button>
                        )}
                      </TableRow>
                    );
                  })}
              </>
            );
          })}
        </TableBody>
      </MuiTable>
    </Box>
  );
};

const LayerSelector = ({
  id = 1,
  show = true,
  icon = "nc-icon nc-globe-2",
  title = "",
  backgroundColor = "default",
  options = [],
  onSwitch,
  onSelect,
  childrenList = [],
  hiddenChildrenList = [],
  keyValue = "",
  fileType = "",
  parentType = "",
  childrenType = "",
  onHide = () => {},
  onDelete = () => {}
}) => {
  if (fileType === "") return <></>;

  const { i18n } = useI18n();
  const [multipleSelect, setMultipleSelect] = React.useState(null);

  return (
    <Card color={backgroundColor}>
      <Card.Header>
        <Row>
          <Col xl="12" md="6">
            <Form.Check
              checked={show}
              type="switch"
              id={`custom-switch-${id}`}
              className="mb-1"
              onChange={onSwitch}
            />
          </Col>
          <Col className="text-center" xl="12" md="6">
            <i className={icon} style={{ marginRight: "10px" }}></i>
            {title}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md="12">
            <Select
              className="react-select info"
              placeholder={i18n.strings.dashboard.arcGisViewer.placeholder}
              name="multipleSelect"
              isDisabled={!show}
              closeMenuOnSelect={false}
              isMulti
              value={multipleSelect}
              onChange={(value) => {
                setMultipleSelect(value);
                onSelect(value ? value : []);
              }}
              options={[
                {
                  value: "",
                  label: i18n.strings.dashboard.arcGisViewer.selectPlaceholder,
                  isDisabled: true,
                },
                ...options.map((o) => ({
                  value: o.id || o.device_id,
                  label: o.name || o.device,
                })),
              ]}
            />
          </Col>
        </Row>
        {multipleSelect && (
          <Row>
            <Col md="12">
              <ListTable
                parentList={options.filter((elem) =>
                  multipleSelect.find((m) => m.value === elem.id)
                )}
                childrenList={childrenList}
                hiddenChildrenList={hiddenChildrenList}
                keyValue={keyValue}
                fileType={fileType}
                parentType={parentType}
                childrenType={childrenType}
                onHide={onHide}
                onDelete={onDelete}
              />
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default LayerSelector;
