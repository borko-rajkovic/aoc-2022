const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

function intersection(setA, setB) {
  let aIndex = 0;
  let bIndex = 0;
  let localOut = [];

  while (aIndex < setA.length && bIndex < setB.length) {
    if (setA[aIndex] < setB[bIndex]) aIndex++;
    else if (setA[aIndex] > setB[bIndex]) bIndex++;
    else {
      localOut.push(setA[aIndex++]);
      bIndex++;
    }
  }
  return localOut;
}

function getPriority(x) {
  if (x.match(/[a-z]/)) {
    return x.charCodeAt(0) - "a".charCodeAt(0) + 1;
  } else {
    return x.charCodeAt(0) - "A".charCodeAt(0) + 27;
  }
}

const regex = /(.*\n.*\n.*)\n/gm;
const subst = `$1|`;

const result = fs
  .readFileSync(__dirname + path.sep + file_name, "utf8")
  .replace(regex, subst)
  .split("|")
  .map((x) => x.split("\n"))
  .map((x) =>
    x.map((y) => [
      ...new Set(y.split("").sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))),
    ])
  )
  .map((x) => intersection(intersection(x[0], x[1]), x[2]))
  .map((x) => x[0])
  .map((x) => getPriority(x))
  .reduce((a, b) => a + b);

console.log(result);
