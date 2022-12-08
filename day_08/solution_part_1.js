const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");
const data = input
  .split("\n")
  .map((line) => line.split("").map((char) => Number(char)));

const start = new Date();

const rowLength = data.length;

let result = rowLength * 4 - 4;

const isVisible = (row, column, data) => {
  // check if visible from at least one side
  return (
    isVisibleAbove(row, column, data, data[row][column]) ||
    isVisibleBellow(row, column, data, data[row][column]) ||
    isVisibleLeft(row, column, data, data[row][column]) ||
    isVisibleRight(row, column, data, data[row][column])
  );
};

const isVisibleAbove = (row, column, data, target) => {
  for (let currentRow = row - 1; currentRow >= 0; currentRow--) {
    if (data[currentRow][column] >= target) {
      return false;
    }
  }
  return true;
};

const isVisibleBellow = (row, column, data, target) => {
  for (let currentRow = row + 1; currentRow < rowLength; currentRow++) {
    if (data[currentRow][column] >= target) {
      return false;
    }
  }
  return true;
};

const isVisibleLeft = (row, column, data, target) => {
  for (let currentColumn = column - 1; currentColumn >= 0; currentColumn--) {
    if (data[row][currentColumn] >= target) {
      return false;
    }
  }
  return true;
};

const isVisibleRight = (row, column, data, target) => {
  for (let currentColumn = column + 1; currentColumn < rowLength; currentColumn++) {
    if (data[row][currentColumn] >= target) {
      return false;
    }
  }
  return true;
};

for (let row = 1; row < rowLength - 1; row++) {
  for (let column = 1; column < data[0].length - 1; column++) {
    if (isVisible(row, column, data)) {
      result++;
    }
  }
}

console.log(result);
console.log(`Finished in ${new Date() - start}ms`);
