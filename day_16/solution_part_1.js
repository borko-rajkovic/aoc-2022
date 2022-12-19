const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");
const maxMinutes = 30;

const data = input
  .split("\n")
  .map((x) => /Valve ([A-Z]+) .* rate=(\d+);.*valves? (.*)/g.exec(x))
  .map((x) => ({
    valve: x[1],
    flowRate: Number(x[2]),
    valves: x[3].split(", "),
  }))
  .reduce((acc, val) => {
    acc[val.valve] = val;
    return acc;
  }, {});

calculateShortestPaths = () => {
  const result = {};

  const valves = Object.keys(data);

  for (const valve of valves) {
    result[valve] = { [valve]: 0 };
    for (const otherValve of valves.filter((v) => v != valve)) {
      result[valve][otherValve] = 10000;
    }
  }

  for (const entry of Object.values(data)) {
    for (const toValve of entry.valves) {
      result[entry.valve][toValve] = 1;
    }
  }

  for (const k of valves) {
    for (const i of valves) {
      for (const j of valves) {
        if (result[i][j] > result[i][k] + result[k][j]) {
          result[i][j] = result[i][k] + result[k][j];
        }
      }
    }
  }

  return result;
};

const shortestPaths = calculateShortestPaths();

const valvesThatAreBroken = Object.values(data)
  .filter((valve) => valve.flowRate === 0)
  .map((x) => x.valve);

const valvesToCheck = Object.values(data)
  .map((x) => x.valve)
  .filter((v) => !valvesThatAreBroken.includes(v));

const bestSequenceWithTotalPressureReleased = {
  sequence: [],
  releasedPressure: 0,
};

const findSequenceWithMostReleasedPressure = (
  visitedValves = [],
  valves = valvesToCheck,
  minutesSoFar = 0,
  releasedPressure = 0
) => {
  for (const valve of valves) {
    const restValves = valves.filter((v) => v != valve);

    const newVisitedValves = [...visitedValves, valve];

    const previousValve =
      visitedValves.length === 0
        ? "AA"
        : visitedValves[visitedValves.length - 1];

    const newMinutesSoFar =
      minutesSoFar + shortestPaths[previousValve][valve] + 1;

    if (newMinutesSoFar >= maxMinutes) {
      continue;
    }

    const newAddedValveTotalReleasePressure =
      (maxMinutes - newMinutesSoFar) * data[valve].flowRate;

    const totalReleasedPressureSoFar =
      releasedPressure + newAddedValveTotalReleasePressure;

    if (
      bestSequenceWithTotalPressureReleased.releasedPressure <
      totalReleasedPressureSoFar
    ) {
      bestSequenceWithTotalPressureReleased.releasedPressure =
        totalReleasedPressureSoFar;
      bestSequenceWithTotalPressureReleased.sequence = [...newVisitedValves];
    }

    if (restValves.length > 0) {
      findSequenceWithMostReleasedPressure(
        newVisitedValves,
        restValves,
        newMinutesSoFar,
        totalReleasedPressureSoFar
      );
    }
  }
};

findSequenceWithMostReleasedPressure();

console.log(bestSequenceWithTotalPressureReleased);
