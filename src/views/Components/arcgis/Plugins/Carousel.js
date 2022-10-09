import { useEffect } from "react";
// react-bootstrap components
import { Card, Modal, Carousel } from "react-bootstrap";

import Cookies from "universal-cookie";
import useSWR from "swr";
import { BACKEND_API } from "config";
const cookies = new Cookies();
const axios = require("axios").default;

const dataFetcher = (url, collection, key) => {
  return Promise.all(
    collection.map((c) =>
      fetch(`${url}/${c[key]}`, {
        headers: {
          Authorization: "Bearer " + cookies.get("sdgs_access_token"),
        },
      })
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob))
    )
  );
};

const CarouselModal = ({ show, onHide, src, ...rest }) => {
  const { data: images, error } = useSWR(
    [`${BACKEND_API}/api/shp/common/download`, src, "name"],
    dataFetcher,
    { refreshInterval: 600000 }
  );

  if (!images) return <></>;
  if (error) return <></>;

  return (
    <Modal className="modal-primary" show={show} onHide={onHide}>
      <Modal.Body>
        <Card>
          <Card.Body>
            <Carousel fade>
              {images.map((image, index) => (
                <Carousel.Item>
                  <img className="d-block w-100" src={image} alt={index} />
                </Carousel.Item>
              ))}
            </Carousel>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default CarouselModal;
