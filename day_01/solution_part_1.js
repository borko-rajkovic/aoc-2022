const fs = require("fs");
const path = require("path");

const result = fs
  .readFileSync(__dirname + path.sep + "input.txt", "utf8")
  .split("\n\n")
  .map((x) => x.split("\n").map((y) => Number(y)))
  .map((x) => x.reduce((acc, e) => acc + e))
  .reduce((acc, e) => Math.max(acc, e), 0);

console.log(result);
