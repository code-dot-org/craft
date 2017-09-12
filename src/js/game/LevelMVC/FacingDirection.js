const FacingDirection = Object.freeze({
  North: 1,
  South: 2,
  East: 4,
  West: 8,

  opposite: function (cardinal) {
    switch (cardinal) {
      case FacingDirection.North: return FacingDirection.South;
      case FacingDirection.South: return FacingDirection.North;
      case FacingDirection.East: return FacingDirection.West;
      case FacingDirection.West: return FacingDirection.East;
    }
  },

  turnDirection: function (from, to) {
    switch (from) {
      case FacingDirection.North: return to === FacingDirection.East ? 'right' : 'left';
      case FacingDirection.South: return to === FacingDirection.West ? 'right' : 'left';
      case FacingDirection.East: return to === FacingDirection.South ? 'right' : 'left';
      case FacingDirection.West: return to === FacingDirection.North ? 'right' : 'left';
    }
  },

  // TODO: unify with N/S/E/W above.
  Up: 0,
  Right: 1,
  Down: 2,
  Left: 3,

  /**
   * Convert a direction (Up/Down/Right/Left) to a cardinal (North/South/East/West).
   * @param facing
   * @return {number}
   */
  facingToCardinal: function (facing) {
    switch (facing) {
      case FacingDirection.Up: return FacingDirection.North;
      case FacingDirection.Down: return FacingDirection.South;
      case FacingDirection.Right: return FacingDirection.East;
      case FacingDirection.Left: return FacingDirection.West;
    }
  },

  turn: function (facing, rotation) {
    return (facing + 4 + (rotation === 'right' ? 1 : -1)) % 4;
  },
});

module.exports = FacingDirection;
