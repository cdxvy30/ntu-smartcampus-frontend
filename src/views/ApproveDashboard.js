import React from "react";
import { Link } from "react-router-dom";

// react-bootstrap components
import { Button, Card, Container, Row, Col } from "react-bootstrap";

// arcgis viewer
import ArcGISViewerApprove from "./Components/ArcGISViewerApprove";

import { useI18n } from "../context/i18n";

import Cookies from "universal-cookie";
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
    .then((res) => res.data.map(d => ({
      ...d,
      pending: true
    })));

function Dashboard() {
  const { i18n } = useI18n();

  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    fetcher(`${BACKEND_API}/api/admin/pending-data/list`).then(setData);
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="arcgis-viewer">
              <Card.Header>
                <Card.Title as="h4">
                  {i18n.strings.approveDashboard.arcGisViewer.title}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <ArcGISViewerApprove data={data} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
