import React from "react";
import { Circle } from "react-native-svg";

const Star = ({ star, handleStarClick, index }) => {
  const rr = isNaN(star.radius) ? 0.1 : star.radius;
  return (
    <Circle
      cx={star.x}
      cy={star.y}
      r={rr}
      fill={star.fill}
      onClick={handleStarClick}
      name={star.name}
      index={index}
    />
  );
};

export default Star;
