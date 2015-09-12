let FacingDirection = {
  Up: 0,
  Right: 1,
  Down: 2,
  Left: 3
};

let PlayerState = {
  Idle: 0,
  Walking: 1
}

export default class LevelModel {
  constructor(levelData) {
    this.player = {
      name: "steve",

      position: [2, 4],

      facing: FacingDirection.Right,

      state: PlayerState.Idle
    };

    this.initialPlayerState = Object.create(this.player);
    this.initialLevelData = Object.create(levelData);

    this.groundPlane = levelData[0];
    this.shadingPlane = [];
    this.actionPlane = levelData[1];
    this.fluffPlane = levelData[2];

    this.computeShadingPlane();
  }

  computeShadingPlane() {
    var x,
      y,
      index,
      hasLeft,
      hasRight;

    this.shadingPlane = [];

    for (index = 0; index < 100; ++index) {
      x = index % 10;
      y = Math.floor(index / 10);

      hasLeft = false;
      hasRight = false;

      if (this.actionPlane[index] === "") {
        if (x < 9 && this.actionPlane[(y * 10) + x + 1] !== "") {
          // needs a left side AO shadow
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Left' })
          hasLeft = true;
        }

        if (x > 0 && this.actionPlane[(y * 10) + x - 1] !== "") {
          // needs a right side AO shadow
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Right' })
          hasRight = true;
        }

        if (y > 0 && this.actionPlane[((y - 1) * 10) + x] !== "") {
          // needs a bottom side AO shadow
          this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_Bottom' })
        } else if (y > 0) {
          if (x < 9 && this.actionPlane[((y - 1) * 10) + x + 1] !== "") {
            // needs a bottom left side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_BottomLeft' })
          }

          if (!hasRight && x > 0 && this.actionPlane[((y - 1) * 10) + x - 1] !== "") {
            // needs a bottom right side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_BottomRight' })
          }
        }

        if (y < 9) {
          if (x < 9 && this.actionPlane[((y + 1) * 10) + x + 1] !== "") {
            // needs a bottom left side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_TopLeft' })
          }

          if (!hasRight && x > 0 && this.actionPlane[((y + 1) * 10) + x - 1] !== "") {
            // needs a bottom right side AO shadow
            this.shadingPlane.push({ x: x, y: y, type: 'AOeffect_TopRight' })
          }
        }
      }
    }
  }
}