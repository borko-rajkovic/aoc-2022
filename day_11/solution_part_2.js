const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");
const printItem = (item) =>
  Object.entries(item).map((entry) => `${entry[0]}:${entry[1]}`);

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

const divisibleByCriterias = monkeys.map((monkey) => monkey.testDivisibleBy);

monkeys.forEach((monkey) => {
  monkey.items = monkey.items.map((item) => {
    const result = {};
    divisibleByCriterias.forEach((divisibleByCriteria) => {
      result[divisibleByCriteria] = item % divisibleByCriteria;
    });
    return result;
  });
});

// console.log(monkeys);

const executeRound = (log) => {
  monkeys.forEach((monkey) => {
    if (log) console.log(`Monkey ${monkey.id}:`);
    monkey.items.forEach((item) => {
      if (log)
        console.log(
          `\tMonkey inspects an item with a worry level of item with remainders on divisions ${printItem(
            item
          )}.`
        );
      monkey.inspects++;
      const operation = monkey.operation.split("old ")[1].split("")[0];
      const secondOperandRaw = monkey.operation.split(operation + " ")[1];
      const isMultiply = operation === "*";
      const what = isMultiply ? "is multiplied" : "increases";

      const itemAfterCalculation = {};
      Object.entries(item).forEach((entry) => {
        const secondOperand =
          secondOperandRaw === "old"
            ? Number(entry[1])
            : Number(secondOperandRaw);
        const operationResult = isMultiply
          ? Number(entry[1]) * Number(secondOperand)
          : Number(entry[1]) + Number(secondOperand);

        const operationResultModulo = operationResult % Number(entry[0]);

        itemAfterCalculation[entry[0]] = operationResultModulo;
      });

      if (log)
        console.log(
          `\t\tWorry level ${what} by ${secondOperandRaw} to ${printItem(
            itemAfterCalculation
          )}.`
        );

      const isDivisibleByCriteria = itemAfterCalculation[monkey.testDivisibleBy] === 0;

      if (log)
        console.log(
          `\t\tCurrent worry level is ${
            !isDivisibleByCriteria ? "not " : ""
          }divisible by 23.`
        );

      const target = isDivisibleByCriteria
        ? monkey.trueBranch
        : monkey.falseBranch;
      if (log)
        console.log(
          `\t\tItem with worry level ${printItem(itemAfterCalculation)} is thrown to monkey ${target}.`
        );
      monkeys[target].items.push(itemAfterCalculation);
    });
    monkey.items = [];
  });
};

for (let i = 1; i <= 10000; i++) {
  executeRound(false);
  console.log(`== After round ${i} ==`);
  console.log(
    monkeys
      .map(
        (monkey, i) => `Monkey ${i} inspected items ${monkey.inspects} times.`
      )
      .join("\n")
  );
  console.log();
}

monkeys.sort((a, b) => b.inspects - a.inspects);

const twoMostActiveMonkeys = monkeys.slice(0, 2);

console.log(
  twoMostActiveMonkeys.map((monkey) => monkey.inspects).reduce((a, b) => a * b)
);
