const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

const monkeys = input
  .split("Monkey ")
  .filter((x) => x)
  .map((x) =>
    x
      .split("\n")
      .filter((x) => x)
      .map((x, i) => {
        switch (i) {
          case 0:
            return Number(x.split(":")[0]);
          case 1:
            return x.split("Starting items: ")[1].split(",").map(Number);
          case 2:
            return x.split("Operation: new = ")[1];
          case 3:
            return Number(x.split("divisible by ")[1]);
          case 4:
            return Number(x.split("to monkey ")[1]);
          case 5:
            return Number(x.split("to monkey ")[1]);
        }
        return x;
      })
  )
  .reduce((acc, val) => {
    const monkey = {
      id: val[0],
      items: val[1],
      operation: val[2],
      testDivisibleBy: val[3],
      trueBranch: val[4],
      falseBranch: val[5],
      inspects: 0,
    };
    acc.push(monkey);
    return acc;
  }, []);

// console.log(monkeys);

const executeRound = (log) => {
  monkeys.forEach((monkey) => {
    if (log) console.log(`Monkey ${monkey.id}:`);
    monkey.items.forEach((item) => {
      if (log)
        console.log(`\tMonkey inspects an item with a worry level of ${item}.`);
      monkey.inspects++;
      const operation = monkey.operation.split("old ")[1].split("")[0];
      const amount = monkey.operation.split(operation + " ")[1];
      const isMultiply = operation === "*";
      const what = isMultiply ? "is multiplied" : "increases";
      const secondOperand = amount === "old" ? item : amount;
      const operationResult = isMultiply
        ? item * secondOperand
        : Number(item) + Number(secondOperand);
      if (log)
        console.log(
          `\t\tWorry level ${what} by ${amount} to ${operationResult}.`
        );
      const afterDividingByThree = Math.floor(operationResult / 3);
      if (log)
        console.log(
          `\t\tMonkey gets bored with item. Worry level is divided by 3 to ${afterDividingByThree}.`
        );
      const isDivisibleByCriteria =
        afterDividingByThree % monkey.testDivisibleBy === 0;
      if (log)
        console.log(
          `\t\tCurrent worry level is ${
            !isDivisibleByCriteria ? "not " : ""
          }divisible by ${monkey.testDivisibleBy}.`
        );
      const target = isDivisibleByCriteria
        ? monkey.trueBranch
        : monkey.falseBranch;
      if (log)
        console.log(
          `\t\tItem with worry level ${afterDividingByThree} is thrown to monkey ${target}.`
        );
      monkeys[target].items.push(afterDividingByThree);
    });
    monkey.items = [];
  });
};

for (let i = 1; i <= 20; i++) {
  executeRound();
  console.log(
    `After round ${i}, the monkeys are holding items with these worry levels:`
  );
  console.log(
    monkeys.map((monkey, i) => `Monkey ${i}: ${monkey.items.join()}`)
  );
  console.log();
}

monkeys.sort((a, b) => b.inspects - a.inspects);

const twoMostActiveMonkeys = monkeys.slice(0, 2);

console.log(
  twoMostActiveMonkeys.map((monkey) => monkey.inspects).reduce((a, b) => a * b)
);
