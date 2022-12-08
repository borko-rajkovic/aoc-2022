const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");
const data = input.split("\n").map((line) => line.split("").map((char) => Number(char)));

const rowLength = data.length;

const calculateScenicScore = (row, column, data) => {
    const scenicScore =
    viewingDistanceAbove(row, column, data, data[row][column]) *
    viewingDistanceBellow(row, column, data, data[row][column]) *
    viewingDistanceLeft(row, column, data, data[row][column]) *
    viewingDistanceRight(row, column, data, data[row][column]);
  return scenicScore;
};

const viewingDistanceAbove = (row, column, data, target) => {
  let result = 1;
  for (let currentRow = row - 1; currentRow > 0; currentRow--) {
    if (data[currentRow][column] >= target) {
      return result;
    }
    result++;
  }
  return result;
};

const viewingDistanceBellow = (row, column, data, target) => {
  let result = 1;
  for (let currentRow = row + 1; currentRow < rowLength - 1; currentRow++) {
    if (data[currentRow][column] >= target) {
      return result;
    }
    result++;
  }
  return result;
};

const viewingDistanceLeft = (row, column, data, target) => {
  let result = 1;
  for (let currentColumn = column - 1; currentColumn > 0; currentColumn--) {
    if (data[row][currentColumn] >= target) {
      return result;
    }
    result++;
  }
  return result;
};

const viewingDistanceRight = (row, column, data, target) => {
  let result = 1;
  for (
    let currentColumn = column + 1;
    currentColumn < rowLength - 1;
    currentColumn++
  ) {
    if (data[row][currentColumn] >= target) {
      return result;
    }
    result++;
  }
  return result;
};

let maxScenicScore = 0;

for (let row = 1; row < rowLength - 1; row++) {
  for (let column = 1; column < data[0].length - 1; column++) {
    const scenicScore = calculateScenicScore(row, column, data);
    if (scenicScore > maxScenicScore) {
      maxScenicScore = scenicScore;
    }
  }
}

console.log(maxScenicScore);
