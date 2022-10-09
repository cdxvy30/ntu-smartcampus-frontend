import React from "react";
import LocalizedStrings from "react-localization";
import { useMemoizedValue } from "./use-memorized-value";
import en from "./i18n-en";
import zh from "./i18n-zh";

const reactI18n = new LocalizedStrings({
  en: { strings: { ...en } },
  zh: { strings: { ...zh } },
  "zh-TW": { strings: { ...zh } },
});

export const I18nContext = React.createContext({
  i18n: reactI18n,
  lang: reactI18n.getLanguage(),
  setLanguage: (lang) => reactI18n.setLanguage(lang),
});

export const useI18n = () => React.useContext(I18nContext);

export const I18nProvider = React.memo(({ children }) => {
  const { i18n } = useI18n();
  const [lang, setLanguage] = React.useState(navigator.language);
  i18n.setLanguage(lang);
  const value = useMemoizedValue({ i18n, lang, setLanguage });
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
});
