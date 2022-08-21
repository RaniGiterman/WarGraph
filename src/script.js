const appWidth = 800;
const appHeight = 800;
const target_amount = 8;
const targetArr = [];

const app = new PIXI.Application({
  backgroundColor: 0xffffff,
  height: appHeight,
  width: appWidth,
});
document.querySelector(".game").appendChild(app.view);

window.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    fire();
  }
});

// draw targets at random places
for (let i = 0; i < target_amount; i++) {
  const ballSize = Math.floor(Math.random() * 30) + 5;
  const ball_x =
    Math.floor(Math.random() * appWidth - ballSize * 2) + ballSize * 2;
  const ball_y =
    Math.floor(Math.random() * appHeight - ballSize * 2) + ballSize * 2;

  const target = new PIXI.Graphics();
  target.beginFill(0xff3333);
  target.drawCircle(0, 0, ballSize);
  target.endFill();
  target.x = ball_x;
  target.y = ball_y;
  target.sign = target.x + target.y + i;
  app.stage.addChild(target);
  targetArr.push({ x: target.x, y: target.y, r: ballSize, obj: target });
}

// draw y_axis
var y_axis = new PIXI.Graphics();
y_axis.lineStyle(1, 0x000000, 1);
y_axis.position.x = appWidth / 2;
y_axis.position.y = 0;
y_axis.moveTo(5, 0);
y_axis.lineTo(5, appHeight);

// draw x_axis
var x_axis = new PIXI.Graphics();
x_axis.lineStyle(1, 0x000000, 1);
x_axis.position.x = 0;
x_axis.position.y = appHeight / 2;
x_axis.moveTo(0, 5);
x_axis.lineTo(appWidth, 5);

app.stage.addChild(y_axis);
app.stage.addChild(x_axis);

// function fireDegree() {
//   let val = document.getElementById("val").value;
//   val = parseInt(val);
//   valInRadian = (val * Math.PI) / 180;

//   var line = new PIXI.Graphics();
//   line.lineStyle(4, 0xff3333, 1);
//   line.position.x = appWidth / 2;
//   line.position.y = appHeight / 2;
//   line.rotation = valInRadian; // in radiants - use google to convert degrees to radiants
//   line.moveTo(5, 0);
//   line.lineTo(5, 200);
//   line.lineTo(2.5, -200);

//   app.stage.addChild(line);
// }

function fire() {
  for (let x = -appWidth / 2; x < appWidth / 2; x += 1) {
    let equation = document.getElementById("eq").value;
    let y;
    try {
      // y = eval(equation.replace("x", `*(${x})`));
      let s = interpret(equation, x);
      y = eval(s);
    } catch (error) {
      continue;
    }

    checkHitTarget(x + appWidth / 2, y * -1 + appHeight / 2);
    draw(x, y);
  }
}

function interpret(equation, x) {
  let newEquation = "";
  for (let i = 0; i < equation.length; i++) {
    if (equation[i] == "x") {
      if (!isNaN(equation[i - 1])) {
        // number before
        newEquation += `*(${x})`;
      } else {
        // no number before
        newEquation += `(${x})`;
      }
      continue;
    }
    if (equation[i] == "^") {
      newEquation += "**";
      continue;
    }
    newEquation += equation[i];
  }

  newEquation = newEquation.replace("sin", "Math.sin");
  newEquation = newEquation.replace("cos", "Math.cos");
  newEquation = newEquation.replace("tan", "Math.tan");

  return newEquation;
}

function draw(x, y) {
  const func_width = 3;
  const func_dot = new PIXI.Graphics();
  func_dot.beginFill(0x000000);
  func_dot.drawCircle(0, 0, func_width);
  func_dot.endFill();
  func_dot.x = x + appWidth / 2;
  func_dot.y = y * -1 + appHeight / 2;
  app.stage.addChild(func_dot);
}

function animationHit(target) {
  let x = setInterval(() => {
    if (checkIndexCollideWithWall(target)) return clearInterval(x);

    target.obj.y -= 1;
  }, 1);
}

function checkIndexCollideWithWall(index) {
  if (
    index.x >= appWidth ||
    index.x <= 0 ||
    index.y >= appHeight ||
    index.y <= 0
  )
    return true;

  return false;
}

function checkHitTarget(x, y) {
  for (let i = 0; i < targetArr.length; i++) {
    let side1 = targetArr[i].x - x;
    let side2 = targetArr[i].y - y;

    let resultSides = side1 * side1 + side2 * side2;
    if (targetArr[i].r >= Math.sqrt(resultSides)) {
      // collides
      // targetArr[i].obj.destroy();
      animationHit(targetArr[i]);
      targetArr.splice(i, 1);
      if (targetArr.length <= 0) {
        document.getElementById("status").textContent = "You won!";
        setTimeout(() => {
          location.reload();
        }, 1500);
      }
    }
  }
}
