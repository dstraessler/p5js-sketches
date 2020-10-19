/* Space colonization algorithm to draw roots
 * http://algorithmicbotany.org/papers/colonization.egwnp2007.html
 *
 * Target point which shall atract branches.
 */

function TargetPoint(pos) {
  this.pos = pos;
  this.reached = false;

  this.show = function() {
    stroke(160);
    point(this.pos.x, this.pos.y);
  };
}