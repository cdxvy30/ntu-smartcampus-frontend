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

const ShapeLayer = ({
  map,
  disabled,
  info,
  dataList,
  hiddenDataList,
  specificVersion = false,
  color = "orange",
  ...rest
}) => {
  const [myFeatureLayers, setMyFeatureLayers] = useState([]);

  useEffect(() => {
    return function cleanup() {
      map.removeMany(myFeatureLayers);
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      map.removeMany(myFeatureLayers);
      return;
    }

    if (myFeatureLayers.length > 0) map.removeMany(myFeatureLayers);

    fetcher(
      `${BACKEND_API}/api/shp/layer?fileNames=${
        dataList.length !== 0
          ? [info.name]
              .concat(
                dataList
                  .filter((elem) => !hiddenDataList.includes(elem.id))
                  .map((d) => d.name)
              )
              .join(", ")
          : [info.name]
      }${
        specificVersion
          ? "&versions=" +
            (dataList.length !== 0
              ? [info.version]
                  .concat(
                    dataList
                      .filter((elem) => !hiddenDataList.includes(elem.id))
                      .map((d) => d.version)
                  )
                  .join(", ")
              : [info.version])
          : ""
      }`
    )
      .then((data) => {
        loadModules([
          "esri/layers/FeatureLayer",
          "esri/Graphic",
          "esri/layers/support/Field",
        ])
          .then(async ([FeatureLayer, Graphic, Field]) => {
            var sourceGraphics = [];
            const renderer = {
              type: "simple", // autocasts as new SimpleRenderer()
              symbol: {
                type: "simple-fill", // autocasts as new SimpleMarkerSymbol()
                size: 10,
                color: color,
                outline: {
                  // autocasts as new SimpleLineSymbol()
                  width: 0.5,
                  color: "white",
                },
              },
            };

            var layers = data.featureCollection.layers.map(function (layer) {
              var graphics = layer.featureSet.features.map(function (feature) {
                return Graphic.fromJSON(feature);
              });
              sourceGraphics = sourceGraphics.concat(graphics);
              var featureLayer = new FeatureLayer({
                id: JSON.stringify({
                  id: info.id,
                  name: info.name,
                  type: "shp",
                  keyPropertyName: info.keyPropertyName,
                  downloadable: info.downloadable
                }),
                objectIdField: "FID",
                source: graphics,
                fields: layer.layerDefinition.fields.filter(elem => elem.name !== "UID" && elem.name !== "Floor").map(function (field) {
                  return Field.fromJSON({ ...field, type: "string" });
                  // switch (field.type) {
                  //   case "esriFieldTypeOID":
                  //     return Field.fromJSON({ ...field, type: "oid" });
                  //   case "esriFieldTypeInteger":
                  //     return Field.fromJSON({ ...field, type: "integer" });
                  //   case "esriFieldTypeDouble":
                  //     return Field.fromJSON({ ...field, type: "double" });
                  //   case "esriFieldTypeString":
                  //     return Field.fromJSON({ ...field, type: "string" });
                  // }
                }),
                outFields: ["*"],
                popupEnabled: true,
                renderer
              });
              return featureLayer;
              // associate the feature with the popup on click to enable highlight and zoom to
            });
            setMyFeatureLayers(layers);
            map.addMany(layers);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        return;
      });
  }, [disabled, hiddenDataList]);

  return null;
};

export default ShapeLayer;
