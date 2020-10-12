/* Space colonization algorithm to draw roots
 * http://algorithmicbotany.org/papers/colonization.egwnp2007.html
 *
 * Spanning tree keeping track of all branches.
 */

function SpanningTree(targets, rootPos, rootDir, minDist, maxDist) {
  this.targets = targets;
  this.branches = [];
  this.minDist = minDist * width;
  this.maxDist = maxDist * width;

  let root = new Branch(null, rootPos, rootDir);
  this.branches.push(root);
  let current = root;
  let found = false;
  while (!found) {
    for (let i = 0; i < this.targets.length; i++) {
      let d = p5.Vector.dist(current.pos, this.targets[i].pos);
      if (d < this.maxDist) {
        found = true;
      }
    }
    if (!found) {
      let branch = current.next();
      current = branch;
      this.branches.push(current);
    }
  }

  this.grow = function() {
    for (let i = 0; i < this.targets.length; i++) {
      let leaf = this.targets[i];
      let closestBranch = null;
      let record = this.maxDist;
      for (let j = 0; j < this.branches.length; j++) {
        let branch = this.branches[j];
        let d = p5.Vector.dist(leaf.pos, branch.pos);
        if (d < this.minDist) {
          leaf.reached = true;
          closestBranch = null;
          break;
        } else if (d < record) {
          closestBranch = branch;
          record = d;
        }
      }

      if (closestBranch != null) {
        let newDir = p5.Vector.sub(leaf.pos, closestBranch.pos);
        newDir.normalize();
        closestBranch.dir.add(newDir);
        closestBranch.count++;
      }
    }

    for (let i = this.targets.length - 1; i >= 0; i--) {
      if (this.targets[i].reached) {
        this.targets.splice(i, 1);
      }
    }

    for (let i = this.branches.length - 1; i >= 0; i--) {
      let branch = this.branches[i];
      if (branch.count > 0) {
        branch.dir.div(branch.count + 1);
        this.branches.push(branch.next());
        branch.reset();
      }
    }
  };
}