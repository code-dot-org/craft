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
        .any(offset => Position.equals(Position.add(left, offset), right));
  }

  static forward(position, direction) {
    return Position.add(position, FacingDirection.directionToOffset(direction));
  }
};
