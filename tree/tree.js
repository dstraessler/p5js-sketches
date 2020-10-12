function Tree() {
  let startPos = createVector(width / 2, height * 0.6);
  let startDir = createVector(0, -1);

  let targets = [];
  for (let i = 0; i < 250; i++) {
    let targetPos;
    let dist;
    do {
      targetPos = createVector(random(width), random(height * 0.05, height * 0.4));
      dist = targetPos.copy().sub(startPos).mag();
    } while ((dist > width * 0.5) || (dist < width * 0.25))

    targets.push(new TargetPoint(targetPos));
  }
  this.spanningtree = new SpanningTree(targets, startPos, startDir, 0.02, 0.1);

  this.grow = function() {
    this.spanningtree.grow()
  }

  this.show = function() {
    for (let i = 0; i < this.spanningtree.branches.length; i++) {
      if (this.spanningtree.branches[i].parent != null) {
        // draw branch
        stroke(255);
        line(this.spanningtree.branches[i].pos.x,
          this.spanningtree.branches[i].pos.y,
          this.spanningtree.branches[i].parent.pos.x,
          this.spanningtree.branches[i].parent.pos.y);
        // draw leaves
        if (this.spanningtree.branches[i].dist == 0) {
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
  };
}