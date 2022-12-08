const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");
const data = input
  .split("\n")
  .map((line) => line.split("").map((char) => Number(char)));

const getData = () => [...data.map(x => [...x])];

const start = new Date();

const rowLength = data.length;

let result = rowLength * 4 - 4;

/*
 * Instead of checking for each cell in all directions, we could do this:

- traverse each row left->right, marking on each index the highest tree we've seen
- repeat for other directions: right->left, top->bottom, bottom->top
- when checking is tree visible, just check if the highest tree in any four directions
is lower than current one
 
 */

const transpose2dArray = (array) =>
  [...array.map(x => [...x])][0].map((_, colIndex) => array.map((row) => row[colIndex]));

const calculateHeights = (data) => {
  return data
    .map((x) =>
      x.reduce(
        (acc, val) => {
          acc.values.push(acc.max);
          if (val > acc.max) {
            acc.max = val;
          }
          return acc;
        },
        { max: 0, values: [] }
      )
    )
    .map((x) => x.values);
};

const calculateHeightsInDirections = () => {
  return {
    toBottom: transpose2dArray(
      calculateHeights(transpose2dArray(getData()).map((x) => x.reverse())).map(
        (x) => x.reverse()
      )
    ),
    toLeft: calculateHeights(getData()),
    toRight: calculateHeights(getData().map((x) => x.reverse())).map((x) =>
      x.reverse()
    ),
    toTop: transpose2dArray(calculateHeights(transpose2dArray(getData()))),
  };
};

const isVisible = (row, column, data) => {
  // check if visible from at least one side
  const target = data[row][column];

  return (
    heightsInDirections.toTop[row][column] < target ||
    heightsInDirections.toBottom[row][column] < target ||
    heightsInDirections.toRight[row][column] < target ||
    heightsInDirections.toLeft[row][column] < target
  );
};

const heightsInDirections = calculateHeightsInDirections();

console.log(`Forming heights took: ${new Date() - start}ms`)

for (let row = 1; row < rowLength - 1; row++) {
  for (let column = 1; column < data[0].length - 1; column++) {
    if (isVisible(row, column, data)) {
      result++;
    }
  }
}

console.log(result);
console.log(`Finished in ${new Date() - start}ms`);
