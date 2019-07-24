import React from "react";
import Star from "./Star";
import SpaceBkg from "./SpaceBkg";
import Svg from "react-native-svg";
import { blankStar } from "../consts/consts.js";

const DetailStarView = ({ starArray, currentStarIndex, isVisible }) => {
  const viewScaleFactor = 20;
  const viewWidth = 200;
  const viewHeight = viewWidth;
  const maxViewRadius = viewWidth * 0.4;
  const viewBottomTextVerticalOffset = -0.05; //percent

  const currentStar =
    currentStarIndex >= 0 ? starArray[currentStarIndex] : blankStar;

  const x = viewWidth / 2;
  const y = viewWidth / 2 + viewBottomTextVerticalOffset * viewWidth;
  const scaledRadius = currentStar.radius * viewScaleFactor;
  const rr = scaledRadius > maxViewRadius ? maxViewRadius : scaledRadius;

  const detailViewStar = {
    x: x,
    y: y,
    radius: rr,
    fill: currentStar.fill,
    name: currentStar.name
  };

  return (
    isVisible && (
      <Svg height={viewHeight} width={viewWidth}>
        <SpaceBkg x="0" y="0" galaxySize={viewWidth} />
        <Star star={detailViewStar} />
        <text
          textAnchor="middle"
          x={viewWidth / 2}
          y={viewWidth * 0.95}
          fill="white"
        >
          {detailViewStar.name}
        </text>
      </Svg>
    )
  );
};

export default DetailStarView;