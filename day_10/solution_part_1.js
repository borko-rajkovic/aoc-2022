const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");
let X = 1;

const instructionDefinitions = {
  addx: { cycles: 2, addValue: true },
  noop: { cycles: 1, addValue: false },
};

const signalStrengthsAfterCyclesReducer = input
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

      const newEntry = { X: finalValue, cycle: cycles + lastCycle };

      acc.entries.push(newEntry);
      acc.lastEntry = newEntry;
      return acc;
    },
    { entries: [{ X: 1, cycle: 0 }], lastEntry: { X: 1, cycle: 0 } }
  );

function* generateDesiredCycles() {
  for (let i = 20; i <= 220; i += 40) {
    yield i;
  }
  return;
}

const signalStrengthsAfterCycles = signalStrengthsAfterCyclesReducer.entries;

const desiredCycles = generateDesiredCycles();
let currentIndex = 0;
const signalStrengths = [];

while (true) {
  const next = desiredCycles.next();
  if (next.done) {
    break;
  }

  const desiredCycle = next.value;
  console.log(`Checking signal strength during cycle: ${desiredCycle}`);
  console.log();

  while (signalStrengthsAfterCycles[currentIndex].cycle < desiredCycle) {
    // console.log(
    //   `Checking next cycle in signalStrengthsAfterCycles: ${signalStrengthsAfterCycles[currentIndex].cycle}`
    // );
    currentIndex++;
  }

  console.log();
  console.log(
    `Found desired cycle: ${signalStrengthsAfterCycles[currentIndex].cycle}`
  );
  console.log(
    `Cycle before: ${signalStrengthsAfterCycles[currentIndex - 1].cycle}`
  );
  console.log(
    `Value before (during ${desiredCycle}th cycle): ${
      signalStrengthsAfterCycles[currentIndex - 1].X
    }`
  );
  const signalStrength =
    desiredCycle * signalStrengthsAfterCycles[currentIndex - 1].X;
  console.log(
    `Signal strength during ${desiredCycle}th cycle is: desiredCycle(${desiredCycle}) * X (${
      signalStrengthsAfterCycles[currentIndex - 1].X
    }) = ${signalStrength}`
  );
  signalStrengths.push(signalStrength);
  console.log("==========");
}

console.log(signalStrengths);

const sumOfSignalStrengths = signalStrengths.reduce((a, b) => a + b);
console.log(sumOfSignalStrengths);
