const utils = require("../../utils");
const FacingDirection = require("./FacingDirection");

const directions = [
  FacingDirection.North,
  FacingDirection.East,
  FacingDirection.South,
  FacingDirection.West
];

module.exports = class Position {

  static add(left, right) {
    return [left[0] + right[0], left[1] + right[1]];
  }

  static equals(left, right) {
    return left[0] === right[0] && left[1] === right[1];
  }

  static isAdjacent(left, right) {
    return directions
      .map(FacingDirection.directionToOffset)
      .some(offset => Position.equals(Position.add(left, offset), right));
  }

  static forward(position, direction) {
    return Position.add(position, FacingDirection.directionToOffset(direction));
  }

  static north(position) {
    return Position.forward(position, FacingDirection.North);
  }

  static east(position) {
    return Position.forward(position, FacingDirection.East);
  }

  static south(position) {
    return Position.forward(position, FacingDirection.South);
  }

  static west(position) {
    return Position.forward(position, FacingDirection.West);
  }

  static getOrthogonalPositions(position) {
    return directions.map(direction => Position.forward(position, direction));
  }

  /**
   * Group an array of positions into sets of connected positions. Default
   * definition of "connected" is "orthogonally adjacent", but that can be
   * overridden.
   *
   * NOTE that this operation is O(N^2), not the O(N) that you would expect from a
   * full disjoint-set implementation.
   *
   * @param {Position[]} positions
   * @param {Function} [comparisonFunction = Position.isAdjacent]
   *
   * @return {Position[][]} set of sets of connected positions
   */
  static adjacencySets(positions, comparisonFunction) {
    if (comparisonFunction === undefined) {
      comparisonFunction = Position.isAdjacent;
    }

    let sets = [];
    positions.forEach((position) => {
      const [adjacent, nonadjacent] = utils.bisect(sets, (set) => set.some((other) => comparisonFunction(position, other)));
      if (adjacent.length === 1) {
        // if this position is adjacent to exactly one set, simply add it to the
        // set
        adjacent[0].push(position);
      } else if (adjacent.length > 1) {
        // if this position unites several new sets into one mutual adjacency,
        // combine them all and add this position to the new set
        const newSet = [];
        adjacent.forEach((s) => newSet.push(...s));
        newSet.push(position);
        sets = nonadjacent;
        sets.push(newSet);
      } else {
        // if this position is all by itself, let it be the initial entry in a new
        // set
        sets.push([position]);
      }
    });

    return sets;
  }
};
