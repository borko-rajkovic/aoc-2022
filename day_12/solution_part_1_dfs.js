const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");
const lineLength = input.split("\n")[0].length + 1;
const memoizedPaths = {};

const getCoordinatesForLetter = (letter) => {
  const letterPosition = new RegExp(letter, "gm").exec(input).index;
  return {
    row: Math.floor(letterPosition / lineLength),
    column: letterPosition % lineLength,
  };
};

const startCoordinates = getCoordinatesForLetter("S");
const endCoordinates = getCoordinatesForLetter("E");
let min = Number.MAX_VALUE;

console.log("startCoordinates", startCoordinates);
console.log("endCoordinates", endCoordinates);

const startCharCode = "a".charCodeAt(0);

const cellMap = input
  .split("\n")
  .map((x) => x.replace("E", "z"))
  .map((x) => x.replace("S", "a"))
  .map((x) => x.split("").map((x) => x.charCodeAt(0) - startCharCode));

const numberOfRows = cellMap.length;
const numberOfColumns = cellMap[0].length;

const getNextPossibleCells = (row, column) => {
  const nextPossibleCells = [];

  if (row - 1 >= 0) {
    nextPossibleCells.push({ row: row - 1, column, direction: "up" });
  }
  if (row + 1 < numberOfRows) {
    nextPossibleCells.push({ row: row + 1, column, direction: "down" });
  }
  if (column - 1 >= 0) {
    nextPossibleCells.push({ row, column: column - 1, direction: "left" });
  }
  if (column + 1 < numberOfColumns) {
    nextPossibleCells.push({ row, column: column + 1, direction: "right" });
  }

  return nextPossibleCells;
};

const traverseCellMap = (
  cell = startCoordinates,
  alreadyVisited = new Set(),
  directions = []
  //   solutions = []
) => {
  if (directions.length + 1 >= min) {
    return [];
  }

  const memoizationKey = `${cell.row}_${cell.column}_${
    cell.direction || "start"
  }`;

  const memoized = memoizedPaths[memoizationKey];

  //   console.log("Check if memoized", memoizationKey, !!memoized);

  // check if memoized
  if (memoized) {
    return memoized;
  }

  //   console.log(`Checking cell ${cell.row} ${cell.column}`);
  const isEndCell =
    cell.row === endCoordinates.row && cell.column === endCoordinates.column;
  if (isEndCell) {
    // console.log(`It's end cell!`);
    // solutions.push({ alreadyVisited, directions });
    if (directions.length < min) {
      min = directions.length;
    }
    // console.log("Min", min);

    // memoize first
    const partialSolution = [[{ cell, direction: "stop" }]];
    memoizedPaths[memoizationKey] = partialSolution;
    return partialSolution;
  }

  // get next cells in all possible directions
  const nextPossibleCells = getNextPossibleCells(cell.row, cell.column);

  // eliminate already visited cells
  const notVisitedCells = nextPossibleCells.filter(
    (x) => !alreadyVisited.has(`${x.row}_${x.column}`)
  );

  // eliminate cells with invalid values
  const validCells = notVisitedCells.filter(
    (notVisitedCell) =>
      cellMap[notVisitedCell.row][notVisitedCell.column] -
        cellMap[cell.row][cell.column] <=
      1
  );

  const partialSolutions = [];

  validCells.forEach((cell) => {
    const newAlreadyVisited = new Set([...alreadyVisited]);
    newAlreadyVisited.add(`${cell.row}_${cell.column}`);
    const newDirections = [...directions];
    const direction = cell.direction;
    newDirections.push(direction);
    const partialSolution = traverseCellMap(
      cell,
      newAlreadyVisited,
      newDirections
      //   solutions
    );
    // console.log("partialSolution", partialSolution);
    const newPartialSolution = partialSolution
      .filter((x) => x.length > 0)
      .map((x) => [{ cell }, ...x]);
    partialSolutions.push(...newPartialSolution);
  });

  memoizedPaths[memoizationKey] = partialSolutions;
  return partialSolutions;
};

const result = traverseCellMap();
result.sort((a, b) => a.length - b.length);

console.log("finished", result[0]);

console.log("memoizedPaths", JSON.stringify(memoizedPaths));
