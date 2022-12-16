const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");
const targetColumn = 2000000;

const sensorsWithBeacons = input.split("\n").map((x) =>
  x
    .split("closest beacon")
    .map((x, i) => {
      const xy = /x=(.*),.*y=(.*?)(:|$)/.exec(x);
      return { i, x: Number(xy[1]), y: Number(xy[2]) };
    })
    .reduce(
      (a, b, i) =>
        (i === 0
          ? (a.sensor = { row: b.y, column: b.x })
          : (a.closestBeacon = { row: b.y, column: b.x })) && a,
      {}
    )
);

const limits = {
  maxSensorColumn: Math.max(...sensorsWithBeacons.map((x) => x.sensor.column)),
  maxBeaconColumn: Math.max(
    ...sensorsWithBeacons.map((x) => x.closestBeacon.column)
  ),
  maxSensorRow: Math.max(...sensorsWithBeacons.map((x) => x.sensor.row)),
  maxBeaconRow: Math.max(...sensorsWithBeacons.map((x) => x.closestBeacon.row)),
  minSensorColumn: Math.min(...sensorsWithBeacons.map((x) => x.sensor.column)),
  minBeaconColumn: Math.min(
    ...sensorsWithBeacons.map((x) => x.closestBeacon.column)
  ),
  minSensorRow: Math.min(...sensorsWithBeacons.map((x) => x.sensor.row)),
  minBeaconRow: Math.min(...sensorsWithBeacons.map((x) => x.closestBeacon.row)),
};

const mapLimits = {
  maxColumn: Math.max(limits.maxSensorColumn, limits.maxBeaconColumn),
  maxRow: Math.max(limits.maxSensorRow, limits.maxBeaconRow),
  minColumn: Math.min(limits.minSensorColumn, limits.minBeaconColumn),
  minRow: Math.min(limits.minSensorRow, limits.minBeaconRow),
};

// console.log(sensorsWithBeacons);
// console.log(limits);
// console.log(mapLimits);

const calculateManhatanDistance = (sensorWithBeacon) => {
  return (
    Math.abs(sensorWithBeacon.sensor.row - sensorWithBeacon.closestBeacon.row) +
    Math.abs(
      sensorWithBeacon.sensor.column - sensorWithBeacon.closestBeacon.column
    )
  );
};

const intersectionOfRowWithSensorArea = (row, sensorWithBeacon) => {
  const manhatanDistance = calculateManhatanDistance(sensorWithBeacon);

  const rowDistanceFromSensorToRow = sensorWithBeacon.sensor.row - row;

  const cells = [];
  if (!(manhatanDistance - Math.abs(rowDistanceFromSensorToRow) < 0)) {
    cells.push({ row, column: sensorWithBeacon.sensor.column });
    for (
      let i = 1;
      i <= manhatanDistance - Math.abs(rowDistanceFromSensorToRow);
      i++
    ) {
      cells.push({
        row: targetColumn,
        column: sensorWithBeacon.sensor.column + i,
      });
      cells.push({
        row: targetColumn,
        column: sensorWithBeacon.sensor.column - i,
      });
    }
    console.log(
      cells.length,
      cells,
      sensorWithBeacon.sensor.column -
        (manhatanDistance - Math.abs(rowDistanceFromSensorToRow)),
      sensorWithBeacon.sensor.column +
        (manhatanDistance - Math.abs(rowDistanceFromSensorToRow))
    );
  }

  return cells;
};

const intersectionCells = [];

for (const sensorWithBeacon of sensorsWithBeacons) {
  intersectionCells.push(
    intersectionOfRowWithSensorArea(targetColumn, sensorWithBeacon)
  );
}

const intersectionCellsUniqueCount = [
  ...new Set(intersectionCells.flatMap((x) => x).map((x) => x.column)),
].length;

const beaconsOnRowUniqueCount = [
  ...new Set(
    sensorsWithBeacons
      .filter(
        (sensorWithBeacon) =>
          sensorWithBeacon.closestBeacon.row === targetColumn
      )
      .map((x) => x.closestBeacon.column)
  ),
].length;

console.log(intersectionCellsUniqueCount - beaconsOnRowUniqueCount);
