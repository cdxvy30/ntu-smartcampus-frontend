import React from "react";

// react-bootstrap components
import {
  Button,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";

// core components
import ReactTable from "components/ReactTable/ReactTable.js";

import { useI18n } from "../../context/i18n";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import { saveAs } from "file-saver";

import Cookies from "universal-cookie";
import useSWR from "swr";
import { BACKEND_API } from "config";
const cookies = new Cookies();
const axios = require("axios").default;

const APPROVE_URL = "/api/admin/data/validate";
const DECLINE_URL = "/api/admin/data/cancel";

const fetcher = (url) =>
  axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + cookies.get("sdgs_access_token"),
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data);

function ApproveCommonTables() {
  const { i18n } = useI18n();

  const notificationAlertRef = React.useRef(null);
  const notify = (message, type) => {
    var options = {};
    options = {
      place: "tr",
      message: (
        <div>
          <div>{message}</div>
        </div>
      ),
      type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const approve = (fileName) => {
    var formData = new FormData();
    formData.append("fileName", fileName);

    axios
      .put(`${BACKEND_API}${APPROVE_URL}`, formData, {
        headers: {
          Authorization: "Bearer " + cookies.get("sdgs_access_token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        notify(
          i18n.strings.approveDashboard.notifications.validateSuccess(fileName),
          "primary"
        );
      })
      .catch((err) => {
        try {
          notify(err.response.data, "danger");
        } catch {
          notify("失敗", "danger");
        }
      });
  };

  const remove = (fileName) => {
    var formData = new FormData();
    formData.append("fileName", fileName);

    axios
      .put(`${BACKEND_API}${DECLINE_URL}`, formData, {
        headers: {
          Authorization: "Bearer " + cookies.get("sdgs_access_token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        notify(
          i18n.strings.approveDashboard.notifications.removeSuccess(fileName),
          "primary"
        );
      })
      .catch((err) => {
        try {
          notify(err.response.data, "danger");
        } catch {
          notify("失敗", "danger");
        }
      });
  };

  const { data, error } = useSWR(
    `${BACKEND_API}/api/admin/pending-data/list`,
    fetcher,
    { refreshInterval: 600000 }
  );

  if (!data || error) return <></>;

  if (data.length === 0) return <>No files</>;

  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Container fluid>
        <Row>
          <Col md="12">
            <h4>{i18n.strings.approveDashboard.arcGisViewer.common}</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={data
                    .filter((elem) => elem.type === "commonFile")
                    .map((d) => ({
                      ...d,
                      actions: (
                        // we've added some custom button actions
                        <div className="actions-right">
                          {/* use this button to add a like kind of action */}
                          <Button
                            onClick={() => {
                              axios
                                .get(
                                  `${BACKEND_API}/api/shp/common/download/${d.name}/${d.version}`,
                                  {
                                    headers: {
                                      Authorization:
                                        "Bearer " + cookies.get("sdgs_access_token"),
                                    },
                                    responseType: "blob",
                                  }
                                )
                                .then((res) => {
                                  saveAs(res.data, d.name);
                                });
                            }}
                            variant="info"
                            size="sm"
                            className="text-info btn-link like"
                          >
                            <i className="fa fa-download" />
                          </Button>{" "}
                          {/* use this button to approve the data row */}
                          <Button
                            onClick={() => {
                              const yes = confirm(
                                i18n.strings.approveDashboard.confirms.validate(
                                  d.name
                                )
                              );
                              if (!yes) return;

                              approve(d.name);
                            }}
                            variant="info"
                            size="sm"
                            className="text-info btn-link like"
                          >
                            <i className="fa fa-check" />
                          </Button>{" "}
                          {/* use this button to remove the data row */}
                          <Button
                            onClick={() => {
                              const yes = confirm(
                                i18n.strings.approveDashboard.confirms.remove(
                                  d.name
                                )
                              );
                              if (!yes) return;

                              remove(d.name);
                            }}
                            variant="danger"
                            size="sm"
                            className="btn-link remove text-danger"
                          >
                            <i className="fa fa-times" />
                          </Button>{" "}
                        </div>
                      ),
                    }))}
                  columns={Object.keys(data[0])
                    .map((name) => ({
                      Header: name,
                      accessor: name,
                    }))
                    .concat([
                      {
                        Header: "Actions",
                        accessor: "actions",
                        sortable: false,
                        filterable: false,
                      },
                    ])}
                  className="-striped -highlight primary-pagination"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ApproveCommonTables;
