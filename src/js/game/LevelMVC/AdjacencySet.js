const Position = require("./Position");

/**
 * Group an array of positions into sets of connected positions. Default
 * definition of "connected" is "orthogonally adjacent", but that can be
 * overridden.
 */
module.exports = class AdjacencySet {
  /**
   * @param {Position[]} positions
   * @param {Function} [comparisonFunction = Position.isAdjacent]
   */
  constructor(positions, comparisonFunction) {
    this.comparisonFunction = comparisonFunction || Position.isAdjacent;
    this.sets = [];
    if (positions) {
      positions.forEach((position) => {
        this.add(position);
      });
    }
  }

  /**
   * Add a position to our adjacency sets, updating existing sets as necessary
   *
   * NOTE that this operation is O(N), not the O(1) that you would expect from
   * a full disjoint-set implementation.
   *
   * @param {Position} position
   */
  add(position) {
    const adjacent = this.sets.filter(set =>
      set.some(other => this.comparisonFunction(position, other))
    );
    if (adjacent.length === 1) {
      // if this position is adjacent to exactly one set, simply add it to the
      // set
      adjacent[0].push(position);
    } else if (adjacent.length > 1) {
      // if this position unites several new sets into one mutual adjacency,
      // combine them all and add this position to the new set
      const newSet = [];
      adjacent.forEach((s) => {
        this.sets.splice(this.sets.indexOf(s), 1);
        newSet.push(...s);
      });
      newSet.push(position);
      this.sets.push(newSet);
    } else {
      // if this position is all by itself, let it be the initial entry in a new
      // set
      this.sets.push([position]);
    }
  }
};

