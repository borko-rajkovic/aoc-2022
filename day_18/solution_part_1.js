const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

const data = input
  .split("\n")
  .map((x) => x.split(",").map(Number))
  .map((x) => ({ x: x[0], y: x[1], z: x[2] }));

const generateMap = (firstCoordinate, secondCoordinate) => {
  return data.reduce((acc, v) => {
    if (!acc[`${v[firstCoordinate]}_${v[secondCoordinate]}`]) {
      acc[`${v[firstCoordinate]}_${v[secondCoordinate]}`] = [];
    }
    acc[`${v[firstCoordinate]}_${v[secondCoordinate]}`].push(v);
    return acc;
  }, {});
};

const xyMap = generateMap("x", "y");
const xzMap = generateMap("x", "z");
const yzMap = generateMap("y", "z");

const xyOverlaps = Object.entries(xyMap).filter((entry) => entry[1].length > 1);
const xzOverlaps = Object.entries(xzMap).filter((entry) => entry[1].length > 1);
const yzOverlaps = Object.entries(yzMap).filter((entry) => entry[1].length > 1);

const calculateOverlapingSumsForMap = (map, nonCommonAxis) => {
  map.forEach((overlap) => {
    const overlapSum = overlap[1]
      .map((x) => x[nonCommonAxis])
      .sort((a, b) => a - b)
      .reduce(
        (acc, v) => {
          if (v - acc.lastValue === 1) {
            acc.totalSum++;
          }
          acc.lastValue = v;
          return acc;
        },
        { lastValue: -10, totalSum: 0 }
      ).totalSum;

    totalOverlapSum += overlapSum;
  });
};

let totalOverlapSum = 0;

calculateOverlapingSumsForMap(xyOverlaps, "z");
calculateOverlapingSumsForMap(xzOverlaps, "y");
calculateOverlapingSumsForMap(yzOverlaps, "x");

const result = data.length * 6 - totalOverlapSum * 2;

console.log(result);
