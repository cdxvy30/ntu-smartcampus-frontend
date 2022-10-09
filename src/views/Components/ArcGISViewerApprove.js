import React from "react";

// react-bootstrap components
import { Button, Card, Row, Col } from "react-bootstrap";
import LayerSelectorApprove from "./LayerSelectorApprove";

// arcgis
import { WebScene } from "@esri/react-arcgis";
import { setDefaultOptions } from "esri-loader";
import Setting from "./arcgis/Setting";
import Plugin from "./arcgis/Plugin";
import ShapeLayer from "./arcgis/ShapeLayer";
import PointLayer from "./arcgis/PointLayer";

import { pickColor } from './arcgis/color';

import { useI18n } from "../../context/i18n";

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
    .then((res) => res.data);

const isShapeFile = (elem) => elem.type === "shapeFile";
const isShapeData = (elem) => elem.type === "shapeData";
const isPointData = (elem) => elem.type === "pointData";

const ArcGISViewerApprove = ({ data }) => {
  const { i18n } = useI18n();
  setDefaultOptions({ css: true });

  const [allShapeFileList, setAllShapeFileList] = React.useState([]);
  React.useEffect(() => {
    fetcher(`${BACKEND_API}/api/shp/file/list`).then(setAllShapeFileList);

    setShpCollection(data.filter(isShapeFile))
    setShpDataCollection(data.filter(isShapeData))
    setPointDataCollection(data.filter(isPointData))
  }, [data]);

  const [shpCollection, setShpCollection] = React.useState([]);
  const [shpDataCollection, setShpDataCollection] = React.useState([]);
  const [pointDataCollection, setPointDataCollection] = React.useState([]);

  React.useEffect(() => {
    if (allShapeFileList) {
      shpDataCollection.map((data) => {
        const shapefileId = data["shapefile-id"];
        const result = shpCollection.find((elem) => elem.id === shapefileId);

        if (!result) {
          setShpCollection((prevColl) => {
            const _ = allShapeFileList.find((elem) => elem.id === shapefileId);
            return [...prevColl, { ..._, pending: false }];
          });
        }
      });
    }
  }, [allShapeFileList]);

  const [shpSelected, setShpSelected] = React.useState([]);
  const [shpShow, setShpShow] = React.useState(true);
  const [shpHiddenDataList, setShpHiddenDataList] = React.useState([]);
  const [pointSelected, setPointSelected] = React.useState([]);
  const [pointShow, setPointShow] = React.useState(true);

  const onDelete = () => {
    window.location.reload();
  };

  return (
    <Row>
      <Col xl="2">
        <Button
          className="btn-fw"
          variant={!shpShow || !pointShow ? "primary" : "default"}
          onClick={() => {
            setShpShow(true);
            setPointShow(true);
          }}
        >
          <i className="nc-icon nc-globe-2" style={{ marginRight: "10px" }}></i>
          {i18n.strings.approveDashboard.arcGisViewer.all}
        </Button>
        <br></br>
        <LayerSelectorApprove
          id={1}
          show={shpShow}
          icon="nc-icon nc-puzzle-10"
          title={i18n.strings.approveDashboard.arcGisViewer.shapeFile}
          backgroundColor="primary"
          options={shpCollection}
          onSwitch={() => setShpShow(!shpShow)}
          onSelect={setShpSelected}
          childrenList={shpDataCollection}
          keyValue="shapefile-id"
          fileType="shp"
          parentType="file"
          childrenType="data"
          hiddenChildrenList={shpHiddenDataList}
          onHide={(id) =>
            setShpHiddenDataList((prevList) => {
              if (prevList.includes(id)) {
                prevList.splice(prevList.indexOf(id), 1);
                return [...prevList];
              }
              return [...prevList, id];
            })
          }
          onDelete={onDelete}
        />
        <LayerSelectorApprove
          id={2}
          show={pointShow}
          icon="nc-icon nc-explore-2"
          title={i18n.strings.approveDashboard.arcGisViewer.pointData}
          backgroundColor="primary"
          options={pointDataCollection}
          onSwitch={() => setPointShow(!pointShow)}
          onSelect={setPointSelected}
          keyValue="id"
          fileType="point"
          parentType="data"
          onDelete={onDelete}
        />
        {/* Common data */}
        <Card color="primary">
            <Card.Header>
              <Row>
                <Col className="text-center" md="6">
                  <i
                    className="nc-icon nc-album-2"
                    style={{ marginRight: "10px" }}
                  ></i>
                  {i18n.strings.approveDashboard.arcGisViewer.common}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <a href={`/admin/common`} target="_blank">
                <Button
                  className="btn-social btn-link with-badge"
                  variant="github"
                  onClick={() => {}}
                >
                  <i className="fa fa-table"></i>
                  <span className="notification">
                    {
                      data.filter((elem) => elem.type === "commonFile")
                        .length
                    }
                  </span>
                </Button>
              </a>
            </Card.Body>
          </Card>
      </Col>
      <Col xl="10">
        <WebScene
          mapProperties={{ basemap: "osm" }}
          viewProperties={{
            center: [121.53897799930016, 25.017766628321343],
            zoom: 16,
            popup: {
              defaultPopupTemplateEnabled: true,
            },
          }}
          style={{
            position: "relative",
            height: "80vh",
          }}
        >
          <Setting />
          <Plugin />
          {shpCollection && shpDataCollection ? (
            shpCollection.map((data, index) => (
              <ShapeLayer
                key={index}
                disabled={
                  shpSelected.findIndex((elem) => elem.value === data.id) ===
                    -1 || !shpShow
                }
                info={data}
                dataList={shpDataCollection.filter(
                  (elem) => elem["shapefile-id"] === data.id
                )}
                hiddenDataList={shpHiddenDataList}
                specificVersion={true}
                color={pickColor(index)}
              />
            ))
          ) : (
            <></>
          )}
          {pointDataCollection ? (
            pointDataCollection.map((data, index) => (
              <PointLayer
                key={index}
                disabled={
                  pointSelected.findIndex((elem) => elem.value === data.id) ===
                    -1 || !pointShow
                }
                info={data}
                specificVersion={true}
                color={pickColor(index)}
              />
            ))
          ) : (
            <></>
          )}
        </WebScene>
      </Col>
    </Row>
  );
};

export default ArcGISViewerApprove;
