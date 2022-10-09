import { useState, useEffect } from "react";
import { loadModules } from "esri-loader";
import { v4 as uuidv4 } from "uuid";

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

const PointLayer = ({
  map,
  disabled,
  info,
  specificVersion = false,
  color = "green",
  ...rest
}) => {
  const [myFeatureLayer, setMyFeatureLayer] = useState(null);

  useEffect(() => {
    return function cleanup() {
      map.remove(myFeatureLayer);
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      map.remove(myFeatureLayer);
      return;
    }

    if (myFeatureLayer) {
      map.remove(myFeatureLayer);
    }

    fetcher(`${BACKEND_API}/api/point/data/read/${info.name}/${info.version}`)
      .then((pointData) => {
        loadModules([
          "esri/layers/FeatureLayer",
          "esri/Graphic",
          "esri/layers/support/Field",
        ])
          .then(async ([FeatureLayer, Graphic, Field]) => {
            const renderer = {
              type: "simple", // autocasts as new SimpleRenderer()
              symbol: {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                size: 10,
                color: color,
                outline: {
                  // autocasts as new SimpleLineSymbol()
                  width: 0.5,
                  color: "white",
                },
              },
            };
            let features = pointData.map((d, index) => {
              // First create a point geometry
              let point = {
                type: "point", // autocasts as new Point()
                longitude: d.X,
                latitude: d.Y,
              };

              // Create a graphic and add the geometry and symbol to it
              let pointGraphic = new Graphic({
                geometry: point,
                attributes: {
                  ObjectID: uuidv4(),
                  ...d,
                },
              });
              return pointGraphic;
            });

            const featureLayer = new FeatureLayer({
              id: JSON.stringify({
                id: info.id,
                name: info.name,
                type: "point",
                downloadable: info.downloadable
              }),
              fields: Object.keys(pointData[0]).map(function (field) {
                return {
                  name: field,
                  alias: field,
                  type: "string",
                };
              }),
              geometryType: "point",
              source: features,
              objectIdField: "ObjectID",
              outFields: ["*"],
              popupEnabled: true,
              renderer,
            });

            setMyFeatureLayer(featureLayer);
            map.add(featureLayer);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        return;
      });
  }, [disabled]);

  return null;
};

export default PointLayer;
