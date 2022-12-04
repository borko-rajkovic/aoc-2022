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
  .filter((x) => {
    console.log(x);
    const lMin = x[0][0];
    const lMax = x[0][1];
    const rMin = x[1][0];
    const rMax = x[1][1];
    const lMinOverlap = lMin >= rMin && lMin <= rMax;
    const lMaxOverlap = lMax >= rMin && lMax <= rMax;
    const rMinOverlap = rMin >= lMin && rMin <= lMax;
    const rMaxOverlap = rMax >= lMin && rMax <= lMax;
    console.log(lMinOverlap, lMaxOverlap, rMinOverlap, rMaxOverlap);
    return lMinOverlap || lMaxOverlap || rMinOverlap || rMaxOverlap;
  })
  .reduce((a, b) => a + 1, 0);

console.log(result);
