import React from "react";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  InputGroup,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

// core components
import ReactTable from "components/ReactTable/ReactTable.js";

import Cookies from "universal-cookie";
import { useI18n } from "../../context/i18n";
import { BACKEND_API } from "config";

const axios = require("axios").default;
const cookies = new Cookies();

function ApplicantsTable() {
  const { i18n } = useI18n();
  const notificationAlertRef = React.useRef(null);
  const [raw, setRaw] = React.useState([]);

  React.useEffect(() => {
    const sdgs_access_token = cookies.get("sdgs_access_token");

    axios
      .get(`${BACKEND_API}/api/admin/pending-user/list`, {
        headers: {
          Authorization: "Bearer " + sdgs_access_token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        setRaw(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const data = React.useMemo(() => {
    if (raw.length === 0) return [];

    return raw.map((prop, key) => {
      return {
        id: prop._id,
        username: prop.username,
        email: prop.email,
        displayName: prop.displayName,
        department: prop.department,
        staffCardImage: <img key={prop._id} src={prop.staffCardImage}></img>,
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
            {/* use this button to add a like kind of action */}
            <Button
              onClick={() => {
                const yes = confirm(
                  i18n.strings.applicants.confirms.validate(prop.displayName)
                );
                if (!yes) return;

                const sdgs_access_token = cookies.get("sdgs_access_token");

                var formData = new FormData();
                formData.append("username", prop.username);

                axios
                  .put(`${BACKEND_API}/api/admin/user/validate`, formData, {
                    headers: {
                      Authorization: "Bearer " + sdgs_access_token,
                      "Content-Type": "multipart/form-data",
                    },
                  })
                  .then((response) => {
                    console.log(response);
                    notificationAlertRef.current.notificationAlert({
                      place: "tr",
                      message: (
                        <div>
                          <div>
                            {i18n.strings.applicants.notifications.validateSuccess(
                              prop.displayName
                            )}
                          </div>
                        </div>
                      ),
                      type: "primary",
                      icon: "nc-icon nc-bell-55",
                      autoDismiss: 7,
                    });

                    setRaw((prevRaw) => {
                      const index = prevRaw.findIndex(
                        (elem) => elem._id === prop._id
                      );

                      if (index === -1) {
                        return prevRaw;
                      } else {
                        prevRaw.splice(index, 1);
                        return [...prevRaw];
                      }
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                    notificationAlertRef.current.notificationAlert({
                      place: "tr",
                      message: (
                        <div>
                          <div>
                            {i18n.strings.applicants.notifications.validateFail(
                              prop.displayName
                            )}
                          </div>
                        </div>
                      ),
                      type: "danger",
                      icon: "nc-icon nc-bell-55",
                      autoDismiss: 7,
                    });
                  });
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
                  i18n.strings.applicants.confirms.remove(prop.displayName)
                );
                if (!yes) return;

                const sdgs_access_token = cookies.get("sdgs_access_token");

                var formData = new FormData();
                formData.append("username", prop.username);

                axios
                  .put(`${BACKEND_API}/api/admin/user/cancel`, formData, {
                    headers: {
                      Authorization: "Bearer " + sdgs_access_token,
                      "Content-Type": "application/json",
                    },
                  })
                  .then((response) => {
                    console.log(response);
                    notificationAlertRef.current.notificationAlert({
                      place: "tr",
                      message: (
                        <div>
                          <div>
                            {i18n.strings.applicants.notifications.removeSuccess(
                              prop.displayName
                            )}
                          </div>
                        </div>
                      ),
                      type: "primary",
                      icon: "nc-icon nc-bell-55",
                      autoDismiss: 7,
                    });

                    setRaw((prevRaw) => {
                      const index = prevRaw.findIndex(
                        (elem) => elem._id === prop._id
                      );

                      if (index === -1) {
                        return prevRaw;
                      } else {
                        prevRaw.splice(index, 1);
                        return [...prevRaw];
                      }
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                    notificationAlertRef.current.notificationAlert({
                      place: "tr",
                      message: (
                        <div>
                          <div>
                            {i18n.strings.applicants.notifications.removeFail(
                              prop.displayName
                            )}
                          </div>
                        </div>
                      ),
                      type: "danger",
                      icon: "nc-icon nc-bell-55",
                      autoDismiss: 7,
                    });
                  });
              }}
              variant="danger"
              size="sm"
              className="btn-link remove text-danger"
            >
              <i className="fa fa-times" />
            </Button>{" "}
          </div>
        ),
      };
    });
  }, [raw]);

  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Container fluid>
        <Row>
          <Col md="12">
            <h4 className="title">{i18n.strings.applicants.title}</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={data}
                  columns={[
                    {
                      Header: i18n.strings.applicants.table.username,
                      accessor: "username",
                    },
                    {
                      Header: i18n.strings.applicants.table.email,
                      accessor: "email",
                    },
                    {
                      Header: i18n.strings.applicants.table.displayName,
                      accessor: "displayName",
                    },
                    {
                      Header: i18n.strings.applicants.table.department,
                      accessor: "department",
                    },
                    {
                      Header: i18n.strings.applicants.table.staffCardImage,
                      accessor: "staffCardImage",
                    },
                    {
                      Header: "Actions",
                      accessor: "actions",
                      sortable: false,
                      filterable: false,
                    },
                  ]}
                  /*
                    You can choose between primary-pagination, info-pagination, success-pagination, warning-pagination, danger-pagination or none - which will make the pagination buttons gray
                  */
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

export default ApplicantsTable;
