import React, { Component } from "react";
import Svg, { Circle, Rect } from "react-native-svg";
import "./App.css";
import InputBox from "./components/InputBox";

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
      numStars: Number(3000),
      galaxySize: Number(700),
      galaxyMargin: Number(5),
      dimRad: Number(0.1),
      brightRad: Number(5),
      dimMag: Number(6.5),
      brightMag: Number(-1.0),
      negMagFac: Number(1.5)
    };
  }

  handleGalaxyClick = event => {
    this.setState({ numStars: Number(this.state.numStars) + 1 });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { ...props } = this.state;
    return (
      <div className="App">
        <Inputs {...props} handleChange={this.handleChange} />
        <Galaxy {...props} handleGalaxyClick={this.handleGalaxyClick} />
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
    const {
      galaxyMargin,
      galaxySize,
      numStars,
      dimRad,
      brightRad,
      dimMag,
      brightMag,
      negMagFac,
      handleGalaxyClick
    } = this.props;
    const mincoord = galaxyMargin;
    const maxcoord = galaxySize - 2 * galaxyMargin;
    const starArray = Array.apply(null, { length: numStars }).map(
      Number.call,
      Number
    );
    const makeStars = starArray.map(starIndex => (
      <Star
        key={starIndex}
        x={randNumber(mincoord, maxcoord)}
        y={randNumber(mincoord, maxcoord)}
        r={starRadius(
          starMagnitude(Math.random()),
          brightMag,
          brightRad,
          dimMag,
          dimRad,
          negMagFac
        )}
        fill={randIndex(fillArray)}
      />
    ));
    return (
      <Svg onClick={handleGalaxyClick} height={galaxySize} width={galaxySize}>
        <SpaceBkg x="0" y="0" galaxySize={galaxySize} />
        {makeStars}
      </Svg>
    );
  }
}

const Star = ({ x = 0, y = 0, r = 0.1, fill = "white" }) => {
  const rr = isNaN(r) ? 0.1 : r;
  return <Circle cx={x} cy={y} r={rr} fill={fill} />;
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

function randInt(min = 0, max = 1) {
  return Number(
    Math.floor(Math.random() * Math.floor(Number(max)) + Number(min))
  );
}

function randNumber(min = 0, max = 1) {
  return Number(Math.random() * Number(max) + Number(min));
}

function randNumberBias(min = 0, max = 1) {
  const beta = randBeta();
  const beta_bias = beta < 0.5 ? 2 * beta : 2 * (1 - beta);
  return beta_bias * Number(max) + Number(min);
}

function randNumberBiasMin(min = 0, max = 1) {
  const beta = randBeta();
  const beta_bias = beta < 0.5 ? 2 * beta : 2 * (1 - beta);
  return beta_bias * Number(max) + Number(min);
}

function randNumberBiasMax(min = 0, max = 1) {
  const beta = randBeta();
  const beta_bias = beta > 0.5 ? 2 * beta - 1 : 2 * (1 - beta) - 1;
  return beta_bias * Number(max) + Number(min);
}

function randNumberBetaDist(min = 0, max = 1, abeta, bbeta) {
  const randNum = Number(Math.random());
  const betaDistNum = betaDist(randNum, Number(abeta), Number(bbeta));
  return betaDistNum * Number(max) + Number(min);
}

function randBeta() {
  const randNum = Number(Math.random());
  return Math.sin((randNum * Math.PI) / 2) ** 2;
}

function betaDist(theta, a, b) {
  const atheta = theta ** (a - 1);
  const btheta = (1 - theta) ** (b - 1);
  return atheta * btheta;
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

function randIndex(array = []) {
  return array[Math.floor(Math.random() * array.length)];
}

export default App;
