const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

let cubes = new Set();
input.split("\n").forEach((line) => cubes.add(line));

console.time("ExecutionTime");

const countOpenSides = (x, y, z) => {
  let count = 6;

  if (cubes.has(`${x + 1},${y},${z}`)) count--;
  if (cubes.has(`${x - 1},${y},${z}`)) count--;
  if (cubes.has(`${x},${y + 1},${z}`)) count--;
  if (cubes.has(`${x},${y - 1},${z}`)) count--;
  if (cubes.has(`${x},${y},${z + 1}`)) count--;
  if (cubes.has(`${x},${y},${z - 1}`)) count--;

  return count;
};

let surfaceArea = 0;

for (let cube of cubes) {
  let [x, y, z] = cube.split(",").map((n) => parseInt(n));
  surfaceArea += countOpenSides(x, y, z);
}

console.log(surfaceArea);

console.timeEnd("ExecutionTime");
