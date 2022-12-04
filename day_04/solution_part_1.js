const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const result = fs
  .readFileSync(__dirname + path.sep + file_name, "utf8")
  .split("\n")
  .map((x) => {
    const r = [];
    r.push(x.substring(0, x.indexOf(",")));
    r.push(x.substring(x.indexOf(",") + 1));
    return r;
  })
  .map((x) => x.map((y) => y.split("-").map((z) => Number(z))))
  .filter(
    (x) =>
      (x[0][0] <= x[1][0] && x[0][1] >= x[1][1]) ||
      (x[1][0] <= x[0][0] && x[1][1] >= x[0][1])
  )
  .reduce((a, b) => a + 1, 0);

console.log(result);
