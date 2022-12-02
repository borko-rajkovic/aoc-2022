const fs = require("fs");
const path = require("path");

const result = fs
  .readFileSync(__dirname + path.sep + "input.txt", "utf8")
  .split("\n\n")
  .map((x) => x.split("\n").map((y) => Number(y)))
  .map((x) => x.reduce((acc, e) => acc + e))
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((acc, e) => acc + e);

console.log(result);
