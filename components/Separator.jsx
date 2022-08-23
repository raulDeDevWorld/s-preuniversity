import React from "react";
import _ from "lodash";

export default function Separator(props) {
  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        transform: `rotate(${props.turns}turn)`
      }}
    >
      <div style={props.style} />
    </div>
  );
}