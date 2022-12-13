const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

const pairs = input
  .split("\n\n")
  .map((x) => x.split("\n").map((x) => (x = eval(x))));

const something = (first, second, indentation = 0) => {
  indentation++;

  for (let i = 0; i < Math.min(first.length, second.length); i++) {
    let diff = 0;

    if (!(first[i] instanceof Array) && !(second[i] instanceof Array)) {
      diff = first[i] - second[i];
    } else if (first[i] instanceof Array && second[i] instanceof Array) {
      diff = something(first[i], second[i], indentation);
      if (diff !== 0) {
        return diff;
      }
    } else {
      indentation++;
      let which = "";
      let value;
      let firstMixed = first[i];
      let secondMixed = second[i];
      if (first[i] instanceof Array) {
        which = "right";
        value = second[i];
        secondMixed = [second[i]];
      } else {
        which = "left";
        value = first[i];
        firstMixed = [first[i]];
      }
      diff = something(firstMixed, secondMixed, indentation);
      if (diff !== 0) {
        return diff;
      }
    }

    if (diff < 0) {
      indentation++;
      return diff;
    } else if (diff > 0) {
      indentation++;
      return diff;
    }
  }

  if (first.length < second.length) {
    return -1;
  } else if (second.length < first.length) {
    return 1;
  }

  return 0;
};

const allPackets = pairs.flatMap((x) => x);

allPackets.push([[2]]);
allPackets.push([[6]]);

allPackets.sort((a, b) => something(a, b));

const allPacketsStrings = allPackets.map((x) => JSON.stringify(x));

const dividerPacket1Location = allPacketsStrings.indexOf("[[2]]") + 1;
const dividerPacket2Location = allPacketsStrings.indexOf("[[6]]") + 1;

console.log(dividerPacket1Location * dividerPacket2Location);
