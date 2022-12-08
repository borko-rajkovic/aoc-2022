const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input =
  fs
    .readFileSync(__dirname + path.sep + file_name, "utf8")
    .match(/(.)(?!\1|.\1|..\1)(.)(?!\2|.\2)(.)(?!\3)/).index + 4;

console.log(input);

// alternative: (.)(?!\1)(.)(?!\1|\2)(.)(?!\1|\2|\3)

// More test cases:
//
// mjqjpqmgbljsphdztnvjfqwrcgsmlb 7
// bvwbjplbgvbhsrlpgdmjqwftvncz 5
// nppdvjthqldpwncqszvftbrmjlhg 6
// nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg 10
// zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw 11
