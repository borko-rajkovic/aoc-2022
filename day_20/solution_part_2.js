const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs
    .readFileSync(__dirname + path.sep + file_name, "utf8")
    .toString()
    .trim()
    .split("\n")
    .map((item, index) => {
        return { number: Number(item) * 811589153, index };
    });

console.time(file_name);

const insertItem = (array, indexToAdd, item) => {
    array.splice(indexToAdd, 0, item);
};

const removeItem = (array, indexToRemove) => {
    let index = mixed.indexOf(
        mixed.find((item) => item.index === indexToRemove)
    );
    array.splice(index, 1);
};

let mixed = [...input];

const getPositiveModulo = (a, b) => {
    if (a % b >= 0) {
        return a % b;
    }

    return ((a % b) + b) % b;
};

const shuffle = () => {
    for (let i = 0; i < input.length; i++) {
        const index = mixed.indexOf(input[i]);
        let number = input[i].number;
        let newIndex = index;

        if (number === 0) {
            continue;
        }

        number = getPositiveModulo(number, mixed.length - 1);
        newIndex = (number + newIndex) % (mixed.length - 1);

        removeItem(mixed, input[i].index);
        insertItem(mixed, newIndex, input[i]);
    }
};

const getSumOfElementsOnIndicies = () => {
    const indexOfZero = mixed.indexOf(mixed.find((item) => item.number === 0));
    const targetIndexes = [1000, 2000, 3000];

    return targetIndexes.reduce((acc, index) => {
        let groveCoordinate = (index + indexOfZero) % mixed.length;
        return acc + mixed[groveCoordinate].number;
    }, 0);
};

for (let i = 0; i < 10; i++) {
    shuffle();
}

console.log(getSumOfElementsOnIndicies());

console.timeEnd(file_name);
