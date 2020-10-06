let path;
let fullPathX;
let fullPathY;
let millisOld = 0;
let mouseClickIdx = 0;
let backgroundColor = 40;  // dark grey

function setup() {
  let w = min(windowWidth - 20, 800);
  let h = min(int(windowHeight * 0.8), w * 0.67)
  createCanvas(w, h);

  // path: left half of the screen with the actual path
  // including the superposed random numbers
  path = new Array(51);
  // fullPath: full screen, smooth path without random numbers
  // on the left side, calculated spline path on the right side
  fullPathX = new Array(101);
  fullPathY = new Array(101);
  
  for(let i=0; i<fullPathX.length; ++i) {
    fullPathX[i] = width / 100.0 * i;
    fullPathY[i] = height * 0.67;
  }
  for(let i=0; i<path.length; ++i) {
    path[i] = round(fullPathY[i]) + random(-2, 2);
  }
}

function draw() {
  background(backgroundColor);
  stroke(255);

  let m = millis();
  let updateMillis = 20;  // "speed" in ms for 5 px

  // draw path
  for(let i=0; i<(path.length-1); ++i) {
      line(fullPathX[i], path[i], fullPathX[i+1], path[i+1]);
  }
  for(let i=path.length; i<(fullPathX.length-1); i=i+2) {
    line(fullPathX[i], fullPathY[i], fullPathX[i+1], fullPathY[i+1]);
  }
  if (mouseClickIdx >= path.length) {
    ellipse(fullPathX[mouseClickIdx], fullPathY[mouseClickIdx], 10, 10);
  }

  // draw bicycle
  let slope = (fullPathY[15] - fullPathY[45]) /
              (fullPathX[45] - fullPathX[15]);
  let pedalAngle = updateMillis / 20.0 * m / 1500.0 * TWO_PI;
  let bodyPosition = slope * 2.0;
  translate(fullPathX[30], fullPathY[30] + (width / 50.0));
  rotate(-slope * PI / 4.0);
  drawBicycle(width / 4, pedalAngle, bodyPosition);
  
  // update path if 'updateMillis' have elapsed since last update 
  if ((m - millisOld) > updateMillis) {
    for(let i=0; i<(fullPathY.length-1); ++i) {
        fullPathY[i] = fullPathY[i+1];
    }
    for(let i=0; i<(path.length-1); ++i) {
        path[i] = path[i+1];
    }
    path[path.length-1] = round(fullPathY[path.length-1]) + random(-2, 2);
    if (mouseClickIdx > 0) {
      mouseClickIdx--;
    }

    millisOld = m;
  }
}

/**
 * Draw bicycle routine.
 * Note: Use the translate() and rotate() functions to move the position.
 * @param {number} px            Scale factor in pixels.
 * @param {number} pedalAngle    Angle of the pedals in randians.
 * @param {number} bodyPosition  Body position on the bisycle
 *                               (-1: back down, 0: normal, 1: upright).
 */
function drawBicycle(px, pedalAngle, bodyPosition) {
  noFill();

  // constants
  let frontWheelCenter = createVector(px * 0.28, px * -0.19);
  let rearWheelCenter = createVector(px * -0.28, px * -0.19);
  let wheelDiameter = px * 0.38;
  let pedalCenter = createVector(px * -0.05, px * -0.14);
  let frontSprocketDiameter = px * 0.1;
  let rearSprocketDiameter = px * 0.05;
  let saddleCenter = createVector(px * -0.18, px * -0.55);
  let handleBarStart = createVector(px * 0.17, px * -0.50);
  
  // body proportions
  let headDiameter = px * 0.14;
  let lenHalfLegs = headDiameter * 2.0;
  let lenArm = headDiameter * 3.0;
  
  // helper variables for calculations
  let v1;
  let v2;
  let v3;
  let v4;
  
  // limit parameter to -1f ... 1f
  bodyPosition = max(bodyPosition, -1);
  bodyPosition = min(bodyPosition, 1);
  
  // tyres
  fill(backgroundColor);
  ellipse(frontWheelCenter.x, frontWheelCenter.y, wheelDiameter, wheelDiameter);
  ellipse(rearWheelCenter.x, rearWheelCenter.y, wheelDiameter, wheelDiameter);
  
  // frame
  line(handleBarStart.x, handleBarStart.y,
       frontWheelCenter.x, frontWheelCenter.y);
  v1 = pedalCenter.copy();
  v1.sub(saddleCenter).setMag(px * 0.13);
  v1.add(saddleCenter);
  line(v1.x, v1.y, rearWheelCenter.x, rearWheelCenter.y);
  v2 = frontWheelCenter.copy();
  v2.sub(handleBarStart).setMag(px * 0.05);
  v2.add(handleBarStart);
  line(v1.x, v1.y, v2.x, v2.y);
  line(pedalCenter.x, pedalCenter.y, rearWheelCenter.x, rearWheelCenter.y);
  line(pedalCenter.x, pedalCenter.y, saddleCenter.x, saddleCenter.y);
  v2 = frontWheelCenter.copy();
  v2.sub(handleBarStart).setMag(px * 0.07);
  v2.add(handleBarStart);
  line(pedalCenter.x, pedalCenter.y, v2.x, v2.y);
  line(handleBarStart.x, handleBarStart.y,
       handleBarStart.x + px * 0.06, handleBarStart.y);
  line(saddleCenter.x - px * 0.04, saddleCenter.y,
       saddleCenter.x + px * 0.06, saddleCenter.y);
  arc(handleBarStart.x + px * 0.06, handleBarStart.y + px * 0.04,
      px * 0.08, px * 0.08, -HALF_PI, HALF_PI);
  
  // front wheel center point
  fill(backgroundColor);
  ellipse(frontWheelCenter.x, frontWheelCenter.y, px * 0.02, px * 0.02);
  
  // rear wheel center point
  ellipse(rearWheelCenter.x, rearWheelCenter.y,
          rearSprocketDiameter, rearSprocketDiameter);
  
  // top chain connecting the sprockets
  v1 = rearWheelCenter.copy();
  v1.sub(pedalCenter).rotate(HALF_PI).setMag(rearSprocketDiameter / 2.0);
  v1.add(rearWheelCenter);
  v2 = rearWheelCenter.copy();
  v2.sub(pedalCenter).rotate(HALF_PI).setMag(frontSprocketDiameter / 2.0);
  v2.add(pedalCenter);
  line(v1.x, v1.y, v2.x, v2.y);
  
  // bottom chain connecting the sprockets
  v1 = rearWheelCenter.copy();
  v1.sub(pedalCenter).rotate(-HALF_PI).setMag(rearSprocketDiameter / 2.0);
  v1.add(rearWheelCenter);
  v2 = rearWheelCenter.copy();
  v2.sub(pedalCenter).rotate(-HALF_PI).setMag(frontSprocketDiameter / 2.0);
  v2.add(pedalCenter);
  line(v1.x, v1.y, v2.x, v2.y);
  
  // upper body
  // v1 -> hip position
  // bodyPosition:
  // -1.0 -> sitting with back down ... 0.0 -> normal ... 1.0 -> fully upright
  v1 = saddleCenter.copy();
  v2 = p5.Vector.fromAngle(-PI * 0.02);
  v2.setMag(max(bodyPosition, 0.0) * px * 0.25);
  v1.add(v2);
  // v2 -> head position - angle depends on bodyPosition and pedalAngle
  v2 = v1.copy();
  let upperBodyAngle;
  if (bodyPosition < 0.0) {
     upperBodyAngle = -PI * (bodyPosition * 0.12 + 0.15) +
                      0.01 * cos(pedalAngle * 2.0);
  } else {
     upperBodyAngle = -PI * (bodyPosition * 0.2 + 0.15) +
                      0.01 * cos(pedalAngle * 2.0);
  }
  v2.add(p5.Vector.fromAngle(upperBodyAngle).setMag(lenHalfLegs * 1.5));
  line(v1.x, v1.y, v2.x, v2.y);
  ellipse(v2.x, v2.y, headDiameter, headDiameter);
  // cap
  v3 = v2.copy().add(p5.Vector.fromAngle(-PI * 0.08).setMag(headDiameter / 2));
  v4 = v2.copy().add(p5.Vector.fromAngle(-PI * 0.8).setMag(headDiameter / 2));
  line(v3.x, v3.y, v4.x, v4.y);
  v4 = v2.copy().add(p5.Vector.fromAngle(-PI * 0.1).setMag(headDiameter / 1.5));
  line(v3.x, v3.y, v4.x, v4.y);
  // arm
  v3 = v1.copy();
  v3.sub(v2).setMag(px * 0.12);
  v3.add(v2);
  v2 = handleBarStart.copy().add(p5.Vector.fromAngle(0).setMag(px * 0.02));
  v4 = calcIntersectionOfTwoCircles(v3, lenArm * 0.5, v2, lenArm * 0.5, false);
  line(v3.x, v3.y, v4.x, v4.y);
  line(v2.x, v2.y, v4.x, v4.y);
  
  // saddle
  v2 = saddleCenter.copy().add(p5.Vector.fromAngle(-PI).setMag(px * 0.04));
  v3 = saddleCenter.copy().add(p5.Vector.fromAngle(0).setMag(px * 0.06));
  line(v2.x, v2.y, v3.x, v3.y);
  
  // pedal position (leg in the background)
  v2 = pedalCenter.copy();
  v2.add(p5.Vector.fromAngle(pedalAngle + PI).setMag(frontSprocketDiameter));
  line(pedalCenter.x, pedalCenter.y, v2.x, v2.y);
  line(v2.x - px * 0.02, v2.y, v2.x + px * 0.02, v2.y);
  
  // leg connecting v1 (current hip position) with
  // v2 (current pedal middle position)
  v3 = calcIntersectionOfTwoCircles(v1, lenHalfLegs, v2, lenHalfLegs, true);
  line(v1.x, v1.y, v3.x, v3.y);
  line(v3.x, v3.y, v2.x, v2.y);
  
  ellipse(pedalCenter.x, pedalCenter.y,
          frontSprocketDiameter, frontSprocketDiameter);
  
  // pedal position (foreground)
  v2 = pedalCenter.copy();
  v2.add(p5.Vector.fromAngle(pedalAngle).setMag(frontSprocketDiameter));
  line(pedalCenter.x, pedalCenter.y, v2.x, v2.y);
  line(v2.x - px * 0.02, v2.y, v2.x + px * 0.02, v2.y);
  
  // leg connecting v1 (current hip position) with
  // v2 (current pedal middle position)
  v3 = calcIntersectionOfTwoCircles(v1, lenHalfLegs, v2, lenHalfLegs, true);
  line(v1.x, v1.y, v3.x, v3.y);
  line(v3.x, v3.y, v2.x, v2.y);
}

/**
 * Find the intersection point of two circles.
 * @param {p5.Vector} v1              Center point of first circle.
 * @param {number} r1                 Radius of first circle.
 * @param {p5.Vector} v2              Center point of first circle.
 * @param {number} r2                 Radius of second circle.
 * @param {boolean} returnOtherPoint  Choose which of the two available results
 *                                    shall be returned.
  * @returns {p5.Vector}              Calculated intersection point.
 */
function calcIntersectionOfTwoCircles(
    v1, r1, v2, r2, returnOtherPoint) {
  let c = v1.copy().sub(v2).mag();
  let x = (pow(r1, 2.0) + pow(c, 2.0) - pow(r2, 2.0)) / (2.0 * c);
  let y = sqrt(pow(r1, 2.0) - pow(x, 2.0));
  let e0 = v2.copy().sub(v1).setMag(1.0 / c);
  let e1 = createVector(-e0.y, e0.x);
  let p = v1.copy().add(e0.setMag(x));
  if (returnOtherPoint == false) {
    p.add(e1.setMag(y));
  } else {
    p.sub(e1.setMag(y));
  }
  return p;
}

/**
 * Calculate new path according to new position given by mouse click action.
 */
function mouseClicked() {
  let y1 = fullPathY[path.length-1];
  let slope1 = (fullPathY[path.length-1] - fullPathY[path.length-2]) /
               (fullPathX[path.length-1] - fullPathX[path.length-2]);
  let x2 = width - fullPathX[path.length];
  let y2 = mouseY;
  y2 = max(y2, height * 0.35);
  y2 = min(y2, height * 0.95);

  // calculate new path using a cubical spline between 2 points
  // spline: y = a[0]*x^3 + a[1]*x^2 + a[2]*x + a[3]
  let a = new Array(4);

  // spline coefficient calculation
  a[3] = y1;
  a[2] = slope1;
  a[1] = (-2.0*a[2]*x2-3.0*a[3]+3.0*y2)/pow(x2, 2.0);
  a[0] = (a[2]*x2+2.0*a[3]-2.0*y2)/pow(x2, 3.0);
  
  // calculate y points
  for(let i=path.length; i<fullPathX.length; ++i) {
    let x = fullPathX[i] - fullPathX[path.length];
    fullPathY[i] = a[0]*pow(x, 3) + a[1]*pow(x, 2) + a[2]*x + a[3];
  }

  mouseClickIdx = fullPathX.length - 1;
}

function windowResized() {
  let w = min(windowWidth - 20, 800);
  let h = min(int(windowHeight * 0.8), w * 0.67)
  resizeCanvas(w, h);
  
  // reset path
  for(let i=0; i<fullPathX.length; ++i) {
    fullPathX[i] = width / 100.0 * i;
    fullPathY[i] = height * 0.67;
  }
  for(let i=0; i<path.length; ++i) {
    path[i] = round(fullPathY[i]) + random(-2, 2);
  }
}
