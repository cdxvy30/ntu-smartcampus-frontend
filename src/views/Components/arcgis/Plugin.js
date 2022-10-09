import { useState, useEffect } from "react";
import ChartButton from "./Plugins/ChartButton";
import Chart from "./Plugins/Chart";
import CarouselButton from "./Plugins/CarouselButton";
import Carousel from "./Plugins/Carousel";
import FileManagerButton from "./Plugins/FileManagerButton";
import FileManager from "./Plugins/FileManager";
import { loadModules } from "esri-loader";

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

const chartItems = [
  {
    title: "BAT_V",
    unit: "V",
    color: "#00008b",
  },
  {
    title: "BAT_A",
    unit: "mA",
    color: "#008b8b",
  },
  {
    title: "s_w0",
    unit: "^{m}/_{s}",
    color: "#5c5c5c",
  },
  {
    title: "s_d0",
    unit: "^{\\mu g}/_{m{3}}",
    color: "#006400",
  },
  {
    title: "s_d1",
    unit: "^{\\mu g}/_{m{3}}",
    color: "#bdb76b",
  },
  {
    title: "s_d2",
    unit: "^{\\mu g}/_{m{3}}",
    color: "#8b008b",
  },
  {
    title: "s_h4",
    unit: "\\%",
    color: "#556b2f",
  },
  {
    title: "s_l0",
    unit: "Lux",
    color: "#ff8c00",
  },
  {
    title: "s_s0L",
    unit: "dB_{A}",
    color: "#9932cc",
  },
  {
    title: "s_t4",
    unit: "^{\\circ}C",
    color: "#8b0000",
  },
];

const isImageFile = (fileName) => {
  switch (fileName.split(".").pop()) {
    case "jpg":
      return true;
    case "jpeg":
      return true;
    case "png":
      return true;
    default:
      return false;
  }
};

const Setting = ({ map, view, ...rest }) => {
  const [graphic, setGraphic] = useState(null);
  const [hasChart, setHasChart] = useState(false);
  const [pluginManager, setPluginManager] = useState({
    chart: {
      show: false,
    },
    carousel: {
      show: false,
    },
    fileManager: {
      show: false,
    },
  });

  const { data: commonFilesList, error: commonFilesListError } = useSWR(
    `${BACKEND_API}/api/shp/common/list`,
    fetcher,
    { refreshInterval: 600000 }
  );
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!graphic || !commonFilesList) return;

    try {
      const layerNameObj = JSON.parse(graphic.layer.id);
      if (layerNameObj.type === "sensor") {
        setHasChart(true);
      }

      if (layerNameObj.type !== "shp") return;

      // 處理大小寫問題
      

      const _files = commonFilesList.filter(
        (elem) => {
          if (String(elem["shapefile-id"]) !== String(layerNameObj.id)) return false;
          let match = false;
          const target = elem["key-property-value"];
          Object.keys(graphic.attributes).filter(key => key.toString().toLowerCase() === layerNameObj.keyPropertyName.toString().toLowerCase())
          .map(key => {
            if (graphic.attributes[key] === target) match = true;
          })
          return match;
        }
      );
      setFiles(_files);
      const _images = _files.filter((elem) => isImageFile(elem.name));
      setImages(_images);
    } catch (err) {
      console.log(err);
    }
  }, [graphic]);

  useEffect(() => {
    loadModules(["esri/core/watchUtils"])
      .then(async ([watchUtils]) => {
        view.on("click", function (event) {
          view.hitTest(event).then((response) => {
            if (response.results.length) {
              const _ = response.results[0].graphic;
              setGraphic(_);
              console.log(response.results[0].graphic)
            } else {
              setGraphic(null);
              setHasChart(false);
              return;
            }
          });
        });
        watchUtils.whenTrue(view.popup, "visible", function () {
          watchUtils.whenFalseOnce(view.popup, "visible", function () {
            setGraphic(null);
            setHasChart(false);
          });
        });
      })
      .catch((err) => console.error(err));
  }, [map]);

  if (!graphic) return <></>;

  return (
    <>
      <div className="plugins-in-map">
        {hasChart && (
          <div>
            <ChartButton
              onClick={() =>
                setPluginManager((prevManager) => {
                  return {
                    ...prevManager,
                    chart: {
                      show: true,
                    },
                  };
                })
              }
            />
            <Chart
              show={pluginManager.chart.show}
              onHide={() =>
                setPluginManager((prevManager) => {
                  return {
                    ...prevManager,
                    chart: {
                      show: false,
                    },
                  };
                })
              }
              info={graphic.attributes}
              chartItems={chartItems}
            />
          </div>
        )}
        {images.length > 0 && (
          <div>
            <CarouselButton
              onClick={() =>
                setPluginManager((prevManager) => {
                  return {
                    ...prevManager,
                    carousel: {
                      show: true,
                    },
                  };
                })
              }
            />
            <Carousel
              show={pluginManager.carousel.show}
              onHide={() =>
                setPluginManager((prevManager) => {
                  return {
                    ...prevManager,
                    carousel: {
                      show: false,
                    },
                  };
                })
              }
              src={images}
            />
          </div>
        )}
        {files.length > 0 && (
          <div>
            <FileManagerButton
              onClick={() =>
                setPluginManager((prevManager) => {
                  return {
                    ...prevManager,
                    fileManager: {
                      show: true,
                    },
                  };
                })
              }
            />
            <FileManager
              show={pluginManager.fileManager.show}
              onHide={() =>
                setPluginManager((prevManager) => {
                  return {
                    ...prevManager,
                    fileManager: {
                      show: false,
                    },
                  };
                })
              }
              files={files}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Setting;
