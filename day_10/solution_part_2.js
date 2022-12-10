const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");
let spritePosition = 1;
let result = "";

const instructionDefinitions = {
  addx: { cycles: 2, addValue: true },
  noop: { cycles: 1, addValue: false },
};

const signalStrengthsAfterCycles = input
  .split("\n")
  .map((x) => x.split(" "))
  .reduce(
    (acc, val) => {
      const lastEntry = acc.lastEntry;

      const instruction = instructionDefinitions[val[0]];
      cycles = instruction.cycles;
      const lastCycle = lastEntry.cycle;

      const value = instruction.addValue ? Number(val[1]) : 0;
      const lastValue = lastEntry.X;
      const finalValue = lastValue + value;

      const newEntry = {
        X: lastValue,
        cycle: lastCycle + 1,
        instruction: val[0],
        instructionValue: val[1] ? Number(val[1]) : "",
        part: 1,
      };

      const newEntries = [];
      newEntries.push(newEntry);
      if (instruction.addValue) {
        anotherEntry = {
          X: lastValue,
          cycle: lastCycle + 2,
          instruction: val[0],
          instructionValue: Number(val[1]),
          part: 2,
        };
        newEntries.push(anotherEntry);
      }

      acc.entries.push(...newEntries);
      acc.lastEntry = Object.assign({}, newEntries[newEntries.length - 1]);
      acc.lastEntry.X = finalValue;
      return acc;
    },
    {
      entries: [],
      lastEntry: { X: 1, cycle: 0, instruction: "noop", instructionValue: 0 },
      part: 1,
    }
  ).entries;

const printSpritePosition = (x) => {
  const line = Array(40).fill(".");
  positions = [x - 1, x, x + 1];
  positions.forEach((position) => {
    if (position >= 0) {
      line[position] = "#";
    }
  });

  return "Sprite position: \n" + line.join("");
};

for (let i = 0; i < signalStrengthsAfterCycles.length; i++) {
  const signalStrengthAfterCycle = signalStrengthsAfterCycles[i];
//   console.log(printSpritePosition(signalStrengthAfterCycle.X));
//   console.log();
//   console.log(
//     `Start cycle   ${signalStrengthAfterCycle.cycle}: begin executing ${signalStrengthAfterCycle.instruction} ${signalStrengthAfterCycle.instructionValue}`
//   );
//   console.log(
//     `During cycle   ${signalStrengthAfterCycle.cycle}: CRT draws pixel in position ${spritePosition}`
//   );
  const X = signalStrengthAfterCycle.X;
  const isCharVisible = [X - 1, X, X + 1].some((x) => x === spritePosition - 1);
  if (isCharVisible) {
    result += "#";
  } else {
    result += ".";
  }

//   console.log(`Current CRT row: \n` + result);

  spritePosition++;

  if (result.split('').filter(x => x != '\n').length % 40 === 0) {
    result += "\n";
    spritePosition = 1;
  }
}

console.log(result);
