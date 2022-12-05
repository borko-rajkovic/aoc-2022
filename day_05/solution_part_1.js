const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs
  .readFileSync(__dirname + path.sep + file_name, "utf8")
  .split(/^[0-9 ]+$\n\n/gm)
  .map((x, i) =>
    i === 0
      ? x
          .split("\n")
          .filter((x) => x !== "")
          .map((y) => y.replace(/.(.).(.|$)/gm, "$1"))
          .reverse()
          .reduce((acc, b) => {
            b.split("").forEach((v, i) => {
              if (v === " ") {
                return acc;
              }

              if (!acc[i + 1]) {
                acc[i + 1] = [];
              }
              acc[i + 1].push(v);
            });

            return acc;
          }, {})
      : x.split("\n").map((x) => {
          const match = x.match(/^move ([0-9]+) from ([0-9]+) to ([0-9]+)$/);
          return { move: match[1], from: match[2], to: match[3] };
        })
  );

const stacks = input[0];
const moves = input[1];

console.log(stacks);
console.log(moves);

const makeMove = (move) => {
  // console.log(stacks);

  // console.log(move.from, move.to, move.move);
  // console.log(stacks[move.from], stacks[move.to], stacks[move.from].slice(stacks[move.from].length - move.move));
  stacks[move.to].push(
    ...stacks[move.from].slice(stacks[move.from].length - move.move).reverse()
  );
  stacks[move.from] = stacks[move.from].slice(0, -move.move);
  // console.log(stacks);
  // console.log();
};

// makeMove(moves[0]);

moves.forEach(makeMove);

const result = Object.values(stacks).map(x => x[x.length -1]).join('');

console.log(result);
