/* Space colonization algorithm to draw roots and branches.
 * http://algorithmicbotany.org/papers/colonization.egwnp2007.html
 *
 * Spanning tree keeping track of all branches.
 */

function SpanningTree(targets, rootPos, rootDir, minDist, maxDist) {
  this.targets = targets;
  this.branches = [];
  this.minDist = minDist * width;
  this.maxDist = maxDist * width;

  // initialize by going straight forward until we are in maxDist proximity of
  // the first attraction point
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
  // update the distance of all parents from the last branch
  let totalDistFromTip = 0;
  while (current.parent != null) {
    current = current.parent;
    totalDistFromTip++;
    if (current != null) {
      current.size = totalDistFromTip;
    }
  }

  this.grow = function() {
    // go through all target points and find the closest branch for this target
    // -> if distance is inside the maxDist pull branch in the direction of the
    //    target by adding a normalized direction vector
    // -> mark targets which have been reached (distance < minDist)
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

    // remove targets which are reached from the list
    for (let i = this.targets.length - 1; i >= 0; i--) {
      if (this.targets[i].reached) {
        this.targets.splice(i, 1);
      }
    }

    // add a new branch to any existing branch which has an attraction target in
    // reach
    for (let i = this.branches.length - 1; i >= 0; i--) {
      let branch = this.branches[i];
      if (branch.count > 0) {
        // direction -> average of the normalized vectors toward all the sources
        branch.dir.div(branch.count + 1);
        // catch lockups if two targets pull with equal force
        if (branch.dir.mag() > 0.1) {
          let newBranch = branch.next();
          this.branches.push(newBranch);
          branch.reset();
          // update the distance of all parents from the new branch
          let totalDistFromTip = 0;
          while (newBranch.parent != null) {
            newBranch = newBranch.parent;
            totalDistFromTip++;
            if (newBranch != null) {
              newBranch.size = totalDistFromTip;
            }
          }
        }
      }
    }
  };
}