const disableUi = false; // UI for capture gif
const SAVE_GIF = false; // auto-capture gif from 1st frame
const SAVE_FRAME = -1; // choose which frame to save as image (e.g. 250)
const FRAME_RATE = 30;
const ANIMATION_DURATION = 260 * 2;
const DRAWING_CALORIES_DURATION = 260;

let data;
let summedCalories;
let maxCalories;
let caloriesCount;
let top3Calories;
const ease = new p5.Ease();
const easingStyle = "doubleExponentialSigmoid";
const slope = 0.75;

const P5_CAPTURE_DEFAULT_OPTIONS = {
  disableUi,
  format: "gif",
};

P5Capture.setDefaultOptions(P5_CAPTURE_DEFAULT_OPTIONS);

function setup() {
  createCanvas(640, (320 * 2) / 3);
  frameRate(FRAME_RATE);

  data = document
    .querySelector("#iframeData")
    .contentDocument.getElementsByTagName("body")[0].textContent;

  summedCalories = data.split("\n\n").reduce((acc, val) => {
    acc.push(
      val
        .split("\n")
        .map(Number)
        .reduce((a, b) => a + b)
    );
    return acc;
  }, []);

  caloriesCount = summedCalories.length;
  maxCalories = Math.max(...summedCalories);
  top3Calories = [...summedCalories]
    .map((val, index) => ({ val, index }))
    .sort((a, b) => b.val - a.val)
    .slice(0, 3)
    .reverse();
}

let positionOfTheAnimation = 0;

function draw() {
  const frameCountLoop = frameCount % (ANIMATION_DURATION / 2);

  positionOfTheAnimation += 2;
  positionOfTheAnimation = positionOfTheAnimation % ANIMATION_DURATION;

  saveToGif();
  saveImage();

  background("#142850");

  const positionWithEasing = ease[easingStyle](
    map(positionOfTheAnimation, 0, DRAWING_CALORIES_DURATION, 0, 1, true)
  );
  const opositePositionWithEasing = map(
    positionWithEasing,
    0,
    1,
    0,
    DRAWING_CALORIES_DURATION
  );

  // drawWithoutEasing(positionOfTheAnimation);
  drawWithEasing(opositePositionWithEasing);

  highlightTop3Calories(frameCountLoop);
}

function drawWithoutEasing(positionOfTheAnimation) {
  summedCalories.forEach((summedCalorie, summedCalorieIndex) => {
    stroke(255, 123, 147, 255 / 2);
    strokeWeight(2);

    const mappedI = map(summedCalorieIndex, -1, caloriesCount - 1, 0, width);
    const maxMappedHeight = Math.floor(
      map(summedCalorie, 0, maxCalories, 0, height - 20)
    );

    const position = positionOfTheAnimation - summedCalorieIndex;

    const mappedHeight = constrain(
      (position * maxMappedHeight) / 10,
      0,
      maxMappedHeight
    );

    line(mappedI, height, mappedI, height - mappedHeight);
  });
}

function drawWithEasing(opositePositionWithEasing) {
  summedCalories.forEach((summedCalorie, summedCalorieIndex) => {
    stroke(12, 123, 147);
    strokeWeight(2);

    const mappedI = map(summedCalorieIndex, -1, caloriesCount - 1, 0, width);
    const maxMappedHeight = Math.floor(
      map(summedCalorie, 0, maxCalories, 0, height - 20)
    );

    const position = opositePositionWithEasing - summedCalorieIndex;

    const mappedHeight = constrain(
      (position * maxMappedHeight) / 10,
      0,
      maxMappedHeight
    );

    line(mappedI, height, mappedI, height - mappedHeight);
  });
}

const highlightTop3Calories = (frameCountLoop) => {
  top3Calories.forEach((topCalories, topCaloriesOrder) => {
    if (
      frameCountLoop * 2 >
      DRAWING_CALORIES_DURATION + FRAME_RATE * topCaloriesOrder * 2 + 20
    ) {
      const maxMappedHeight = Math.floor(
        map(topCalories.val, 0, maxCalories, 0, height - 20)
      );
      const mappedI = map(topCalories.index, -1, caloriesCount, 0, width);
      stroke("#00A8CC");
      strokeWeight(2);
      line(mappedI, height, mappedI, height - maxMappedHeight);
    }
  });
};

const saveToGif = () => {
  if (frameCount === 1 && SAVE_GIF) {
    const capture = P5Capture.getInstance();
    capture.start({
      format: "gif",
      duration: ANIMATION_DURATION / 2,
    });
  }
};

const saveImage = () => {
  if (SAVE_FRAME > -1 && frameCount === SAVE_FRAME) {
    save("snapshot.png");
  }
};
