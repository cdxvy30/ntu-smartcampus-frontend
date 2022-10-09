import React from "react";
import { useLocation } from "react-router-dom";

// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";

// core components
import ReactTable from "components/ReactTable/ReactTable.js";

import { useI18n } from "../../context/i18n";

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

function ApproveTables() {
  const { i18n } = useI18n();

  // handle url params
  let location = useLocation();
  const params = new URLSearchParams(location.search);

  if (
    !params.get("fileType") ||
    !params.get("fileName") ||
    !params.get("version")
  )
    return <></>;
  let type = "";
  if (params.get("fileType") === "shp") {
    type = "shp";
  }
  if (params.get("fileType") === "point") {
    type = "point";
  }

  const { data, error } = useSWR(
    `${BACKEND_API}/api/${type}/data/read/${params.get(
      "fileName"
    )}/${params.get("version")}`,
    fetcher,
    { refreshInterval: 600000 }
  );

  if (!data || error) return <></>;

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <h4 className="title">{params.get("fileName")}</h4>
            <Card>
              <Card.Body>
                {
                  data.length !== 0 && (
                    <ReactTable
                      data={data}
                      columns={Object.keys(data[0]).map((name, index) => ({
                        id: index,
                        Header: name,
                        accessor: name,
                      }))}
                      className="-striped -highlight primary-pagination"
                    />
                  )
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ApproveTables;
