import React from "react";

// react-bootstrap components
import { Button, Row, Col } from "react-bootstrap";
import LayerSelector from "./LayerSelector";

// arcgis
import { WebMap } from "@esri/react-arcgis";
import { setDefaultOptions } from "esri-loader";
import Setting from "./arcgis/Setting";
import SavePlugin from "./arcgis/SavePlugin";
import Plugin from "./arcgis/Plugin";
import ShapeLayer from "./arcgis/ShapeLayer";
import PointLayer from "./arcgis/PointLayer";
import SensorLayer from "./arcgis/SensorLayer";

import { pickColor } from "./arcgis/color";

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

const ArcGISViewer = () => {
  const { i18n } = useI18n();
  setDefaultOptions({ css: true });

  const [shpCollection, setShpCollection] = React.useState([]);
  const [shpDataCollection, setShpDataCollection] = React.useState([]);
  const [pointDataCollection, setPointDataCollection] = React.useState([]);
  const [sensorCollection, setSensorCollection] = React.useState([]);

  React.useEffect(() => {
    fetcher(`${BACKEND_API}/api/shp/file/list`).then(setShpCollection);
    fetcher(`${BACKEND_API}/api/shp/data/list`).then(setShpDataCollection);
    fetcher(`${BACKEND_API}/api/point/data/list`).then(setPointDataCollection);
    fetcher(`${BACKEND_API}/api/sensor/project/list`).then(setSensorCollection);
  }, []);

  const [shpSelected, setShpSelected] = React.useState([]);
  const [shpShow, setShpShow] = React.useState(true);
  const [hiddenDataList, setHiddenDataList] = React.useState([]);
  const [pointSelected, setPointSelected] = React.useState([]);
  const [pointShow, setPointShow] = React.useState(true);
  const [sensorSelected, setSensorSelected] = React.useState([]);
  const [sensorShow, setSensorShow] = React.useState(true);

  const onDelete = () => {
    window.location.reload();
  };

  return (
    <Row>
      <Col xl="2" md="12">
        <Button
          className="btn-fw"
          variant={
            !shpShow || !pointShow || !sensorShow ? "primary" : "default"
          }
          onClick={() => {
            setShpShow(true);
            setPointShow(true);
            setSensorShow(true);
          }}
        >
          <i className="nc-icon nc-globe-2" style={{ marginRight: "10px" }}></i>
          {i18n.strings.dashboard.arcGisViewer.all}
        </Button>
        <br></br>
        <LayerSelector
          id={1}
          show={shpShow}
          icon="nc-icon nc-puzzle-10"
          title={i18n.strings.dashboard.arcGisViewer.shapeFile}
          backgroundColor="primary"
          options={shpCollection}
          onSwitch={() => setShpShow(!shpShow)}
          onSelect={setShpSelected}
          childrenList={shpDataCollection}
          hiddenChildrenList={hiddenDataList}
          keyValue="shapefile-id"
          fileType="shp"
          parentType="file"
          childrenType="data"
          onHide={(id) =>
            setHiddenDataList((prevList) => {
              if (prevList.includes(id)) {
                prevList.splice(prevList.indexOf(id), 1);
                return [...prevList];
              }
              return [...prevList, id];
            })
          }
          onDelete={onDelete}
        />
        <LayerSelector
          id={2}
          show={pointShow}
          icon="nc-icon nc-explore-2"
          title={i18n.strings.dashboard.arcGisViewer.pointData}
          backgroundColor="primary"
          options={pointDataCollection}
          onSwitch={() => setPointShow(!pointShow)}
          onSelect={setPointSelected}
          keyValue="id"
          fileType="point"
          parentType="data"
          onDelete={onDelete}
        />
        <LayerSelector
          id={3}
          show={sensorShow}
          icon="nc-icon nc-istanbul"
          title={i18n.strings.dashboard.arcGisViewer.sensor}
          backgroundColor="primary"
          options={sensorCollection}
          onSwitch={() => setSensorShow(!sensorShow)}
          onSelect={setSensorSelected}
          fileType="sensor"
          parentType="project"
          childrenType="instance"
          onDelete={onDelete}
        />
      </Col>
      <Col xl="10" md="12">
        <WebMap
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
          <SavePlugin
            excludeDataList={shpDataCollection.filter(
              (elem) => !hiddenDataList.includes(elem.id) && !elem.downloadable
            )}
          />
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
                hiddenDataList={hiddenDataList}
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
                color={pickColor(index)}
              />
            ))
          ) : (
            <></>
          )}
          {sensorCollection ? (
            sensorCollection.map((data, index) => (
              <SensorLayer
                key={index}
                disabled={
                  sensorSelected.findIndex((elem) => elem.value === data.id) ===
                    -1 || !sensorShow
                }
                info={data}
                color={pickColor(index)}
              />
            ))
          ) : (
            <></>
          )}
        </WebMap>
      </Col>
    </Row>
  );
};

export default ArcGISViewer;
