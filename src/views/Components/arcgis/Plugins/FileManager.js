// react-bootstrap components
import { Button, Card, Modal } from "react-bootstrap";

// core components
import ReactTable from "components/ReactTable/ReactTable.js";

import { useI18n } from "context/i18n";

import Cookies from "universal-cookie";
import { BACKEND_API } from "config";
const cookies = new Cookies();
const axios = require("axios").default;

const FileManager = ({ show, onHide, files, ...rest }) => {
  const { i18n } = useI18n();

  return (
    <Modal className="modal-primary" show={show} onHide={onHide}>
      <Modal.Body>
        <Card>
          <Card.Body>
            <ReactTable
              data={files.map((d) => ({
                name: d.name,
                actions: (
                  // we've added some custom button actions
                  <div className="actions-right">
                    {/* use this button to add a like kind of action */}
                    <Button
                      onClick={() => {
                        axios
                          .get(
                            `${BACKEND_API}/api/shp/common/download/${d.name}/${d.version}`,
                            {
                              headers: {
                                Authorization:
                                  "Bearer " + cookies.get("sdgs_access_token"),
                              },
                              responseType: "blob",
                            }
                          )
                          .then((res) => {
                            saveAs(res.data, d.name);
                          });
                      }}
                      variant="info"
                      size="sm"
                      className="text-info btn-link like"
                    >
                      <i className="fa fa-download" />
                    </Button>{" "}
                  </div>
                ),
              }))}
              columns={[
                {
                  Header:
                    i18n.strings.dashboard.arcGisViewer.plugin.fileManager
                      .nameField,
                  accessor: "name",
                },
                {
                  Header: "Actions",
                  accessor: "actions",
                  sortable: false,
                  filterable: false,
                },
              ]}
              className="-striped -highlight primary-pagination"
            />
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default FileManager;
