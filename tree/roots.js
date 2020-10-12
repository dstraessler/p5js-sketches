function Roots() {
  let startPos = createVector(width / 2, height * 0.6);
  let startDir = createVector(0, 1);

  let targets = [];
  for (let i = 0; i < 250; i++) {
    let targetPos;
    do {
      targetPos = createVector(random(width),
        random(height * 0.62, height * 0.95));
    } while (targetPos.copy().sub(startPos).mag() > width * 0.33)

    targets.push(new TargetPoint(targetPos));
  }
  this.spanningtree = new SpanningTree(targets, startPos, startDir, 0.03, 0.2);

  this.grow = function() {
    this.spanningtree.grow()
  }

  this.show = function() {
    for (let i = 0; i < this.spanningtree.targets.length; i++) {
      this.spanningtree.targets[i].show();
    }

    for (let i = 0; i < this.spanningtree.branches.length; i++) {
      if (this.spanningtree.branches[i].parent != null) {
        stroke(255);
        line(this.spanningtree.branches[i].pos.x,
          this.spanningtree.branches[i].pos.y,
          this.spanningtree.branches[i].parent.pos.x,
          this.spanningtree.branches[i].parent.pos.y);
      }
    }
  };
}