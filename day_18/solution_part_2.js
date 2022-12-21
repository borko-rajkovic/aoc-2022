const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

let cubes = new Set();
input.split("\n").forEach((line) => cubes.add(line));

console.time("ExecutionTime");

let MIN = Infinity;
let MAX = -Infinity;

for (let cube of cubes) {
  let [x, y, z] = cube.split(",").map((n) => parseInt(n));
  MIN = Math.min(MIN, x, y, z);
  MAX = Math.max(MAX, x, y, z);
}

const countAffectedCubes = (x, y, z) => {
  let count = 0;

  if (cubes.has(`${x + 1},${y},${z}`)) count++;
  if (cubes.has(`${x - 1},${y},${z}`)) count++;
  if (cubes.has(`${x},${y + 1},${z}`)) count++;
  if (cubes.has(`${x},${y - 1},${z}`)) count++;
  if (cubes.has(`${x},${y},${z + 1}`)) count++;
  if (cubes.has(`${x},${y},${z - 1}`)) count++;

  return count;
};

let visited = new Set();

let surfaceArea = 0;
let queue = [{ x: 0, y: 0, z: 0 }];

while (queue.length > 0) {
  let { x, y, z } = queue.shift();
  if (visited.has(`${x},${y},${z}`)) continue;
  if (cubes.has(`${x},${y},${z}`)) continue;
  if (x < MIN - 1 || y < MIN - 1 || z < MIN - 1) continue;
  if (x > MAX + 1 || y > MAX + 1 || z > MAX + 1) continue;
  visited.add(`${x},${y},${z}`);

  surfaceArea += countAffectedCubes(x, y, z);

  queue.push({ x: x + 1, y, z });
  queue.push({ x: x - 1, y, z });
  queue.push({ x, y: y + 1, z });
  queue.push({ x, y: y - 1, z });
  queue.push({ x, y, z: z + 1 });
  queue.push({ x, y, z: z - 1 });
}

console.log(surfaceArea);

console.timeEnd("ExecutionTime");
