/* Space colonization algorithm to draw roots
 * http://algorithmicbotany.org/papers/colonization.egwnp2007.html
 *
 * Target point which shall atract branches.
 */

function TargetPoint(pos) {
  this.pos = pos;
  this.reached = false;

  this.show = function() {
    stroke(100);
    fill(100);
    let size = max(1, width / 250);
    ellipse(this.pos.x, this.pos.y, size, size);
  };
}