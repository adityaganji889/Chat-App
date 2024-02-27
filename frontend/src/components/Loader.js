import React from "react";
import { Spinner } from "react-bootstrap";

function Loader() {
  return (
    <div className="loader">
      <Spinner animation="border" style={{ width: "5rem", height: "5rem" }} variant="dark" />
    </div>
  );
}

export default Loader;