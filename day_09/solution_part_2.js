const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");
const mapLimits = { minCol: 0, maxCol: 0, minRow: 0, maxRow: 0 };
let map = [];
const startCell = { row: 0, column: 0 };
const headCell = { row: 0, column: 0 };
const walkedCells = new Set();
const tailCells = [
  { row: 0, column: 0 },
  { row: 0, column: 0 },
  { row: 0, column: 0 },
  { row: 0, column: 0 },
  { row: 0, column: 0 },
  { row: 0, column: 0 },
  { row: 0, column: 0 },
  { row: 0, column: 0 },
  { row: 0, column: 0 },
];

const steps = input
  .split("\n")
  .map((x) => x.split(" "))
  .map((x) => ({ direction: x[0], steps: Number(x[1]) }));

const updateMapLimits = () => {
  mapLimits.minCol = Math.min(mapLimits.minCol, headCell.column);
  mapLimits.maxCol = Math.max(mapLimits.maxCol, headCell.column);
  mapLimits.minRow = Math.min(mapLimits.minRow, headCell.row);
  mapLimits.maxRow = Math.max(mapLimits.maxRow, headCell.row);
};

const updateTailMember = (parent, child) => {
  const columnDiff = parent.column - child.column;
  const rowDiff = parent.row - child.row;

  const absColDiff = Math.abs(columnDiff);
  const absRowDiff = Math.abs(rowDiff);

  if (absColDiff === 0 && absRowDiff > 1) {
    // console.log("should move row");
    child.row += rowDiff < 0 ? -1 : 1;
  } else if (absRowDiff === 0 && absColDiff > 1) {
    // console.log("should move column");
    child.column += columnDiff < 0 ? -1 : 1;
  } else if (absRowDiff > 1 || absColDiff > 1) {
    // console.log("should move diagonal");
    child.column += columnDiff < 0 ? -1 : 1;
    child.row += rowDiff < 0 ? -1 : 1;
  } else if (absRowDiff === 0 && absColDiff === 0) {
    // console.log("overlap");
  } else {
    // console.log("touching");
  }
};

const updateTail = () => {
  updateTailMember(headCell, tailCells[0]);
  for (let i = 1; i < 9; i++) {
    updateTailMember(tailCells[i - 1], tailCells[i]);
  }

  walkedCells.add(tailCells[8].column + "_" + tailCells[8].row);
};

const move = (step) => {
  // console.log(step);

  if (step.steps <= 1) {
    switch (step.direction) {
      case "R":
        headCell.row += step.steps;
        break;
      case "D":
        headCell.column -= step.steps;
        break;
      case "U":
        headCell.column += step.steps;
        break;
      case "L":
        headCell.row -= step.steps;
        break;
    }

    updateTail();
    updateMapLimits();

    // console.log(headCell, mapLimits);

    return;
  }

  for (let i = 0; i < step.steps; i++) {
    move(Object.assign({}, step, { steps: 1 }));

    renderMap();
    renderStart();
    renderT();
    renderH();
    drawMap();
  }
};

const renderMap = () => {
  const width = mapLimits.maxCol - mapLimits.minCol + 1;
  const height = mapLimits.maxRow - mapLimits.minRow + 1;

  map = [];

  for (let i = 0; i < width; i++) {
    map.push(Array(height).fill("."));
  }
};

const renderStart = () => {
  map[mapLimits.maxCol - startCell.row][-mapLimits.minRow + startCell.column] =
    "s";
};

const renderT = () => {
  for (let i = 0; i < tailCells.length; i++) {
    map[mapLimits.maxCol - tailCells[i].column][
      -mapLimits.minRow + tailCells[i].row
    ] = i + 1;
  }
};

const renderH = () => {
  map[mapLimits.maxCol - headCell.column][-mapLimits.minRow + headCell.row] =
    "H";
};

const drawMap = () => {
  // console.log(map.map((x) => x.join("")).join("\n"));
  // console.log("==========");
};

steps.unshift({ direction: "S", steps: 0 });

console.log("s");
console.log("==========");
for (const step of steps.slice(0)) {
  move(step);
}

console.log(walkedCells.size);
