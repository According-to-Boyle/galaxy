import React, { Component } from "react";
import Svg, { Circle, Rect } from "react-native-svg";
import "./App.css";
import InputBox from "./components/InputBox";
import { randNumber, randIndex } from "./util/util.js";

const fillArray = [
  "aqua",
  "coral",
  "red",
  "blue",
  "green",
  "yellow",
  "gold",
  "khaki",
  "maroon",
  "orangered",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white",
  "white"
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numStars: Number(2000),
      galaxySize: Number(700),
      galaxyMargin: Number(5),
      dimRad: Number(0.1),
      brightRad: Number(3),
      dimMag: Number(6.5),
      brightMag: Number(-1.0),
      negMagFac: Number(50),
      starArray: []
    };
  }
  componentDidMount() {
    this.regenStarArray(this.state);
  }

  handleGalaxyClick = event => {
    this.regenStarArray(this.state);
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
  };

  render() {
    const { ...props } = this.state;
    return (
      <div className="App">
        <a href="https://github.com/jmbjr/galaxy">GitHub repo</a>
        <Inputs {...props} handleChange={this.handleChange} />
        <Galaxy
          {...props}
          starArray={this.state.starArray}
          handleGalaxyClick={this.handleGalaxyClick}
        />
      </div>
    );
  }
}

const Inputs = ({ handleChange, ...rest }) => {
  const makeInputs = Object.entries(rest).map(input => (
    <InputBox
      key={input[0]}
      className="center-block"
      value={input[1]}
      name={input[0]}
      handleChange={handleChange}
    >
      {input[0]}
    </InputBox>
  ));
  return <React.Fragment>{makeInputs}</React.Fragment>;
};

class Galaxy extends Component {
  render() {
    const drawStars = this.props.starArray.map((star, index) => (
      <Star key={index} star={star} />
    ));
    return (
      <Svg
        onClick={this.props.handleGalaxyClick}
        height={this.props.galaxySize}
        width={this.props.galaxySize}
      >
        <SpaceBkg x="0" y="0" galaxySize={this.props.galaxySize} />
        {drawStars}
      </Svg>
    );
  }
}

const Star = ({ star }) => {
  const rr = isNaN(star.radius) ? 0.1 : star.radius;
  return <Circle cx={star.x} cy={star.y} r={rr} fill={star.fill} />;
};

const SpaceBkg = ({ x, y, galaxySize, stroke = "black", fill = "black" }) => {
  return (
    <Rect
      x={x}
      y={y}
      width={galaxySize}
      height={galaxySize}
      stroke={stroke}
      fill="black"
    />
  );
};

function createStarArray(data) {
  const {
    galaxyMargin,
    galaxySize,
    numStars,
    dimRad,
    brightRad,
    dimMag,
    brightMag,
    negMagFac
  } = data;

  const mincoord = galaxyMargin;
  const maxcoord = galaxySize - 2 * galaxyMargin;
  const protoArray = Array.apply(null, { length: numStars }).map(
    Number.call,
    Number
  );

  const starArray = protoArray.map(star => ({
    ...star,
    x: randNumber(mincoord, maxcoord),
    y: randNumber(mincoord, maxcoord),
    radius: starRadius(
      starMagnitude(Math.random()),
      brightMag,
      brightRad,
      dimMag,
      dimRad,
      negMagFac
    ),
    fill: randIndex(fillArray)
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
