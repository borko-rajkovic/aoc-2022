const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

const removeDuplicatedLines = (text) => {
  return text
    .split("\n")
    .filter((item, index, array) => array.indexOf(item) === index)
    .join("\n");
};

const uniqueLines = removeDuplicatedLines(input);

const definitions = uniqueLines.split("\n").map((x) =>
  x
    .split(" -> ")
    .map((x) => x.split(","))
    .map((x) => ({ column: Number(x[0]), row: Number(x[1]) }))
);

const limits = {
  maxColumn: Math.max(...definitions.flatMap((x) => x).map((x) => x.column)),
  minColumn: Math.min(...definitions.flatMap((x) => x).map((x) => x.column)),
  maxRow: Math.max(...definitions.flatMap((x) => x).map((x) => x.row)),
  minRow: Math.min(...definitions.flatMap((x) => x).map((x) => x.row)),
};

const expandPath = (point1, point2) => {
  const result = [];

  let point1Clone = Object.assign({}, point1);
  let point2Clone = Object.assign({}, point2);

  while (
    point1Clone.column != point2Clone.column ||
    point1Clone.row != point2Clone.row
  ) {
    const newColumn =
      point1Clone.column != point2Clone.column
        ? point1Clone.column +
          (point2Clone.column - point1Clone.column < 0 ? -1 : 1)
        : point1Clone.column;
    const newRow =
      point1Clone.row != point2Clone.row
        ? point1Clone.row + (point2Clone.row - point1Clone.row < 0 ? -1 : 1)
        : point1Clone.row;
    point1Clone.column = newColumn;
    point1Clone.row = newRow;
    result.push({ column: newColumn, row: newRow });
  }

  return result;
};

const expandedDefinitions = definitions
  .map((definition) => {
    const result = [definition[0]];

    for (let i = 0; i < definition.length - 1; i++) {
      result.push(...expandPath(definition[i], definition[i + 1]));
    }

    return result;
  })
  .flatMap((x) => x);

const map = Array(limits.maxRow + 1)
  .fill([])
  .map(() => Array(limits.maxColumn - limits.minColumn + 1 + 2).fill("."));

map[0][500 - limits.minColumn + 1] = "+";

const printMap = () => {
  console.log(map.map((x) => x.join("")).join("\n"));
};

const markAllRocks = () => {
  expandedDefinitions.forEach((x) => {
    map[x.row][x.column - limits.minColumn + 1] = "#";
  });
};

markAllRocks();

const fallSand = (row = 0, column = 500 - limits.minColumn + 1) => {
  if (row === limits.maxRow) {
    console.log("Max row!");
    return false;
  }
  if (map[row + 1][column] === ".") {
    return fallSand(row + 1, column, "down");
  } else if (map[row + 1][column - 1] === ".") {
    return fallSand(row, column - 1, "down");
  } else if (map[row + 1][column + 1] === ".") {
    return fallSand(row, column + 1, "down");
  } else {
    map[row][column] = "o";
    return true;
  }
};

while (fallSand()) {}

printMap();

console.log(map.flatMap((x) => x).filter((x) => x === "o").length);
