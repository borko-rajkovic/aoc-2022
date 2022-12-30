const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

console.time(file_name);

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

// https://www.youtube.com/watch?v=kktpopXsX2E

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

const changeDirection = (direction) => {
    switch (direction) {
        case "R":
            [rowDirection, columnDirection] = [columnDirection, -rowDirection];
            break;
        case "L":
            [rowDirection, columnDirection] = [-columnDirection, rowDirection];
            break;
    }

    if (rowDirection === -0) {
        rowDirection = 0;
    }

    if (columnDirection === -0) {
        columnDirection = 0;
    }
};

let row = 0;
let column = 0;
let rowDirection = 0;
let columnDirection = 1;

while (cellMap2DArray[row][column] != ".") {
    column += 1;
}

for (const instruction of instructions) {
    if (instruction.type === "rotation") {
        changeDirection(instruction.value);
        continue;
    }

    for (let i = 0; i < instruction.value; i++) {
        const oldRowDirection = rowDirection;
        const oldColumnDirection = columnDirection;

        let nextRow;
        let nextColumn;

        nextRow = row + rowDirection;
        nextColumn = column + columnDirection;

        if (
            nextRow < 0 &&
            50 <= nextColumn &&
            nextColumn < 100 &&
            rowDirection == -1
        ) {
            [rowDirection, columnDirection] = [0, 1];
            [nextRow, nextColumn] = [nextColumn + 100, 0];
        } else if (
            nextColumn < 0 &&
            150 <= nextRow &&
            nextRow < 200 &&
            columnDirection == -1
        ) {
            [rowDirection, columnDirection] = [1, 0];
            [nextRow, nextColumn] = [0, nextRow - 100];
        } else if (
            nextRow < 0 &&
            100 <= nextColumn &&
            nextColumn < 150 &&
            rowDirection == -1
        ) {
            [nextRow, nextColumn] = [199, nextColumn - 100];
        } else if (
            nextRow >= 200 &&
            0 <= nextColumn &&
            nextColumn < 50 &&
            rowDirection == 1
        ) {
            [nextRow, nextColumn] = [0, nextColumn + 100];
        } else if (
            nextColumn >= 150 &&
            0 <= nextRow &&
            nextRow < 50 &&
            columnDirection == 1
        ) {
            columnDirection = -1;
            [nextRow, nextColumn] = [149 - nextRow, 99];
        } else if (
            nextColumn == 100 &&
            100 <= nextRow &&
            nextRow < 150 &&
            columnDirection == 1
        ) {
            columnDirection = -1;
            [nextRow, nextColumn] = [149 - nextRow, 149];
        } else if (
            nextRow == 50 &&
            100 <= nextColumn &&
            nextColumn < 150 &&
            rowDirection == 1
        ) {
            [rowDirection, columnDirection] = [0, -1];
            [nextRow, nextColumn] = [nextColumn - 50, 99];
        } else if (
            nextColumn == 100 &&
            50 <= nextRow &&
            nextRow < 100 &&
            columnDirection == 1
        ) {
            [rowDirection, columnDirection] = [-1, 0];
            [nextRow, nextColumn] = [49, nextRow + 50];
        } else if (
            nextRow == 150 &&
            50 <= nextColumn &&
            nextColumn < 100 &&
            rowDirection == 1
        ) {
            [rowDirection, columnDirection] = [0, -1];
            [nextRow, nextColumn] = [nextColumn + 100, 49];
        } else if (
            nextColumn == 50 &&
            150 <= nextRow &&
            nextRow < 200 &&
            columnDirection == 1
        ) {
            [rowDirection, columnDirection] = [-1, 0];
            [nextRow, nextColumn] = [149, nextRow - 100];
        } else if (
            nextRow == 99 &&
            0 <= nextColumn &&
            nextColumn < 50 &&
            rowDirection == -1
        ) {
            [rowDirection, columnDirection] = [0, 1];
            [nextRow, nextColumn] = [nextColumn + 50, 50];
        } else if (
            nextColumn == 49 &&
            50 <= nextRow &&
            nextRow < 100 &&
            columnDirection == -1
        ) {
            [rowDirection, columnDirection] = [1, 0];
            [nextRow, nextColumn] = [100, nextRow - 50];
        } else if (
            nextColumn == 49 &&
            0 <= nextRow &&
            nextRow < 50 &&
            columnDirection == -1
        ) {
            columnDirection = 1;
            [nextRow, nextColumn] = [149 - nextRow, 0];
        } else if (
            nextColumn < 0 &&
            100 <= nextRow &&
            nextRow < 150 &&
            columnDirection == -1
        ) {
            columnDirection = 1;
            [nextRow, nextColumn] = [149 - nextRow, 50];
        }

        if (cellMap2DArray[nextRow][nextColumn] == "#") {
            rowDirection = oldRowDirection;
            columnDirection = oldColumnDirection;
            break;
        }
        row = nextRow;
        column = nextColumn;
    }
}

console.timeLog(file_name, "Parsing instructions");

let finalDirection;

if (rowDirection == 0) {
    if (columnDirection == 1) {
        finalDirection = 0;
    } else {
        finalDirection = 2;
    }
} else {
    if (rowDirection == 1) {
        finalDirection = 1;
    } else {
        finalDirection = 3;
    }
}

console.log(
    `Final password is 1000 * ${row + 1} + 4 * ${
        column + 1
    } + ${finalDirection}: ${
        (row + 1) * 1000 + (column + 1) * 4 + finalDirection
    }`
);

console.timeEnd(file_name);
