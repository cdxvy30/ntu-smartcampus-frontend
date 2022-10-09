import React from "react";
import { Button, Link } from "@material-ui/core";
import { useI18n } from "../../../context/i18n";
import { docUrl } from "config";

const Step1 = React.forwardRef((props, ref) => {
  const { i18n } = useI18n();

  return (
    <div className="wizard-step text-center" ref={ref}>
      <p>{i18n.strings.upload.step1.subtitle}</p>
      <Link href={docUrl} target="_blank">
        <Button>Link</Button>
      </Link>
    </div>
  );
});

export default Step1;
