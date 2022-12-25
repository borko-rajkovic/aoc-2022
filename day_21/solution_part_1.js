const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

const data = input
    .split("\n")
    .map((x) => /^(.+): (.*)$/.exec(x))
    .map((x) => {
        const rest = x[2];
        let resolved = false;
        let value = null;
        let equation = null;

        const tryInt = /^\d+$/.exec(rest);
        if ((rest, tryInt)) {
            resolved = true;
            value = tryInt[0];
        } else {
            resolved = false;

            equation = rest.split(" ").reduce((acc, val, index) => {
                switch (index) {
                    case 0:
                        acc.firstOperand = val;
                        break;
                    case 1:
                        acc.operation = val;
                        break;
                    case 2:
                        acc.secondOperand = val;
                        break;
                }

                return acc;
            }, {});
        }
        return { id: x[1], resolved, equation, value };
    })
    .reduce((acc, val) => {
        acc[val.id] = val;
        return acc;
    }, {});

const calculateRoot = (data) => {
    const queue = ["root"];

    while (queue.length > 0) {
        const currentItemId = queue.pop();
        const currentItem = data[currentItemId];

        // Try resolve
        const firstOperandId = currentItem.equation.firstOperand;
        const secondOperandId = currentItem.equation.secondOperand;
        const operation = currentItem.equation.operation;

        const firstOperand = data[firstOperandId];
        const secondOperand = data[secondOperandId];

        if (firstOperand.resolved && secondOperand.resolved) {
            currentItem.resolved = true;
            currentItem.value = eval(
                `${firstOperand.value} ${operation} ${secondOperand.value}`
            );
            continue;
        }

        queue.push(currentItemId);
        if (!firstOperand.resolved) {
            queue.push(firstOperandId);
        } else {
            queue.push(secondOperandId);
        }
    }

    return data['root'];
};

const result = calculateRoot(data);
console.log(result);
