const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

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
  maxColumn: Math.min(Math.max(limits.maxSensorColumn, limits.maxBeaconColumn)),
  maxRow: Math.min(Math.max(limits.maxSensorRow, limits.maxBeaconRow)),
  minColumn: Math.max(Math.min(limits.minSensorColumn, limits.minBeaconColumn)),
  minRow: Math.max(Math.min(limits.minSensorRow, limits.minBeaconRow)),
};

const calculateManhatanDistance = (sensorWithBeacon) => {
  return (
    Math.abs(sensorWithBeacon.sensor.row - sensorWithBeacon.closestBeacon.row) +
    Math.abs(
      sensorWithBeacon.sensor.column - sensorWithBeacon.closestBeacon.column
    )
  );
};

console.log(mapLimits);

const sensorsWithBeaconsWithManhatanDistanceSortedDesc = sensorsWithBeacons
  .sort(
    (a, b) =>
      Math.min(a.sensor.column, a.closestBeacon.column) -
      Math.min(b.sensor.column, b.closestBeacon.column)
  )
  .map((x) => ({ ...x, manhatanDistance: calculateManhatanDistance(x) }));

const rowsWithNoManhatanDistance = [];

const intersectionOfRowWithSensorArea = (row, sensorWithBeacon) => {
  const manhatanDistance = sensorWithBeacon.manhatanDistance;

  const rowDistanceFromSensorToRow = sensorWithBeacon.sensor.row - row;

  if (!(manhatanDistance - Math.abs(rowDistanceFromSensorToRow) < 0)) {
    return {
      start:
        sensorWithBeacon.sensor.column -
        (manhatanDistance - Math.abs(rowDistanceFromSensorToRow)),
      stop:
        sensorWithBeacon.sensor.column +
        (manhatanDistance - Math.abs(rowDistanceFromSensorToRow)),
    };
  }

  return null;
};

const targetPoint = {};

for (let i = mapLimits.minRow; i < mapLimits.maxRow; i++) {
  if (i % 100000 === 0) {
    console.log(i);
  }
  const distancesToCurrentRow =
    sensorsWithBeaconsWithManhatanDistanceSortedDesc.map((x) => ({
      ...x,
      distance: x.manhatanDistance - Math.abs(x.sensor.row - i),
    }));

  const sensorsThatReachRow = distancesToCurrentRow.filter(
    (x) => x.distance > 0
  );

  // console.log(i, sensorsWithBeaconsWithManhatanDistanceSortedDesc.length, sensorsThatReachRow.length);

  if (sensorsThatReachRow.length > 0) {
    const intersectionsForRow = sensorsThatReachRow.map((sensor) =>
      intersectionOfRowWithSensorArea(i, sensor)
    );

    intersectionsForRow.sort((a, b) => a.start - b.start);
    // console.log("intersectionsForRow", intersectionsForRow);

    const testRange = intersectionsForRow.reduce(
      (a, b) => {
        if (
          a.valid &&
          !(
            a.intersection.stop < b.start - 1 ||
            b.stop < a.intersection.start - 1
          )
        ) {
          return {
            intersection: {
              start: Math.min(a.intersection.start, b.start),
              stop: Math.max(a.intersection.stop, b.stop),
            },
            valid: a.valid,
          };
        }
        return { ...a, valid: false };
      },
      { intersection: intersectionsForRow[0], valid: true }
    );

    // console.log("testRange", i, testRange);
    if (!testRange.valid) {
      targetPoint.row = i;
      targetPoint.column = testRange.intersection.stop + 1;
      break;
    }
  }
}

console.log(`Target point: ${targetPoint.row}, ${targetPoint.column}`);

console.log(`Final result: ${targetPoint.column * 4000000 + targetPoint.row}`);
