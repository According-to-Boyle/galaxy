import React, { Component } from "react";
import Svg, { Circle } from "react-native-svg";
import "./App.css";
import { starColorArray, blankStar } from "./consts/consts.js";
import Inputs from "./components/Inputs";
import Star from "./components/Star";
import SpaceBkg from "./components/SpaceBkg";
import DetailStarView from "./components/DetailStarView";
import Button from "./components/Button";
import { randNumber, randIndex, capitalize, probability } from "./util/util.js";
import Faker from "faker";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numStars: Number(2000),
      galaxySize: Number(600),
      galaxyMargin: Number(5),
      dimRad: Number(0.1),
      brightRad: Number(3),
      dimMag: Number(6.5),
      brightMag: Number(-1.0),
      negMagFac: Number(50),
      starFieldArray: [],
      galaxyStarArray: [],
      currentStarIndex: -1,
      spiralType: 6,
      fuzziness: 2,
      galaxyMode: false //starField = 1, galaxy = 2, use enum or js equiv.
    };
  }
  componentDidMount() {
    this.regenStarFieldArray(this.state);
    this.regenGalaxyStarArray(this.state);
  }

  handleGalaxyClick = () => {
    this.regenStarFieldArray(this.state);
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
    this.state.galaxyMode
      ? this.regenGalaxyStarArray({
          ...this.state,
          [event.target.name]: event.target.value
        })
      : this.regenStarFieldArray({
          ...this.state,
          [event.target.name]: event.target.value
        });
  };

  regenGalaxyStarArray = data => {
    this.setState({
      galaxyStarArray: createGalaxyStarArray(
        data,
        this.state.spiralType,
        this.state.numStars
      )
    });
    this.setState({
      currentStarIndex: -1
    });
  };

  regenStarFieldArray = data => {
    this.setState({ starFieldArray: createstarFieldArray(data) });
    this.setState({
      currentStarIndex: -1
    });
  };

  regenStarField = () => {
    this.state.galaxyMode
      ? this.regenGalaxyStarArray(this.state)
      : this.regenStarFieldArray(this.state);
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
      this.state.currentStarIndex === this.state.starFieldArray.length - 1
        ? this.state.starFieldArray.length - 1
        : this.state.currentStarIndex + 1;
    this.setDetailStarIndex(starIndex);
  };
  selectLastStar = () => {
    this.setDetailStarIndex(this.state.starFieldArray.length - 1);
  };

  render() {
    const { ...props } = this.state;
    const { galaxyMode, spiralType, fuzziness } = this.state;
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
          galaxyMode={galaxyMode}
          spiralType={spiralType}
          fuzziness={fuzziness}
          handleStarClick={this.handleStarClick}
        />
        <Inputs {...props} handleChange={this.handleChange} />
      </div>
    );
  }
}

const MainView = ({ galaxyMode, spiralType, handleStarClick, ...props }) => {
  return galaxyMode ? (
    <Galaxy
      {...props}
      galaxyStarArray={props.galaxyStarArray}
      handleStarClick={handleStarClick}
      highlightedStarIndex={props.currentStarIndex}
    />
  ) : (
    <StarField
      {...props}
      starFieldArray={props.starFieldArray}
      handleStarClick={handleStarClick}
      highlightedStarIndex={props.currentStarIndex}
    />
  );
};

const Galaxy = props => {
  const { galaxyStarArray, handleStarClick, galaxySize } = props;
  const drawGalaxyStars = galaxyStarArray.map((star, index) => (
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
      {drawGalaxyStars}
    </Svg>
  );
};

const StarField = ({
  starFieldArray,
  galaxySize,
  highlightedStarIndex,
  handleStarClick
}) => {
  const highlightedStar =
    typeof starFieldArray[highlightedStarIndex] === "undefined"
      ? blankStar
      : starFieldArray[highlightedStarIndex];

  const drawStarField = starFieldArray.map((star, index) => (
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

function createGalaxyStarArray({
  galaxySize,
  numStars,
  dimRad,
  brightRad,
  dimMag,
  brightMag,
  negMagFac,
  fuzziness,
  spiralType
}) {
  const idOffset = galaxySize / 2;

  const modPlusOne = (val, modval) => {
    const retval = val % modval;
    //console.log(`mod ${val} % ${modval} = ${retval}`);
    return retval + 1;
  };

  const floorPlusOne = (val, divisor) => {
    const retval = Math.floor(val / divisor);
    return retval + 1;
  };

  const multiplyVal = (val, multiplier) => {
    const retval = val * multiplier;
    return retval;
  };

  const spiralXCoord = (seed, degree) => {
    const retval = seed * Math.sin((degree * 180) / Math.PI);
    //console.log(` ${seed}  ${degree} = ${retval}`);
    return retval;
  };

  const spiralZCoord = (seed, degree) => {
    const retval = seed * Math.cos((degree * 180) / Math.PI);
    //console.log(` ${seed}  ${degree} = ${retval}`);
    return retval;
  };

  const randJitter = (val, fuzziness) => {
    const retval = probability() * (fuzziness * val) - 0.5 * fuzziness * val;
    //console.log(`${val}, ${fuzziness}, ${retval}`);
    return retval;
  };

  const calcId = (constant, multiplier, offset) => {
    const retVal = constant + multiplier * offset;
    return retVal;
  };

  const add3 = (addend1, addend2, addend3) => {
    const retVal = addend1 + addend2 + addend3;
    //console.log(`${addend1} + ${addend2} + ${addend3} = ${retVal}`);
    return retVal;
  };

  //these are stupid names
  const zip2 = (a1, a2, func) =>
    a1.map((currElement, currIndex) => func(currElement, a2[currIndex]));

  const zip3 = (a1, a2, a3, func) =>
    a1.map((currElement, currIndex) => func(currElement, a2[currIndex], a3));

  const zip3b = (a1, a2, a3, func) =>
    a1.map((currElement, currIndex) =>
      func(currElement, a2[currIndex], a3[currIndex])
    );

  const orderedArray = Array.from(Array(numStars).keys());
  const tmp = orderedArray.map((currElement, index) => floorPlusOne(index, 6));
  const tmp2 = orderedArray.map(currElement => modPlusOne(currElement, 6));
  const degrees = tmp.map(currElement => multiplyVal(currElement, spiralType));
  //const zip = (tmp, degrees) => a1.map((x, i) =>
  const randX = zip2(tmp, degrees, spiralXCoord);
  const randZ = zip2(tmp, degrees, spiralZCoord);
  const tmpDiv10 = tmp.map(currElement => multiplyVal(currElement, 0.1));
  const jitterX = tmpDiv10.map(currElement =>
    randJitter(currElement, fuzziness)
  );
  const jitterZ = tmpDiv10.map(currElement =>
    randJitter(currElement, fuzziness)
  );
  const id = zip3(tmp2, tmp, idOffset, calcId);

  const galaxyX = zip3(randX, jitterX, idOffset, add3);
  const galaxyZ = zip3(randZ, jitterZ, idOffset, add3);
  const index = 1000;

  // console.log(
  //   `${orderedArray[index]}, ${tmp2[index]}, ${tmp[index]}, ${
  //     degrees[index]
  //   }, ${randX[index]}, ${randZ[index]}, ${tmpDiv10[index]},${
  //     jitterX[index]
  //   }, ${jitterZ[index]}, ${id[index]}, ${Math.floor(
  //     galaxyX[index]
  //   )}, ${Math.floor(galaxyZ[index])}`
  // );
  //console.log(galaxyZ);
  const galaxyStar = (orderedArray, x, y) => {
    const radius = starRadius(
      starMagnitude(probability()),
      brightMag,
      brightRad,
      dimMag,
      dimRad,
      negMagFac
    );
    const fill = randIndex(starColorArray);
    const name = capitalize(`${Faker.lorem.word()}${Faker.lorem.word()}`);

    const star = (x, y, radius, fill, name) => {
      return { x, y, radius, fill, name };
    };
    return star(x, y, radius, fill, name);
  };

  const galaxyStarArray = zip3b(orderedArray, galaxyX, galaxyZ, galaxyStar);

  return galaxyStarArray;
  //return [];
}

function createstarFieldArray({
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

  const starFieldArray = protoArray.map(star => ({
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
  return starFieldArray;
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
