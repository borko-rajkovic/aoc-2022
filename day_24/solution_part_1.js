const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

console.time(file_name);

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");
const blizzardDirections = "<>^v";

const blizzards = [new Set(), new Set(), new Set(), new Set()];

const cellMap = input.split("\n").map((row) => row.split(""));

for (let row = 1; row < cellMap.length; row++) {
    for (let column = 1; column < cellMap[0].length; column++) {
        if (blizzardDirections.includes(cellMap[row][column])) {
            blizzards[blizzardDirections.indexOf(cellMap[row][column])].add(
                `${row - 1}_${column - 1}`
            );
        }
    }
}

const start = { row: -1, column: cellMap[0].indexOf(".") - 1 };
const queue = [{ time: 0, row: start.row, column: start.column }];
const seen = new Set();
const target = {
    row: cellMap.length - 2,
    column: cellMap[cellMap.length - 1].indexOf(".") - 1,
};

const calculateLCM = (x, y) => {
    return (x * y) / calculateGCD(x, y);
};

const calculateGCD = (x, y) => {
    while (y) {
        const temp = y;
        y = x % y;
        x = temp;
    }
    return x;
};

const rows = cellMap.length - 2;
const columns = cellMap[0].length - 2;

const lcm = calculateLCM(rows, columns);

const getPositiveModulo = (a, b) => {
    if (a % b >= 0) {
        return a % b;
    }

    return ((a % b) + b) % b;
};

const calculateMinutesToTarget = () => {
    while (queue.length > 0) {
        let { time, row: currentRow, column: currentColumn } = queue.shift();

        time += 1;

        for (const deviation of [
            [0, 1],
            [0, -1],
            [-1, 0],
            [1, 0],
            [0, 0],
        ]) {
            const [deviationRow, deviationColumn] = deviation;

            nextRow = currentRow + deviationRow;
            nextColumn = currentColumn + deviationColumn;

            if (nextRow === target.row && nextColumn === target.column) {
                return time;
            }

            if (
                (nextRow < 0 ||
                    nextColumn < 0 ||
                    nextRow >= rows ||
                    nextColumn >= columns) &&
                !(nextRow === -1 && nextColumn === 0)
            ) {
                continue;
            }

            let fail = false;

            if (!(nextRow === -1 && nextColumn === 0)) {
                for (const [i, testRow, testColumn] of [
                    [0, 0, -1],
                    [1, 0, 1],
                    [2, -1, 0],
                    [3, 1, 0],
                ]) {
                    if (
                        blizzards[i].has(
                            `${getPositiveModulo(
                                nextRow - testRow * time,
                                rows
                            )}_${getPositiveModulo(
                                nextColumn - testColumn * time,
                                columns
                            )}`
                        )
                    ) {
                        fail = true;
                        break;
                    }
                }
            }

            if (!fail) {
                const key = `${nextRow}_${nextColumn}_${time % lcm}`;

                if (seen.has(key)) {
                    continue;
                }

                seen.add(key);
                queue.push({ time, row: nextRow, column: nextColumn });
            }
        }
    }
};

console.log(calculateMinutesToTarget());
