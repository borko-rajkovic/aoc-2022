const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

console.time(file_name);

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

const DIRECTION_RIGHT = 0;
const DIRECTION_DOWN = 1;
const DIRECTION_LEFT = 2;
const DIRECTION_UP = 3;

const [cellMap, instructions] = input.split("\n\n").map((x, i) => {
    if (i === 0) {
        return x;
    }
    return [...x.matchAll(/\d+|[A-Z]/g)]
        .map((x) => x[0])
        .map((x) =>
            isNaN(Number(x))
                ? { type: "rotation", value: x }
                : { type: "steps", value: Number(x) }
        );
});

console.timeLog(file_name, "Parsing file");

const cellMap2DArray = cellMap.split("\n").map((x) => x.split(""));

const rowLeftEdges = {};
const rowRightEdges = {};
const columnUpEdges = {};
const columnDownEdges = {};

const detectEdges = (row, column) => {
    if (
        row === 0 ||
        cellMap2DArray[row - 1].length - 1 < column ||
        cellMap2DArray[row - 1][column] === " "
    ) {
        columnUpEdges[column] = row;
    }

    if (
        row === cellMap2DArray.length - 1 ||
        cellMap2DArray[row + 1].length - 1 < column ||
        cellMap2DArray[row + 1][column] === " "
    ) {
        columnDownEdges[column] = row;
    }

    if (column === 0 || cellMap2DArray[row][column - 1] === " ") {
        rowLeftEdges[row] = column;
    }

    if (
        column === cellMap2DArray[row].length - 1 ||
        cellMap2DArray[row][column + 1] === " "
    ) {
        rowRightEdges[row] = column;
    }
};

for (let row = 0; row < cellMap2DArray.length; row++) {
    for (let column = 0; column < cellMap2DArray[row].length; column++) {
        if (cellMap2DArray[row][column] === " ") {
            continue;
        }

        detectEdges(row, column);
    }
}

console.timeLog(file_name, "Detecting edges");

const newMap = [];

for (let row = 0; row < cellMap2DArray.length; row++) {
    const newRow = [];
    for (let column = 0; column < cellMap2DArray[row].length; column++) {
        const value = cellMap2DArray[row][column];

        if (value === " ") {
            newRow.push({ value });
            continue;
        }

        const nextRight =
            rowRightEdges[row] === column
                ? { row, column: rowLeftEdges[row] }
                : { row, column: column + 1 };
        const nextLeft =
            rowLeftEdges[row] === column
                ? { row, column: rowRightEdges[row] }
                : { row, column: column - 1 };
        const nextUp =
            columnUpEdges[column] === row
                ? { row: columnDownEdges[column], column }
                : { row: row - 1, column };
        const nextDown =
            columnDownEdges[column] === row
                ? { row: columnUpEdges[column], column }
                : { row: row + 1, column };
        newRow.push({
            value,
            row,
            column,
            nextRight,
            nextLeft,
            nextUp,
            nextDown,
        });
    }
    newMap.push(newRow);
}

console.timeLog(file_name, "Connect cells to related cells in all directions");

let currentDirection = DIRECTION_RIGHT;

const changeDirection = (direction) => {
    switch (direction) {
        case "R":
            currentDirection = (currentDirection + 1) % 4;
            break;
        case "L":
            currentDirection =
                currentDirection - 1 === -1 ? 3 : currentDirection - 1;
            break;
    }
};

const startCell = newMap[0].filter((x) => x.value !== " ")[0];

const moveOneStep = () => {
    let nextCell;

    switch (currentDirection) {
        case DIRECTION_RIGHT:
            nextCell = currentCell.nextRight;
            break;
        case DIRECTION_LEFT:
            nextCell = currentCell.nextLeft;
            break;
        case DIRECTION_UP:
            nextCell = currentCell.nextUp;
            break;
        case DIRECTION_DOWN:
            nextCell = currentCell.nextDown;
            break;
    }

    if (newMap[nextCell.row][nextCell.column].value === "#") {
        return false;
    }

    currentCell = newMap[nextCell.row][nextCell.column];
    return true;
};

let currentCell = startCell;

for (const instruction of instructions) {
    if (instruction.type === "rotation") {
        changeDirection(instruction.value);
        continue;
    }

    for (let i = 0; i < instruction.value; i++) {
        const moved = moveOneStep();
        if (!moved) {
            break;
        }
    }
}

console.timeLog(file_name, "Parsing instructions");

const finalRow = currentCell.row + 1;
const finalColumn = currentCell.column + 1;
const finalDirection = currentDirection;

console.log(
    `Final password is 1000 * ${finalRow} + 4 * ${finalColumn} + 0: ${
        finalRow * 1000 + finalColumn * 4 + finalDirection
    }`
);

console.timeEnd(file_name);
