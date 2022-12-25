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

    return data["root"];
};

const invertOperation = (operation) => {
    switch (operation) {
        case "+":
            return "-";
        case "-":
            return "+";
        case "*":
            return "/";
        case "/":
            return "*";
    }
};

const operandsToNodes = Object.entries(data)
    .filter((x) => !x[1].resolved)
    .map((x) => ({
        id: x[0],
        firstOperand: x[1].equation.firstOperand,
        secondOperand: x[1].equation.secondOperand,
    }))
    .reduce((acc, val) => {
        acc[val.firstOperand] = val.id;
        acc[val.secondOperand] = val.id;
        return acc;
    }, {});

const result = calculateRoot(data);

const findHumanPathStartId = (data) => {
    const path = [];
    currentNodeId = "humn";
    while (currentNodeId !== "root") {
        path.push(currentNodeId);
        currentNodeId = operandsToNodes[currentNodeId];
    }

    const humanNodePathStartId = path[path.length - 1];

    const otherNodePathStartId =
        data["root"].equation.firstOperand !== humanNodePathStartId
            ? data["root"].equation.firstOperand
            : data["root"].equation.secondOperand;

    const solutionForHumanPath = data[otherNodePathStartId].value;

    let partialSolution = solutionForHumanPath;

    function calculateEquationParts(
        calculateForFirstOperand,
        calculateWithOperandValue,
        operation,
        partialSolution
    ) {
        switch (operation) {
            case "+":
                return {
                    newFirst: partialSolution,
                    newSecond: calculateWithOperandValue,
                    newOperation: "-",
                };
            case "*":
                return {
                    newFirst: partialSolution,
                    newSecond: calculateWithOperandValue,
                    newOperation: "/",
                };
            case "/":
                if (calculateForFirstOperand) {
                    return {
                        newFirst: partialSolution,
                        newSecond: calculateWithOperandValue,
                        newOperation: "*",
                    };
                } else {
                    return {
                        newFirst: calculateWithOperandValue,
                        newSecond: partialSolution,
                        newOperation: "/",
                    };
                }
            case "-":
                if (calculateForFirstOperand) {
                    return {
                        newFirst: partialSolution,
                        newSecond: calculateWithOperandValue,
                        newOperation: "+",
                    };
                } else {
                    return {
                        newFirst: calculateWithOperandValue,
                        newSecond: partialSolution,
                        newOperation: "-",
                    };
                }
        }
    }

    for (let i = path.length - 1; i > 0; i--) {
        const currentNode = path[i];
        const nextNode = path[i - 1];
        const calculateForFirstOperand =
            data[currentNode].equation.firstOperand === nextNode;

        const calculateWithOperand = calculateForFirstOperand
            ? data[currentNode].equation.secondOperand
            : data[currentNode].equation.firstOperand;

        const calculateWithOperandValue = data[calculateWithOperand].value;

        const operation = data[currentNode].equation.operation;

        const { newFirst, newOperation, newSecond } = calculateEquationParts(
            calculateForFirstOperand,
            calculateWithOperandValue,
            operation,
            partialSolution
        );

        partialSolution = eval(`${newFirst}n ${newOperation} ${newSecond}n`);
    }

    return partialSolution;
};

console.log(Number(findHumanPathStartId(data)));
