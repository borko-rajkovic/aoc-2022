const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

console.log(
  input.match(
    /(.)(?!\1|.\1|..\1|...\1|....\1|.....\1|......\1|.......\1|........\1|.........\1|..........\1|...........\1|............\1)(.)(?!\2|.\2|..\2|...\2|....\2|.....\2|......\2|.......\2|........\2|.........\2|..........\2|...........\2)(.)(?!\3|.\3|..\3|...\3|....\3|.....\3|......\3|.......\3|........\3|.........\3|..........\3)(.)(?!\4|.\4|..\4|...\4|....\4|.....\4|......\4|.......\4|........\4|.........\4)(.)(?!\5|.\5|..\5|...\5|....\5|.....\5|......\5|.......\5|........\5)(.)(?!\6|.\6|..\6|...\6|....\6|.....\6|......\6|.......\6)(.)(?!\7|.\7|..\7|...\7|....\7|.....\7|......\7)(.)(?!\8|.\8|..\8|...\8|....\8|.....\8)(.)(?!\9|.\9|..\9|...\9|....\9)(.)(?!\10|.\10|..\10|...\10)(.)(?!\11|.\11|..\11)(.)(?!\12|.\12)(.)(?!\13)(.)/
  ).index + 14
);

// More test cases:
//
// mjqjpqmgbljsphdztnvjfqwrcgsmlb: first marker after character 19
// bvwbjplbgvbhsrlpgdmjqwftvncz: first marker after character 23
// nppdvjthqldpwncqszvftbrmjlhg: first marker after character 23
// nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg: first marker after character 29
// zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw: first marker after character 26

const makeRegex = (n) => {
  const result = [];
  for (let i = 0; i < n - 1; i++) {
    const something = [];
    for (let j = 0; j < n - i - 1; j++) {
      const dots = ".".repeat(j);
      something.push(dots + `\\${i + 1}`);
    }
    result.push("(.)(?!" + something.join("|") + ")");
  }

  return RegExp(result.join(""));
};

const makeRegexAlternative = (n) => {
  const result = [];
  for (let i = 0; i < n - 1; i++) {
    const something = [];
    for (let j = 0; j < i + 1; j++) {
      something.push(`\\${j + 1}`);
    }
    result.push("(.)(?!" + something.join("|") + ")");
  }

  return RegExp(result.join(""));
};

// console.log(makeRegexAlternative(14))
// console.log(fs.readFileSync(__dirname + path.sep + file_name, "utf8").match(makeRegexAlternative(14)).index + 14)

const findFirstUniqueSubstringOfNCharacters = (s, n) =>
  s.match(makeRegex(n))?.index ? s.match(makeRegex(n)).index + n : -1;

// console.log(
//   findFirstUniqueSubstringOfNCharacters(
//     fs.readFileSync(__dirname + path.sep + file_name, "utf8"),
//     14
//   )
// );
