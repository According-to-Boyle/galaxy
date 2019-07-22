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

function randIndex(array = []) {
  return array[Math.floor(Math.random() * array.length)];
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

module.exports = {
  randInt: randInt,
  randNumber: randNumber,
  randNumberBias: randNumberBias,
  randNumberBiasMin: randNumberBiasMin,
  randNumberBiasMax: randNumberBiasMax,
  randNumberBetaDist: randNumberBetaDist,
  randBeta: randBeta,
  randIndex: randIndex,
  capitalize: capitalize
};
