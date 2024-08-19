"use client";
import React from "react";
import { ColorRing } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <ColorRing
        visible={true}
        height="150"
        width="150"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={[
          "#fde047",
          "#a3e635",
          "#14b8a6",
          "#fde047",
          "#a3e635",
          "#14b8a6",
        ]}
      />
    </div>
  );
};

export default Loading;
