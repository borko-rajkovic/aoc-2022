const fs = require("fs");
const path = require("path");
const file_name = "input.txt";

const input = fs.readFileSync(__dirname + path.sep + file_name, "utf8");

const blueprints = input
  .trim()
  .split("\n")
  .map((x) =>
    /^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/g.exec(
      x
    )
  )
  .map((x) => {
    const blueprintId = Number(x[1]);
    const oreRobotCostOre = Number(x[2]);
    const clayRobotCostOre = Number(x[3]);
    const obsidianRobotCostOre = Number(x[4]);
    const obsidianRobotCostClay = Number(x[5]);
    const geodeRobotCostOre = Number(x[6]);
    const geodeRobotCostObsidian = Number(x[7]);

    const maxSpendingOre = Math.max(
      oreRobotCostOre,
      clayRobotCostOre,
      obsidianRobotCostOre,
      geodeRobotCostOre
    );

    return {
      blueprintId,
      robots: [
        { type: "ore", costs: { ore: oreRobotCostOre } },
        { type: "clay", costs: { ore: clayRobotCostOre } },
        {
          type: "obsidian",
          costs: {
            ore: obsidianRobotCostOre,
            clay: obsidianRobotCostClay,
          },
        },
        {
          type: "geode",
          costs: {
            ore: geodeRobotCostOre,
            obsidian: geodeRobotCostObsidian,
          },
        },
      ],
      maxSpendPerRound: {
        ore: maxSpendingOre,
        clay: obsidianRobotCostClay,
        obsidian: geodeRobotCostObsidian,
      },
    };
  });

// https://www.youtube.com/watch?v=H3PSODv4nf0
const dfs = (blueprint, cache, timeLeft, robots, resources) => {

  if (timeLeft === 0) {
    return resources.geode;
  }

  const memoizationKey = `${timeLeft}_${robots.ore}_${robots.clay}_${robots.obsidian}_${robots.geode}_${resources.ore}_${resources.clay}_${resources.obsidian}_${resources.geode}`;

  if (cache[memoizationKey]) {
    return cache[memoizationKey];
  }

  // if we do nothing (do not build any robot at this point)
  let maxGeodesProduced = resources.geode + robots.geode * timeLeft;

  // if we choose to build some type of robot
  for (const robot of blueprint.robots) {
    if (
      robot.type !== "geode" &&
      robots[robot.type] >= blueprint.maxSpendPerRound[robot.type]
    ) {
      continue;
    }

    let timeWaitAmount = 0;
    let canBuildRobot = true;

    for (const [typeOfResource, amountOfResource] of Object.entries(
      robot.costs
    )) {
      // To build a robot we need resources
      //
      // We are trying here to calculate amount of time needed to build the robot for this particular traversal path
      //
      // If there are no robots that produce some of the resources we need to build this particular robot,
      // then we must abort the attempt to wait for those resources to be gathered
      if (robots[typeOfResource] === 0) {
        canBuildRobot = false;
        break;
      }
      timeWaitAmount = Math.max(
        timeWaitAmount,
        Math.ceil(
          (amountOfResource - resources[typeOfResource]) /
            robots[typeOfResource]
        )
      );
    }

    const remainingTime = timeLeft - timeWaitAmount - 1;

    if (remainingTime > 0 && canBuildRobot) {
      const newRobots = JSON.parse(JSON.stringify(robots));
      const newResources = {
        ore: resources["ore"] + newRobots["ore"] * (timeWaitAmount + 1),
        clay: resources["clay"] + newRobots["clay"] * (timeWaitAmount + 1),
        obsidian:
          resources["obsidian"] + newRobots["obsidian"] * (timeWaitAmount + 1),
        geode: resources["geode"] + newRobots["geode"] * (timeWaitAmount + 1),
      };
      for (const [typeOfResource, amountOfResource] of Object.entries(
        robot.costs
      )) {
        newResources[typeOfResource] -= amountOfResource;
      }
      newRobots[robot.type] += 1;

      // optimization here (throw away unused resources):

      newResources.ore = Math.min(
        newResources.ore,
        blueprint.maxSpendPerRound.ore * remainingTime
      );
      newResources.clay = Math.min(
        newResources.clay,
        blueprint.maxSpendPerRound.clay * remainingTime
      );
      newResources.obsidian = Math.min(
        newResources.obsidian,
        blueprint.maxSpendPerRound.obsidian * remainingTime
      );

      maxGeodesProduced = Math.max(
        maxGeodesProduced,
        dfs(blueprint, cache, remainingTime, newRobots, newResources)
      )
    }
  }

  cache[memoizationKey] = maxGeodesProduced;

  return maxGeodesProduced;
};

let result = 0;

for (const blueprint of blueprints) {
  const totalGeodesProduced = dfs(
    blueprint,
    {},
    24,
    { ore: 1, clay: 0, obsidian: 0, geode: 0 },
    { ore: 0, clay: 0, obsidian: 0, geode: 0 }
  );

  result += blueprint.blueprintId * totalGeodesProduced;
}

console.log(result);
