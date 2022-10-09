import { useState, useEffect } from "react";
import { loadModules } from "esri-loader";
import { v4 as uuidv4 } from "uuid";

import { useI18n } from "../../../context/i18n";

const Setting = ({ map, view, ...rest }) => {
  const { lang } = useI18n();

  useEffect(() => {
    loadModules(["esri/intl"])
      .then(async ([intl]) => {
        intl.getLocale();
        intl.setLocale(lang);
      })
      .catch((err) => console.error(err));
  }, [map]);

  return null;
};

export default Setting;
