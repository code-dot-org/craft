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
   * Gets all eight surrounding positions - orthogonal and diagonal
   */
  static getSurroundingPositions(position) {
    return Position.getOrthogonalPositions(position).concat([
      Position.north(Position.east(position)),
      Position.north(Position.west(position)),
      Position.south(Position.east(position)),
      Position.south(Position.west(position)),
    ]);
  }
};
