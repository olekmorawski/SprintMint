import React from "react";
import Header from "../components/Header";
import Thumbnail from "../components/Thumbnail";

const Marketplace = () => {
  return (
    <>
      <Header />
      <div className="under_header">
        <div className="thumbnail_container">
          <Thumbnail />
          <Thumbnail />
          <Thumbnail />
        </div>
      </div>
    </>
  );
};

export default Marketplace;
