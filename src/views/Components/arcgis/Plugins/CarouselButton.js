import React from "react";
// react-bootstrap components
import { Button } from "react-bootstrap";

const ChartButton = ({ onClick = () => {} }) => {
  return (
    <Button
      className="mr-1 in-map"
      type="button"
      variant="primary"
      onClick={onClick}
    >
      <i className="nc-icon nc-album-2"></i>
    </Button>
  );
};

export default ChartButton;
