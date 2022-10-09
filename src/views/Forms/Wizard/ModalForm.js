import React from "react";
import {
  Button,
  Card,
  Form,
} from "react-bootstrap";
// react component that creates a dropdown menu for selection
import Select from "react-select";
import { useI18n } from "../../../context/i18n";

const ModalForm = ({ typeOptions, column, submit, edit = false }) => {
  const { i18n } = useI18n();
  const [name, setName] = React.useState(column.name);
  const [type, setType] = React.useState(column.type);

  return (
    <Card className="stacked-form">
      <Card.Body>
        <Form action="#" method="#">
          <Form.Group>
            <label>{i18n.strings.upload.step2.columnSection.modal.name}</label>
            <Form.Control
              placeholder={
                i18n.strings.upload.step2.columnSection.modal.namePlaceholder
              }
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <label>
              {i18n.strings.upload.step2.columnSection.modal.format}
            </label>
            <Select
              name="typeSelect"
              value={type}
              options={typeOptions}
              placeholder={
                i18n.strings.upload.step2.columnSection.modal.formatPlaceholder
              }
              onChange={(value) => setType(value)}
            />
          </Form.Group>
        </Form>
      </Card.Body>
      {name !== "" && type !== null && (
        <Card.Footer>
          <Button
            className="btn-fill"
            type="submit"
            variant="info"
            onClick={(event) => {
              event.preventDefault();
              submit({
                name,
                type,
              });
            }}
          >
            {i18n.strings.upload.step2.columnSection.modal.submit}
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
};

export default ModalForm;
