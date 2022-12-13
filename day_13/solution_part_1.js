const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

const pairs = input
  .split("\n\n")
  .map((x) => x.split("\n").map((x) => (x = eval(x))));

const something = (first, second, indentation = 0) => {
  console.log(
    `${" ".repeat(indentation * 2)}- Compare ${JSON.stringify(
      first
    )} vs ${JSON.stringify(second)}`
  );

  indentation++;

  for (let i = 0; i < Math.min(first.length, second.length); i++) {
    let diff = 0;

    if (!(first[i] instanceof Array) && !(second[i] instanceof Array)) {
      console.log(
        `${" ".repeat(indentation * 2)}- Compare ${first[i]} vs ${second[i]}`
      );
      diff = first[i] - second[i];
    } else if (first[i] instanceof Array && second[i] instanceof Array) {
      diff = something(first[i], second[i], indentation);
      if (diff !== 0) {
        return diff;
      }
    } else {
      console.log(
        `${" ".repeat(indentation * 2)}- Compare ${JSON.stringify(
          first[i]
        )} vs ${JSON.stringify(second[i])}`
      );
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
      console.log(
        `${" ".repeat(
          indentation * 2
        )}- Mixed types; convert ${which} to [${value}] and retry comparison`
      );
      diff = something(firstMixed, secondMixed, indentation);
      if (diff !== 0) {
        return diff;
      }
    }

    if (diff < 0) {
      indentation++;
      console.log(
        `${" ".repeat(
          indentation * 2
        )}- Left side is smaller, so inputs are in the right order`
      );
      return diff;
    } else if (diff > 0) {
      indentation++;
      console.log(
        `${" ".repeat(
          indentation * 2
        )}- Right side is smaller, so inputs are not in the right order`
      );
      return diff;
    }
  }

  if (first.length < second.length) {
    console.log(
      `${" ".repeat(
        indentation * 2
      )}- Left side ran out of items, so inputs are in the right order`
    );
    return -1;
  } else if (second.length < first.length) {
    console.log(
      `${" ".repeat(
        indentation * 2
      )}- Right side ran out of items, so inputs are not in the right order`
    );
    return 1;
  }

  return 0;
};

const checkIfPairIsInOrder = ([first, second], number) => {
  console.log(`== Pair ${number} ==`);

  return something(first, second) < 0;
};

const pairNumbersInRightOrder = pairs.map((pair, i) => {
  return checkIfPairIsInOrder(pair, i + 1) ? i + 1 : 0;
});

console.log(pairNumbersInRightOrder.reduce((a, b) => a + b));
