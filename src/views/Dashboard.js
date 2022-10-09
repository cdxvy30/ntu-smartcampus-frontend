import React from "react";
import { Link } from "react-router-dom";

// react-bootstrap components
import { Button, Card, Container, Row, Col } from "react-bootstrap";

// arcgis viewer
import ArcGISViewer from "./Components/ArcGISViewer";

import { useI18n } from "../context/i18n";

function Dashboard() {
  const { i18n } = useI18n();

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="arcgis-viewer">
              <Card.Header>
                <Card.Title as="h4">{i18n.strings.dashboard.arcGisViewer.title}</Card.Title>
              </Card.Header>
              <Card.Body>
                <ArcGISViewer />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
