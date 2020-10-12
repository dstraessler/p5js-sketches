let roots;
let tree;
let groundPath;

function setup() {
  let size = min(int(windowWidth - 20), int(windowHeight - 90))
  size = min(size, 800);
  createCanvas(size, size);

  roots = new Roots();
  tree = new Tree();
  groundPath = new Array(int(width / 2));
  for (let i = 0; i < groundPath.length; i++) {
    groundPath[i] = int(height * 0.6) + random(-2, 2);
  }
  frameRate(10);
}

function draw() {
  background(40);

  stroke(255);
  let xTicks = width / (groundPath.length - 1.0);
  fill(51);
  stroke(150);
  beginShape();
  for (let i = 0; i < groundPath.length; i++) {
    vertex(i * xTicks, groundPath[i]);
  }
  vertex(width, height);
  vertex(0, height);
  vertex(0, groundPath[0])
  endShape(CLOSE);

  roots.show();
  tree.show();

  roots.grow();
  tree.grow();
}

function mouseClicked() {
  roots = new Roots();
  tree = new Tree();
}

function windowResized() {
  let size = min(int(windowWidth - 20), int(windowHeight - 90))
  size = min(size, 800);
  createCanvas(size, size);

  roots = new Roots();
  tree = new Tree();

  groundPath = new Array(int(width / 2));
  for (let i = 0; i < groundPath.length; i++) {
    groundPath[i] = int(height * 0.6) + random(-2, 2);
  }
}