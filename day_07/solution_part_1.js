const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

const totalSize = 100000;
const sizes = {};

const treeRoot = {
  path: "/",
  type: "dir",
  files: [],
  dirs: {},
  parent: null,
  size: 0,
};

const createDirs = (currentDir, results) => {
  const dirs = results
    .filter((x) => x.startsWith("dir"))
    .map((x) => x.split(" ")[1]);
  for (const dir of dirs) {
    currentDir.dirs[dir] = {
      path: currentDir.path + dir + "/",
      type: "dir",
      files: [],
      dirs: {},
      parent: currentDir,
      size: 0,
    };
  }
  // console.log("====    createDirs", dirs, currentDir);
};

const addFiles = (currentDir, results) => {
  const files = results
    .filter((x) => !x.startsWith("dir"))
    .map((x) => ({ size: Number(x.split(" ")[0]), name: x.split(" ")[1] }));

  for (const file of files) {
    currentDir.files.push(file);
    let dirToChangeSize = currentDir;
    while (dirToChangeSize != null) {
      dirToChangeSize.size += file.size;
      sizes[dirToChangeSize.path] = dirToChangeSize.size;
      dirToChangeSize = dirToChangeSize.parent;
    }
  }

  // console.log("====    files", files, results);
};

const buildTree = (commands) => {
  let currentDir = treeRoot;

  for (const command of commands) {
    switch (command.command) {
      case "cd":
        // console.log("Navigate to: ", command.args);
        if (command.args === "/") {
          continue;
        }
        if (command.args === "..") {
          currentDir = currentDir.parent;
          continue;
        }
        currentDir = currentDir.dirs[command.args];
        break;
      case "ls":
        // console.log(`Content of the dir ${currentDir.path} is: ${command.results}`);
        createDirs(currentDir, command.results);
        addFiles(currentDir, command.results);
        break;
    }
  }
};

const commands = input
  .split("$ ")
  .filter((x) => x)
  .map((x) =>
    x
      .split("\n")
      .filter((x) => x)
      .reduce((acc, val, index) => {
        if (index === 0) {
          acc.command = val;
          if (val.startsWith("cd")) {
            acc.command = "cd";
            acc.args = val.split(" ")[1];
          } else {
            acc.results = [];
          }
        } else {
          acc.results.push(val);
        }
        return acc;
      }, {})
  );

// console.log(commands);

buildTree(commands);

// console.log(treeRoot);

// console.log(sizes);

console.log(
  Object.values(sizes)
    .filter((x) => x <= totalSize)
    .reduce((a, b) => a + b)
);
