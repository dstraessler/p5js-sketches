/* Space colonization algorithm to draw roots
 * http://algorithmicbotany.org/papers/colonization.egwnp2007.html
 *
 * Branch object.
 */

function Branch(parent, pos, dir) {
  this.pos = pos;
  this.parent = parent;
  this.dir = dir;
  this.origDir = this.dir.copy();
  this.count = 0;
  this.size = 0;

  /* Reset the branch after tinkering with its direction for the space
   * colonization algorithm.
   */
  this.reset = function() {
    this.dir = this.origDir.copy();
    this.count = 0;
  };

  /* Return a new branch with the same direction (scaled with the grow speed)
   * attached to the position of the current branch (parent)
   */
  this.next = function() {
    let growSpeed = min(1, width / 500);
    let vectorToNextPos = p5.Vector.mult(this.dir, growSpeed);
    let nextPos = p5.Vector.add(this.pos, vectorToNextPos);
    let nextBranch = new Branch(this, nextPos, this.dir.copy());
    return nextBranch;
  };
}