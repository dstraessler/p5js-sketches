function Tree() {
  let startPos = createVector(width / 2, height * 0.6);
  let startDir = createVector(0, -1);

  let targets = [];
  let n = int(width / 3);
  for (let i = 0; i < n; i++) {
    let targetPos;
    let d;
    do {
      targetPos = createVector(random(width), random(height * 0.05, height * 0.4));
      d = targetPos.copy().sub(startPos).mag();
    } while ((d > width * 0.5) || (d < width * 0.25))

    targets.push(new TargetPoint(targetPos));
  }
  this.spanningtree = new SpanningTree(targets, startPos, startDir, 0.02, 0.1);

  this.grow = function() {
    this.spanningtree.grow()
  }

  this.show = function() {
    for (let i = 0; i < this.spanningtree.targets.length; i++) {
      this.spanningtree.targets[i].show();
    }

    let strokeWeightScale = 0.01;

    for (let i = 0; i < this.spanningtree.branches.length; i++) {
      if (this.spanningtree.branches[i].parent != null) {
        // draw branch
        stroke(255);
        strokeWeight(this.spanningtree.branches[i].size * strokeWeightScale);
        noFill();
        line(this.spanningtree.branches[i].pos.x,
          this.spanningtree.branches[i].pos.y,
          this.spanningtree.branches[i].parent.pos.x,
          this.spanningtree.branches[i].parent.pos.y);
        // draw leaves
        strokeWeight(1);
        if (this.spanningtree.branches[i].size < 1.0) {
          for (let k = 0; k < 10; k++) {
            let leafPos = this.spanningtree.branches[i].pos.copy();
            let a = width / 50;
            leafPos.add(createVector(random(-a, a), random(-a, a)));
            let size = random(1, 3);
            ellipse(leafPos.x, leafPos.y, size, size);
          }
        }
      }
    }
    return this.spanningtree.branches[0].size * strokeWeightScale;
  };
}