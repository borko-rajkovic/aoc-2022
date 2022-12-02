const fs = require("fs");
const path = require("path");

const Rock = "A";
const Paper = "B";
const Scissors = "C";

const Response_Lose = "X";
const Response_Draw = "Y";
const Response_Win = "Z";

const Rock_Value = 1;
const Paper_Value = 2;
const Scissors_Value = 3;

const Win_Value = 6;
const Draw_Value = 3;
const Lose_Value = 0;

const roundPoint = {
  [Rock]: {
    [Response_Draw]: Rock_Value + Draw_Value,
    [Response_Win]: Paper_Value + Win_Value,
    [Response_Lose]: Scissors_Value + Lose_Value,
  },
  [Paper]: {
    [Response_Lose]: Rock_Value + Lose_Value,
    [Response_Draw]: Paper_Value + Draw_Value,
    [Response_Win]: Scissors_Value + Win_Value,
  },
  [Scissors]: {
    [Response_Win]: Rock_Value + Win_Value,
    [Response_Lose]: Paper_Value + Lose_Value,
    [Response_Draw]: Scissors_Value + Draw_Value,
  },
};

const result = fs
  .readFileSync(__dirname + path.sep + "input.txt", "utf8")
  .split("\n")
  .map((x) => roundPoint[x.split(" ")[0]][x.split(" ")[1]])
  .reduce((acc, e) => acc + e);

console.log(result);
