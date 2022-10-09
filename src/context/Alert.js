import React from "react";
import { useMemoizedValue } from "./use-memorized-value";
// react component used to create charts
import SweetAlert from "react-bootstrap-sweetalert";

export const AlertContext = React.createContext({
  pop: (title, content, showConfirm, confirmBtnBsStyle) => {},
});

export const useAlert = () => React.useContext(AlertContext);

export const AlertProvider = React.memo(({ children }) => {
  const [alertState, setAlertState] = React.useState(null);

  const pop = (title, content, showConfirm, confirmBtnBsStyle = "info") => {
    if (showConfirm) {
      setAlertState(
        <SweetAlert
          style={{ display: "block", marginTop: "-100px" }}
          title={title}
          onConfirm={() => setAlertState(null)}
          onCancel={() => setAlertState(null)}
          confirmBtnBsStyle={confirmBtnBsStyle}
        >
          {content}
        </SweetAlert>
      );
    } else {
      setAlertState(
        <SweetAlert
          style={{ display: "block", marginTop: "-100px" }}
          title={title}
          showConfirm={false}
        >
          {content}
        </SweetAlert>
      );
    }
  };

  const cancelPop = () => {
    setAlertState(null);
  };

  const value = useMemoizedValue({ pop, cancelPop });
  return (
    <AlertContext.Provider value={value}>
      {alertState}
      {children}
    </AlertContext.Provider>
  );
});
