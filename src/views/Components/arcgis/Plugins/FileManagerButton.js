import React from "react";
// react-bootstrap components
import { Button } from "react-bootstrap";

const FileManagerButton = ({ onClick = () => {} }) => {
  return (
    <Button
      className="mr-1 in-map"
      type="button"
      variant="primary"
      onClick={onClick}
    >
      <i className="nc-icon nc-single-copy-04"></i>
    </Button>
  );
};

export default FileManagerButton;
