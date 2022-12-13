const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");
const lineLength = input.split("\n")[0].length + 1;

const getCoordinatesForLetter = (letter) => {
  const letterPosition = new RegExp(letter, "gm").exec(input).index;
  return {
    row: Math.floor(letterPosition / lineLength),
    column: letterPosition % lineLength,
  };
};

const startCoordinates = getCoordinatesForLetter("S");
const endCoordinates = getCoordinatesForLetter("E");

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

const stack = [
  {
    ...endCoordinates,
    steps: [],
  },
];
const visited = new Set();

const traverseCellMap = () => {
  while (stack.length > 0) {
    const cell = stack.pop();

    const isStartCell =
      cell.row === startCoordinates.row &&
      cell.column === startCoordinates.column;
    if (isStartCell) {
      return cell.steps;
    }

    const nextPossibleCells = getNextPossibleCells(cell.row, cell.column);

    const validCells = nextPossibleCells.filter(
      (nextPossibleCell) =>
        cellMap[cell.row][cell.column] -
          cellMap[nextPossibleCell.row][nextPossibleCell.column] <=
        1
    );

    validCells.forEach((validCell) => {
      const newSteps = [...cell.steps];
      const step = { row: validCell.row, column: validCell.column };
      newSteps.push(step);

      const entry = {
        ...validCell,
        steps: newSteps,
      };

      if (!visited.has(`${validCell.row}_${validCell.column}`)) {
        visited.add(`${validCell.row}_${validCell.column}`);
        stack.unshift(entry);
      }
    });
  }
};

const result = traverseCellMap();

console.log("finished", result.length);
