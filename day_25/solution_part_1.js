const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

console.time(file_name);

const snafuDigitToDecimalDigit = (snafuDigit) => {
    switch (snafuDigit) {
        case "-":
            return -1;
        case "=":
            return -2;
        default:
            return Number(snafuDigit);
    }
};

const snafuToDecimal = (snafuNumber) =>
    snafuNumber
        .split("")
        .reverse()
        .map((val, index) => Math.pow(5, index) * snafuDigitToDecimalDigit(val))
        .reduce((a, b) => a + b);

const decimalToSnafu = (decimalNumber) => {
    let result = "";

    const base5Digits = decimalNumber
        .toString(5)
        .split("")
        .reverse()
        .map(Number);

    let carry = false;

    for (const base5Digit of base5Digits) {
        const nextDigit = base5Digit + (carry ? 1 : 0);

        switch (nextDigit) {
            case 3:
                result = "=" + result;
                carry = true;
                break;
            case 4:
                result = "-" + result;
                carry = true;
                break;
            case 5:
                result = "0" + result;
                carry = true;
                break;
            default:
                result = nextDigit + result;
                carry = false;
                break;
        }
    }

    if (carry) {
        result = "1" + result;
    }

    return result;
};

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

const result = decimalToSnafu(
    input
        .split("\n")
        .map(snafuToDecimal)
        .reduce((a, b) => a + b)
);

console.log(result);

console.timeEnd(file_name);
