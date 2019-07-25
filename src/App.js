import React, { Component } from "react";
import Svg, { Circle } from "react-native-svg";
import "./App.css";
import { starColorArray, blankStar } from "./consts/consts.js";
import Inputs from "./components/Inputs";
import Star from "./components/Star";
import SpaceBkg from "./components/SpaceBkg";
import DetailStarView from "./components/DetailStarView";
import Button from "./components/Button";
import { randNumber, randIndex, capitalize } from "./util/util.js";
import Faker from "faker";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numStars: Number(2000),
      galaxySize: Number(500),
      galaxyMargin: Number(5),
      dimRad: Number(0.1),
      brightRad: Number(3),
      dimMag: Number(6.5),
      brightMag: Number(-1.0),
      negMagFac: Number(50),
      starArray: [],
      currentStarIndex: -1,
      galaxyMode: false //starField = 1, galaxy = 2, use enum or js equiv.
    };
  }
  componentDidMount() {
    this.regenStarArray(this.state);
  }

  handleGalaxyClick = () => {
    this.regenStarArray(this.state);
  };

  handleStarClick = e => {
    const target = e.target;

    e.preventDefault();

    const index = target.getAttribute("index");
    this.setDetailStarIndex(index);
    // target.setAttribute("fill", fill);
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
    //remember, setState is async. So we need to actually replace event.target.name's value and pass it to an update function
    this.regenStarArray({
      ...this.state,
      [event.target.name]: event.target.value
    });
  };

  regenStarArray = data => {
    this.setState({ starArray: createStarArray(data) });
    this.setState({
      currentStarIndex: -1
    });
  };

  regenStarField = () => {
    this.regenStarArray(this.state);
  };

  toggleGalaxyMode = () => {
    this.setState({ galaxyMode: !this.state.galaxyMode });
  };

  setDetailStarIndex = index => {
    this.setState({ currentStarIndex: Number(index) });
  };

  selectFirstStar = () => {
    this.setDetailStarIndex(0);
  };
  selectPreviousStar = () => {
    const starIndex =
      this.state.currentStarIndex === 0 ? 0 : this.state.currentStarIndex - 1;
    this.setDetailStarIndex(starIndex);
  };
  selectNextStar = () => {
    const starIndex =
      this.state.currentStarIndex === this.state.starArray.length - 1
        ? this.state.starArray.length - 1
        : this.state.currentStarIndex + 1;
    this.setDetailStarIndex(starIndex);
  };
  selectLastStar = () => {
    this.setDetailStarIndex(this.state.starArray.length - 1);
  };

  render() {
    const { ...props } = this.state;
    const detailViewIsVisble =
      !props.galaxyMode && props.currentStarIndex >= 0 ? true : false;
    return (
      <div className="App">
        <a href="https://github.com/jmbjr/galaxy">GitHub repo</a>
        <br />
        <Button
          content="Regenerate Star Field"
          variant="light blue"
          onClick={this.regenStarField}
        />
        <Button
          content="Toggle Galaxy Mode"
          variant="red"
          onClick={this.toggleGalaxyMode}
        />
        <br />
        <Button content="|<<" variant="green" onClick={this.selectFirstStar} />
        <Button content="<" variant="green" onClick={this.selectPreviousStar} />
        <Button content=">" variant="green" onClick={this.selectNextStar} />
        <Button content=">>|" variant="green" onClick={this.selectLastStar} />
        <br />
        <DetailStarView {...props} isVisible={detailViewIsVisble} />
        <MainView
          {...props}
          galaxyMode={this.state.galaxyMode}
          handleStarClick={this.handleStarClick}
        />
        <Inputs {...props} handleChange={this.handleChange} />
      </div>
    );
  }
}

const MainView = ({ galaxyMode, handleStarClick, ...props }) => {
  return galaxyMode ? (
    <div> Galaxy View Coming Soon!</div>
  ) : (
    <StarField
      {...props}
      starArray={props.starArray}
      handleStarClick={handleStarClick}
      highlightedStarIndex={props.currentStarIndex}
    />
  );
};

const Galaxy = props => {
  const { starArray, handleStarClick } = props;
  const drawGalaxyStars = starArray.map((star, index) => (
    <Star
      key={index}
      star={star}
      handleStarClick={handleStarClick}
      index={index}
    />
  ));
  return (
    <Svg height={this.props.galaxySize} width={props.galaxySize}>
      <SpaceBkg x="0" y="0" galaxySize={props.galaxySize} />
      {drawGalaxyStars}
    </Svg>
  );
};

const StarField = ({
  starArray,
  galaxySize,
  highlightedStarIndex,
  handleStarClick
}) => {
  const highlightedStar =
    typeof starArray[highlightedStarIndex] === "undefined"
      ? blankStar
      : starArray[highlightedStarIndex];

  const drawStarField = starArray.map((star, index) => (
    <Star
      key={index}
      star={star}
      handleStarClick={handleStarClick}
      index={index}
    />
  ));
  return (
    <Svg height={galaxySize} width={galaxySize}>
      <SpaceBkg x="0" y="0" galaxySize={galaxySize} />
      {drawStarField}
      <HighlightedStar
        key={highlightedStarIndex}
        star={highlightedStar}
        handleStarClick={handleStarClick}
      />
    </Svg>
  );
};

const HighlightedStar = ({ star }) => {
  const highlightRadiusSpacing = 5;
  const highlightStrokeWidth = 1.5;
  const highlightStrokeColor = "gold";
  const highlightRadius = star.radius + highlightRadiusSpacing;

  return star.radius < 0 ? (
    false
  ) : (
    <Circle
      cx={star.x}
      cy={star.y}
      r={highlightRadius}
      strokeWidth={highlightStrokeWidth}
      stroke={highlightStrokeColor}
      fill="none"
    />
  );
};

function createStarArray({
  galaxyMargin,
  galaxySize,
  numStars,
  dimRad,
  brightRad,
  dimMag,
  brightMag,
  negMagFac
}) {
  const mincoord = galaxyMargin;
  const maxcoord = galaxySize - 2 * galaxyMargin;
  const protoArray = Array.apply(null, { length: numStars }).map(
    Number.call,
    Number
  );
  const probability = () => {
    return Math.random();
  };
  const starArray = protoArray.map(star => ({
    ...star,
    x: randNumber(mincoord, maxcoord),
    y: randNumber(mincoord, maxcoord),
    radius: starRadius(
      starMagnitude(probability()),
      brightMag,
      brightRad,
      dimMag,
      dimRad,
      negMagFac
    ),
    fill: randIndex(starColorArray),
    name: capitalize(`${Faker.lorem.word()}${Faker.lorem.word()}`)
  }));
  return starArray;
}

function starMagnitude(probability) {
  const A = 0.775;
  const B = 6.3618;
  const retMag = A * Math.log(probability) + B;
  return retMag;
}

function starRadius(
  magnitude,
  brightMag,
  brightRad,
  dimMag,
  dimRad,
  negMagFac = 1.0
) {
  const mslope = (brightRad - dimRad) / (brightMag - dimMag);
  const b = brightRad - mslope * brightMag;
  const retRadius = mslope * magnitude + b;
  const facRetRad = retRadius < 0 ? retRadius * negMagFac : retRadius;
  return facRetRad > brightRad
    ? brightRad * facRetRad
    : facRetRad < dimRad
    ? dimRad
    : facRetRad;
}

export default App;
