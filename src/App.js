import React, { Component } from "react";
import Svg, { Circle } from "react-native-svg";
import "./App.css";
import InputBox from "./components/InputBox";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spiral_type: 6,
      fuzziness: 2,
      x: 100,
      y: 100,
      r: 20
    };
  }

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
        <Galaxy />
      </div>
    );
  }
}

const Inputs = ({ handleChange, ...rest }) => {
  const makeInputs = Object.entries(rest).map(input => (
    <InputBox
      key={input}
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

const Galaxy = () => {
  const N = 100;
  const maxSize = 1000;
  const margin = 0.05;
  const mincoord = margin * maxSize;
  const maxcoord = (1 - margin) * maxSize;
  const minrad = 10;
  const maxrad = 20;
  const numStars = Array.apply(null, { length: N }).map(Number.call, Number);

  console.log(`${maxSize} ${margin} ${mincoord} ${maxcoord}`);
  const makeStars = numStars.map(starIndex => (
    <Star
      key={starIndex}
      x={randInt(mincoord, maxcoord)}
      y={randInt(mincoord, maxcoord)}
      r={randInt(minrad, maxrad)}
      fill={randFill()}
    />
  ));
  return (
    <Svg height={maxSize} width={maxSize}>
      {makeStars}
    </Svg>
  );
};

const Star = ({ x = 0, y = 0, r = 5, fill = "black" }) => {
  return <Circle cx={x} cy={y} r={r} fill={fill} />;
};

function randInt(min = 1, max = 100) {
  return Math.floor(Math.random() * max) + min;
}

function randFill() {
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
    "orangered"
  ];
  return fillArray[Math.floor(Math.random() * fillArray.length)];
}

export default App;
