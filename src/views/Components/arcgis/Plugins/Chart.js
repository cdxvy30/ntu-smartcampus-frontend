import { useState, useEffect } from "react";
// react plugin used to create datetimepicker
import ReactDatetime from "react-datetime";
// react component used to create charts
import "chartjs-adapter-moment";
import moment from "moment";
import { Line } from "react-chartjs-2";
// react-bootstrap components
import { Button, Card, Form, Row, Col, Modal } from "react-bootstrap";

// core components
import ReactTable from "components/ReactTable/ReactTable.js";

import { useI18n } from "context/i18n";

import {pickColor} from "../color"

const axios = require("axios").default;

const enumerateDaysBetweenDates = (startDate, endDate, format) => {
  var now = moment(startDate.format()),
    dates = [];

  while (now.isSameOrBefore(endDate)) {
    dates.push(now.format(format));
    now.add(1, "days");
  }
  return dates;
};

const fetcher = (info, startDate, endDate) => {
  const dateLocation = JSON.parse(info.date);
  console.log(info)

  return Promise.all(
    enumerateDaysBetweenDates(startDate, endDate, dateLocation.format).map(
      (date) => {
        let url = info.url;
        let query = {};
        let body = {};

        try {
          if (dateLocation.in === "query") {
            query = JSON.parse(
              info.query.replace("SENSORDATEFORSDGSCAMPUS", date)
            );
            body = JSON.parse(info.body);
          } else if (dateLocation.in === "body") {
            query = JSON.parse(info.query);
            body = JSON.parse(
              info.body.replace("SENSORDATEFORSDGSCAMPUS", date)
            );
          } else if (dateLocation.in === "pathVariables") {
            let splitted = url.split(`:${dateLocation.name}`);
            url = splitted.join(date);
            query = JSON.parse(info.query);
            body = JSON.parse(info.body);
          }
        } catch (err) {
          console.log(err);
        }

        const responseStruc = info.response.split(".");

        return axios
          .get(url, {
            query,
            headers: {
              "Content-Type": "application/json",
            },
            data: body,
          })
          .then((res) => {
            let data = res.data;

            responseStruc.forEach((key) => {
              if (!Number(key)) {
                if (!data[key]) return;
                data = data[key];
              } else {
                if (!data[parseInt(key)]) return;
                data = data[parseInt(key)];
              }
            });

            return data ? data : [];
          });
      }
    )
  );
};

const Chart = ({ show, onHide, info, chartItems, ...rest }) => {
  const { i18n } = useI18n();
  const [startDate, setStartDate] = useState(moment().subtract(1));
  const [endDate, setEndDate] = useState(moment());
  const [tableShow, setTableShow] = useState(false);

  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    fetcher(info, startDate, endDate).then((response) => {
      try {
        const flatten = response.flat()
        let sorted = []
        flatten.map(f => {
          Object.keys(f).map(key => {
            sorted.push(f[key])
          })
        })
        setSensorData(sorted);
      }catch {
        setSensorData([])
      }
    });
  }, [startDate, endDate]);

  return (
    <Modal className="modal-primary" show={show} onHide={onHide}>
      <Modal.Body>
        <Card>
          <Card.Body>
            <Row>
              <Col md="5">
                <Form.Group>
                  <Form.Label>
                    {
                      i18n.strings.dashboard.arcGisViewer.plugin.chart
                        .placeholder.startDate
                    }
                  </Form.Label>
                  <ReactDatetime
                    inputProps={{
                      className: "form-control",
                      onKeyDown: (e) => e.preventDefault(),
                      placeholder:
                        i18n.strings.dashboard.arcGisViewer.plugin.chart
                          .placeholder.startDate,
                    }}
                    timeFormat={false}
                    value={startDate}
                    onChange={setStartDate}
                  ></ReactDatetime>
                </Form.Group>
              </Col>
              <Col md="5">
                <Form.Group>
                  <Form.Label>
                    {
                      i18n.strings.dashboard.arcGisViewer.plugin.chart
                        .placeholder.endDate
                    }
                  </Form.Label>
                  <ReactDatetime
                    inputProps={{
                      className: "form-control",
                      onKeyDown: (e) => e.preventDefault(),
                      placeholder:
                        i18n.strings.dashboard.arcGisViewer.plugin.chart
                          .placeholder.endDate,
                    }}
                    timeFormat={false}
                    value={endDate}
                    onChange={setEndDate}
                  ></ReactDatetime>
                </Form.Group>
              </Col>
              <Col md="2">
                {sensorData.length !== 0 && (
                  <Button
                    className="mr-1 in-map"
                    type="button"
                    variant="primary"
                    onClick={() => setTableShow(!tableShow)}
                  >
                    <i className="nc-icon nc-single-copy-04"></i>
                  </Button>
                )}
              </Col>
            </Row>
            {sensorData.length !== 0 && (
              <>
                <Line
                  data={{
                    labels: sensorData.map(d => d.timestamp),
                    datasets: Object.keys(sensorData[0]).map((key, index) => ({
                      label: key,
                      data: sensorData.map((d) => d[key]),
                      fill: true,
                      borderColor: pickColor(index),
                      backgroundColor: "transparent",
                      pointBackgroundColor: pickColor(index),
                      pointBorderColor: "rgba(255,255,255,0)",
                      pointHoverBackgroundColor: pickColor(index),
                      pointBorderWidth: 20,
                      pointHoverRadius: 5,
                      pointHoverBorderWidth: 15,
                      pointRadius: 2,
                    })),
                  }}
                />
                <Modal
                  className="modal-primary"
                  show={tableShow}
                  onHide={() => setTableShow(false)}
                >
                  <Modal.Body>
                    <Row>
                      <Col md="12">
                        <Card>
                          <Card.Body>
                            <ReactTable
                              data={sensorData}
                              columns={Object.keys(sensorData[0]).map(
                                (name) => ({
                                  Header: name,
                                  accessor: name,
                                })
                              )}
                              className="-striped -highlight primary-pagination"
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Modal.Body>
                </Modal>
              </>
            )}
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default Chart;
