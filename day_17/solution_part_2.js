const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

const directions = input.split("");
const previousStates = {};
const sizeOfTower = 1000000000000;
let extraHeightFromCycles = 0;

function* createDataGenerator(data) {
  let i = 0;
  while (true) {
    yield { data: JSON.parse(JSON.stringify(data[i++])), index: i };
    if (i === data.length) {
      i = 0;
    }
  }
}

const shapes = [
  [[0, 0, 1, 1, 1, 1, 0]],
  [
    [0, 0, 0, 3, 0, 0, 0],
    [0, 0, 2, 2, 2, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 3, 0, 0],
    [0, 0, 0, 0, 2, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
  ],
  [
    [0, 0, 4, 0, 0, 0, 0],
    [0, 0, 3, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0],
  ],
  [
    [0, 0, 2, 2, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
  ],
];

const directionGenerator = createDataGenerator(directions);
const shapesGenerator = createDataGenerator(shapes);

const getNextDirection = () => directionGenerator.next().value;
const getNextShape = () => shapesGenerator.next().value;

const floor = [0, 0, 0, 0, 0, 0, 0];
const wallMap = new Set();
["0_0", "0_1", "0_2", "0_3", "0_4", "0_5", "0_6"].forEach((x) =>
  wallMap.add(x)
);

const moveShapeToLeft = (shape) => {
  return shape.map((x) => [...x.slice(1), 0]);
};

const moveShapeToRight = (shape) => {
  return shape.map((x) => [0, ...x.slice(0, x.length - 1)]);
};

const moveShape = (shape, newDir) => {
  if (newDir === "<") {
    const isTouchingLeft = shape
      .map((x) => x[0])
      .flatMap((x) => x)
      .some((x) => x != 0);
    if (isTouchingLeft) {
      return shape;
    } else {
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
          const cell = shape[i][j];
          if (cell > 0 && wallMap.has(`${shape[i][j]}_${j - 1}`)) {
            return shape;
          }
        }
      }

      return moveShapeToLeft(shape);
    }
  } else {
    const isTouchingRight = shape
      .map((x) => x[x.length - 1])
      .flatMap((x) => x)
      .some((x) => x != 0);
    if (isTouchingRight) {
      return shape;
    } else {
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
          const cell = shape[i][j];
          if (cell > 0 && wallMap.has(`${shape[i][j]}_${j + 1}`)) {
            return shape;
          }
        }
      }

      return moveShapeToRight(shape);
    }
  }
};

const fallOneStep = (shape) => {
  return shape.map((x) => x.map((x) => (x === 0 ? 0 : x - 1)));
};

const checkIfColided = (shape) => {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] === 0) continue;
      if (wallMap.has(`${shape[i][j] - 1}_${j}`)) return true;
    }
  }

  return false;
};

const setFloorAndWallMap = (shape) => {
  shape.forEach((line) => {
    line.forEach((cell, column) => {
      if (cell > 0) {
        wallMap.add(`${cell}_${column}`);
      }
    });
  });

  for (let i = 0; i < floor.length; i++) {
    floor[i] = Math.max(...shape.map((x) => x[i]).flatMap((x) => x), floor[i]);
  }
};

for (let i = 0; i < sizeOfTower; i++) {
  const nextShape = getNextShape();
  let shape = nextShape.data;
  const shapeIndex = nextShape.index;

  let colided = false;
  shape = shape.map((x) =>
    x.map((x) => (x === 0 ? 0 : x + 3 + Math.max(...floor)))
  );
  let directionIndex;
  while (!colided) {
    const nextDirection = getNextDirection();
    const newDir = nextDirection.data;
    directionIndex = nextDirection.index;
    shape = moveShape(shape, newDir);
    colided = checkIfColided(shape);
    if (!colided) {
      shape = fallOneStep(shape);
    } else {
      setFloorAndWallMap(shape);
    }
  }

  let last10RowsMemoizationKey = `${directionIndex}_${shapeIndex}_`;
  const maxRow = Math.max(...floor);
  for (let row = maxRow; row >= maxRow - 10; row--) {
    let rowBitMap = "";
    for (let column = 0; column < 7; column++) {
      rowBitMap += wallMap.has(`${row}_${column}`) ? 1 : 0;
    }
    last10RowsMemoizationKey += parseInt(rowBitMap, 2) + "_";
  }

  if (previousStates[last10RowsMemoizationKey] != null) {
    let shapeCountChange = i - previousStates[last10RowsMemoizationKey].shapeCount;
    let heightChange = maxRow - previousStates[last10RowsMemoizationKey].height;
    let cycleAmount =
      Math.floor(
        (sizeOfTower - previousStates[last10RowsMemoizationKey].shapeCount) / shapeCountChange
      ) - 1;

    extraHeightFromCycles += cycleAmount * heightChange;
    i += cycleAmount * shapeCountChange;
  } else {
    previousStates[last10RowsMemoizationKey] = {
      height: maxRow,
      shapeCount: i,
    };
  }
}

const showWell = () => {
  let maxRow = Math.max(...floor);
  for (let row = maxRow; row >= 0; row--) {
    let line = "";
    for (let column = 0; column < 7; column++)
      line += wallMap.has(`${row}_${column}`) ? "#" : ".";
    console.log(line);
  }
};

// showWell();

console.log("finish", floor, Math.max(...floor) + extraHeightFromCycles);
