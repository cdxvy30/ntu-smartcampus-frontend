import React from "react";

// react-bootstrap components
import {
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";

// core components
import ReactTable from "components/ReactTable/ReactTable.js";

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
  const { data, error } = useSWR(
    `${BACKEND_API}/api/publish/status`,
    fetcher
  );

  if (!data || error) return <></>;

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Body>
                {
                  data.length !== 0 && (
                    <ReactTable
                      data={data}
                      columns={Object.keys(data[0]).map((name) => ({
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
