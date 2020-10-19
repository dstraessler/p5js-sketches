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
  this.dist = 0;

  this.reset = function() {
    this.dir = this.origDir.copy();
    this.count = 0;
  };

  this.next = function() {
    let nextDir = p5.Vector.mult(this.dir, width / 500);
    let nextPos = p5.Vector.add(this.pos, nextDir);
    let nextBranch = new Branch(this, nextPos, this.dir.copy());
    this.dist++;
    return nextBranch;
  };
}