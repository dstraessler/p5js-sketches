let backgroundColor = 40;  // dark grey

function setup() {
  let w = min(windowWidth - 20, 800);
  let h = min(int(windowHeight - 90), w * 0.67)
  createCanvas(w, h);
}

function draw() {
  background(backgroundColor);
}

function windowResized() {
  let w = min(windowWidth - 20, 800);
  let h = min(int(windowHeight - 90), w * 0.67)
  resizeCanvas(w, h);
}
