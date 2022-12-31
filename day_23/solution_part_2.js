const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

console.time(file_name);

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

const NORTH = 0;
const SOUTH = 1;
const WEST = 2;
const EAST = 3;

const cellMap = input.split("\n").map((x) => x.split(""));

let moveDirections = [NORTH, SOUTH, WEST, EAST];

const rotateMoveDirections = () => {
    moveDirections = [...moveDirections.slice(1), moveDirections[0]];
};

const proposedMoves = {};

const isFree = (cellValue) => cellValue === ".";
const hasElf = (cellValue) => cellValue === "#";

const proposeMoveDirection = (
    moveDirection,
    neighbors = {
        neighbor_NW: { value: ".", coord: { row: 0, column: 0 } },
        neighbor_N: { value: ".", coord: { row: 0, column: 0 } },
        neighbor_NE: { value: ".", coord: { row: 0, column: 0 } },
        neighbor_W: { value: ".", coord: { row: 0, column: 0 } },
        neighbor_E: { value: ".", coord: { row: 0, column: 0 } },
        neighbor_SW: { value: ".", coord: { row: 0, column: 0 } },
        neighbor_S: { value: ".", coord: { row: 0, column: 0 } },
        neighbor_SE: { value: ".", coord: { row: 0, column: 0 } },
    }
) => {
    switch (moveDirection) {
        case NORTH:
            return [
                neighbors.neighbor_N.value,
                neighbors.neighbor_NE.value,
                neighbors.neighbor_NW.value,
            ].every(isFree)
                ? neighbors.neighbor_N.coord
                : null;
        case SOUTH:
            return [
                neighbors.neighbor_S.value,
                neighbors.neighbor_SE.value,
                neighbors.neighbor_SW.value,
            ].every(isFree)
                ? neighbors.neighbor_S.coord
                : null;
        case WEST:
            return [
                neighbors.neighbor_W.value,
                neighbors.neighbor_NW.value,
                neighbors.neighbor_SW.value,
            ].every(isFree)
                ? neighbors.neighbor_W.coord
                : null;
        case EAST:
            return [
                neighbors.neighbor_E.value,
                neighbors.neighbor_NE.value,
                neighbors.neighbor_SE.value,
            ].every(isFree)
                ? neighbors.neighbor_E.coord
                : null;
    }
};

const proposeMoves = () => {
    for (let row = 1; row < cellMap.length - 1; row++) {
        for (let column = 1; column < cellMap[row].length - 1; column++) {
            if (isFree(cellMap[row][column])) {
                continue;
            }

            const neighbor_NW = {
                value: cellMap[row - 1][column - 1],
                coord: { row: row - 1, column: column - 1 },
            };
            const neighbor_N = {
                value: cellMap[row - 1][column + 0],
                coord: { row: row - 1, column: column + 0 },
            };
            const neighbor_NE = {
                value: cellMap[row - 1][column + 1],
                coord: { row: row - 1, column: column + 1 },
            };
            const neighbor_W = {
                value: cellMap[row + 0][column - 1],
                coord: { row: row + 0, column: column - 1 },
            };
            const neighbor_E = {
                value: cellMap[row + 0][column + 1],
                coord: { row: row + 0, column: column + 1 },
            };
            const neighbor_SW = {
                value: cellMap[row + 1][column - 1],
                coord: { row: row + 1, column: column - 1 },
            };
            const neighbor_S = {
                value: cellMap[row + 1][column + 0],
                coord: { row: row + 1, column: column + 0 },
            };
            const neighbor_SE = {
                value: cellMap[row + 1][column + 1],
                coord: { row: row + 1, column: column + 1 },
            };

            const neighbors = {
                neighbor_NW,
                neighbor_N,
                neighbor_NE,
                neighbor_W,
                neighbor_E,
                neighbor_SW,
                neighbor_S,
                neighbor_SE,
            };

            if (
                Object.values(neighbors)
                    .map((neighbor) => neighbor.value)
                    .every(isFree)
            ) {
                continue;
            }

            for (const moveDirection of moveDirections) {
                const proposedMoveDirection = proposeMoveDirection(
                    moveDirection,
                    neighbors
                );
                if (proposedMoveDirection) {
                    if (
                        !proposedMoves[
                            `${proposedMoveDirection.row}_${proposedMoveDirection.column}`
                        ]
                    ) {
                        proposedMoves[
                            `${proposedMoveDirection.row}_${proposedMoveDirection.column}`
                        ] = [];
                    }
                    proposedMoves[
                        `${proposedMoveDirection.row}_${proposedMoveDirection.column}`
                    ].push({ row, column });
                    break;
                }
            }
        }
    }

    rotateMoveDirections();

    console.timeLog(file_name, "propose moves");
};

const makeMoves = () => {
    let hasMadeMove = false;

    for (const proposedMove of Object.entries(proposedMoves)) {
        if (proposedMove[1].length === 1) {
            const [to_row, to_column] = proposedMove[0].split("_");
            const { row, column } = proposedMove[1][0];

            cellMap[row][column] = ".";
            cellMap[to_row][to_column] = "#";

            hasMadeMove = true;
        }
        delete proposedMoves[proposedMove[0]];
    }

    console.timeLog(file_name, "make moves");

    return hasMadeMove;
};

const printMap = () => {
    console.log();
    console.log(cellMap.map((x) => x.join("")).join("\n"));
    console.log();
};

const widenMap = () => {
    const firstRowHasElf = cellMap[0].some(hasElf);
    const lastRowHasElf = cellMap[cellMap.length - 1].some(hasElf);
    const firstColumnHasElf = cellMap.map((x) => x[0]).some(hasElf);
    const lastColumnHasElf = cellMap.map((x) => x[x.length - 1]).some(hasElf);

    if (firstRowHasElf) {
        cellMap.unshift(Array(cellMap[0].length).fill("."));
    }

    if (lastRowHasElf) {
        cellMap.push(Array(cellMap[cellMap.length - 1].length).fill("."));
    }

    if (firstColumnHasElf) {
        cellMap.forEach((row) => {
            row.unshift(".");
        });
    }

    if (lastColumnHasElf) {
        cellMap.forEach((row) => {
            row.push(".");
        });
    }

    console.timeLog(file_name, "widen map");
};

const runOneRound = () => {
    widenMap();
    proposeMoves();
    const hasMadeMove = makeMoves();
    printMap();
    return hasMadeMove;
};

printMap();

let numberOfRounds = 0;

while (runOneRound()) {
    numberOfRounds++;
}

console.log(
    `Number of rounds until no move is available: ${numberOfRounds + 1}`
);

console.timeEnd(file_name);
