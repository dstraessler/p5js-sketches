function Roots() {
  let startPos = createVector(width / 2, height * 0.6);
  let startDir = createVector(0, 1);

  let targets = [];
  let n = int(width / 2);
  for (let i = 0; i < n; i++) {
    let targetPos;
    let d;
    do {
      targetPos = createVector(random(width),
        random(height * 0.62, height * 0.95));
      d = targetPos.copy().sub(startPos).mag();
    } while (d > width * 0.38)

    targets.push(new TargetPoint(targetPos));
  }
  this.spanningtree = new SpanningTree(targets, startPos, startDir, 0.02, 0.2);

  this.grow = function() {
    this.spanningtree.grow()
  }

  this.show = function(targetSizeOfBeginning) {
    for (let i = 0; i < this.spanningtree.targets.length; i++) {
      this.spanningtree.targets[i].show();
    }

    let strokeWeightScale = targetSizeOfBeginning /
      this.spanningtree.branches[0].size;

    for (let i = 0; i < this.spanningtree.branches.length; i++) {
      if (this.spanningtree.branches[i].parent != null) {
        stroke(255);
        strokeWeight(this.spanningtree.branches[i].size * strokeWeightScale);
        line(this.spanningtree.branches[i].pos.x,
          this.spanningtree.branches[i].pos.y,
          this.spanningtree.branches[i].parent.pos.x,
          this.spanningtree.branches[i].parent.pos.y);
      }
    }
  };
}