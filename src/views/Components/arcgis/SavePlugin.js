import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  FormLabel,
  Table,
  Modal,
} from "react-bootstrap";
import { loadModules } from "esri-loader";
import "./css/SavePlugin.css";

import { useI18n } from "../../../context/i18n";
import { saveAs } from "file-saver";
import Cookies from "universal-cookie";
import { BACKEND_API } from "config";
const cookies = new Cookies();
const axios = require("axios").default;
const qs = require("querystring");

const graphicsToGeoJson = (graphics) => {
  let converted = {};
  converted.type = "FeatureCollection";
  converted.features = graphics.map((g) => {
    var j = g.toJSON();

    // console.log(j.geometry)
    if (j.geometry.rings) {
      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: j.geometry.rings,
        },
        properties: j.attributes,
      };
    } else if (j.geometry.paths) {
      return {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: j.geometry.paths,
        },
        properties: j.attributes,
      };
    } else if (j.geometry.points) {
      return {
        type: "Feature",
        geometry: {
          type: "MultiPoint",
          coordinates: j.geometry.points,
        },
        properties: j.attributes,
      };
    } else if (j.geometry.x && j.geometry.y) {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [j.geometry.x, j.geometry.y],
        },
        properties: j.attributes,
      };
    } else {
      return {};
    }
  });
  return converted;
};

const Setting = ({ map, view, excludeDataList, ...rest }) => {
  const { i18n } = useI18n();
  const [serviceName, setServiceName] = useState("");

  const overlayRef = useRef(null);
  const okRef = useRef(null);

  const statusMessage = (head, info) => {
    document
      .getElementById("saveWebMap")
      .classList.remove("esri-button--secondary");
    document.getElementById("saveWebMap").disabled = false;
    document.getElementById("head").innerHTML = head;
    document.getElementById("info").innerHTML = info;
    overlayRef.current.style.visibility = "visible";
  };

  useEffect(() => {
    view.ui.add("sidebarDiv", "bottom-right");
  }, [map]);

  return (
    <div>
      <div id="sidebarDiv" className="esri-widget">
        <h4 className="esri-heading">
          {i18n.strings.dashboard.arcGisViewer.plugin.save.title}
        </h4>
        <input
          id="webMapTitle"
          type="text"
          class="esri-input"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder={
            i18n.strings.dashboard.arcGisViewer.plugin.save.placeholder
          }
        />
        <br />
        <br />
        <button
          id="saveWebMap"
          className="esri-button"
          onClick={() => {
            if (serviceName === "") return;

            setTimeout(() => {
              try {
                let confirmBtn = document
                  .getElementsByClassName("esri-identity-form__group")[3]
                  .getElementsByClassName("esri-button")[0];

                confirmBtn.addEventListener("click", () => {
                  const _username = document
                    .getElementsByClassName("esri-identity-form__group")[1]
                    .getElementsByClassName("esri-input")[0].value;
                  const _password = document
                    .getElementsByClassName("esri-identity-form__group")[2]
                    .getElementsByClassName("esri-input")[0].value;
                  console.log(_username, _password);
                  localStorage.setItem("arcgisUser", _username);
                  localStorage.setItem("arcgisPassword", _password);
                });
              } catch (err) {
                console.log(err);
              }
            }, 3000);

            loadModules(["esri/portal/Portal"])
              .then(async ([Portal]) => {
                var portal = new Portal({
                  authMode: "immediate",
                });
                portal
                  .load()
                  .then(() => {
                    if (
                      localStorage.getItem("arcgisUser") === "" ||
                      localStorage.getItem("arcgisPassword") === ""
                    )
                      return;

                    console.log(portal);
                    console.log(serviceName);

                    let hasDownloadable = false;

                    map.allLayers.items.forEach((item, index) => {
                      try {
                        const layerNameObj = JSON.parse(item.id);
                        if (!layerNameObj.downloadable) {
                          hasDownloadable = true;
                        }
                      } catch (e) {
                        return;
                      }
                    });

                    // extract all point layer to geojson
                    let savedFilenames = [];

                    console.log(map.allLayers.items);

                    const convert2shp = () =>
                      Promise.all(
                        map.allLayers.items
                          .filter((item) =>
                            /^[\],:{}\s]*$/.test(
                              item.id
                                .replace(/\\["\\\/bfnrtu]/g, "@")
                                .replace(
                                  /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                                  "]"
                                )
                                .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
                            )
                          )
                          .map(async (item, index) => {
                            console.log(item.id);
                            const layerNameObj = JSON.parse(item.id);

                            return axios
                              .post(
                                "http://ogre.adc4gis.com/convertJson",
                                qs.stringify({
                                  json: JSON.stringify(
                                    graphicsToGeoJson(item.source.items)
                                  ),
                                  forceUTF8: "on",
                                  jsonUrl: "",
                                  convert: "",
                                  skipFailures: "on",
                                }),
                                {
                                  headers: {
                                    "Content-Type":
                                      "application/x-www-form-urlencoded",
                                  },
                                  responseType: "blob",
                                }
                              )
                              .then(async (res) => {
                                savedFilenames.push(layerNameObj.name);
                                // saveAs(res.data, layerNameObj.name);

                                let file = new File(
                                  [res.data],
                                  layerNameObj.name + ".zip",
                                  {
                                    type: "application/zip",
                                  }
                                );
                                return file;
                              });
                          })
                      );

                    convert2shp().then((shapefiles) => {
                      const arcgisPortal = portal.urlKey + ".maps.arcgis.com";
                      var formData = new FormData();
                      formData.append(
                        "arcgisUser",
                        localStorage.getItem("arcgisUser")
                      );
                      formData.append(
                        "arcgisPassword",
                        localStorage.getItem("arcgisPassword")
                      );
                      formData.append("arcgisPortal", arcgisPortal);
                      formData.append("serviceName", serviceName);
                      formData.append("fileNames", savedFilenames.join(","));

                      if (hasDownloadable) {
                        let description = prompt(
                          "有不可下載之檔案，需要管理員審核，請簡述"
                        );
                        console.log(description);

                        axios
                          .post(`${BACKEND_API}/api/publish/apply`, formData, {
                            headers: {
                              Authorization:
                                "Bearer " + cookies.get("sdgs_access_token"),
                              "Content-Type": "multipart/form-data",
                            },
                          })
                          .then(() => {
                            statusMessage(
                              i18n.strings.dashboard.arcGisViewer.plugin.save
                                .title,
                              `<br> ${i18n.strings.dashboard.arcGisViewer.plugin.save.successMessage(
                                serviceName
                              )}`
                            );
                          })
                          .catch(() => {
                            statusMessage("Publish Layers", "<br> Failed ");
                          });
                      } else {
                        shapefiles.forEach((file, index) => {
                          formData.append("shapefiles", file, file.name);
                        });
                        axios
                          .post(`${BACKEND_API}/api/publish`, formData, {
                            headers: {
                              Authorization:
                                "Bearer " + cookies.get("sdgs_access_token"),
                              "Content-Type": "multipart/form-data",
                            },
                          })
                          .then(() => {
                            statusMessage(
                              i18n.strings.dashboard.arcGisViewer.plugin.save
                                .title,
                              `<br> ${i18n.strings.dashboard.arcGisViewer.plugin.save.successMessage(
                                serviceName
                              )}`
                            );
                          })
                          .catch(() => {
                            statusMessage("Publish Layers", "<br> Failed ");
                          });
                      }
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => console.error(err));
          }}
        >
          {i18n.strings.dashboard.arcGisViewer.plugin.save.button}
        </button>
      </div>
      <div id="overlayDiv" class="esri-widget" ref={overlayRef}>
        <h4 class="esri-heading" id="head"></h4>
        <label id="info"></label>
        <br />
        <br />
        <input
          type="button"
          value="OK"
          class="esri-button"
          ref={okRef}
          onClick={() => {
            overlayRef.current.style.visibility = "hidden";
          }}
        />
      </div>
    </div>
  );
};

export default Setting;
