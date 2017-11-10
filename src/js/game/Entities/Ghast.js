const BaseEntity = require("./BaseEntity.js");
const randomInt = require("./../LevelMVC/Utils.js").randomInt;
module.exports = class Ghast extends BaseEntity {
    constructor(controller, type, identifier, x, y, facing, pattern = null, variant = null, primaryScalar = null, secondaryScalar = null, speed = null) {
        super(controller, type, identifier, x, y, facing);
        this.offset = [-50, -84];
        this.prepareSprite();
        this.sprite.sortOrder = this.controller.levelView.yToIndex(Number.MAX_SAFE_INTEGER);
        this.audioDelay = 15;
        if (pattern !== null) {
          this.movingUp = false;
          if (this.sprite.position.x > 60) {
            this.movingUp = true;
          }
          this.pauseTime = 0;
          this.scaleMod = 1;

          // init format: entities: [['ghast', x, y, facing, pattern, variant, primary scalar, secondary scalar]],
          this.flightAnchor = {x: this.sprite.position.x, y: this.sprite.position.y};
          this.details = {pattern: pattern, variant: variant};
          this.primaryScalar = primaryScalar;
          this.secondaryScalar = secondaryScalar;
          this.speed = speed;
          this.trigCounter = 0;
          this.t = 0;
          this.boxVertTracker = 0;

          // I just want these to be enums...
          this.boxVariants = {
            topLeft: 0,
            topRight: 1,
            bottomRight: 2,
            bottomLeft: 3
          };

          this.sinusoidalVariants = {
            horizontal: 0,
            vertical: 1
          };
        }
    }

    prepareSprite() {
        let getRandomSecondBetween = function (min, max) {
            return (Math.random() * (max - min) + min) * 1000;
        };
        let frameRate = 12, randomPauseMin = 0.2, randomPauseMax = 1;
        let actionGroup = this.controller.levelView.actionGroup;
        var frameList = [];
        var frameName = "Ghast";
        this.sprite = actionGroup.create(0, 0, 'ghast', 'Ghast0000.png');
        this.sprite.scale.setTo(1,1);
        let idleDelayFrame = 0;
        // [direction][[idle],[shoot]]
        var frameListPerDirection = [[[72, 83], [84, 95]], // down
        [[48, 59], [60, 71]], // right
        [[24, 35], [36, 47]], // up
        [[0, 11], [12, 23]]]; // left
        for (var i = 0; i < 4; i++) {
            var facingName = this.controller.levelView.getDirectionName(i);

            // idle sequence
            frameList = Phaser.Animation.generateFrameNames(frameName, frameListPerDirection[i][0][0], frameListPerDirection[i][0][1], ".png", 4);

            let randomOffset = randomInt(2, frameList.length);
            let framesToOffset = [];
            for (let k = 0; k < randomOffset; ++k) {
              framesToOffset.push(frameList[0]);
              frameList.splice(0, 1);
            }
            for (let k = 0; k < framesToOffset.length; ++k) {
              frameList.push(framesToOffset[k]);
            }

            for (var j = 0; j < idleDelayFrame; j++) {
                frameList.push(frameList[0]);
            }
            this.sprite.animations.add("idle" + facingName, frameList, frameRate, false).onComplete.add(() => {
                this.playRandomIdle(this.facing);
            });
            // shoot
            frameList = Phaser.Animation.generateFrameNames(frameName, frameListPerDirection[i][1][0], frameListPerDirection[i][1][1], ".png", 4);
            this.sprite.animations.add("shoot" + facingName, frameList, frameRate, false).onComplete.add(() => {
                this.sprite.animations.stop();
                setTimeout(() => {
                    this.controller.levelView.playScaledSpeed(this.sprite.animations, "shoot" + this.controller.levelView.getDirectionName(this.facing) + "_2");
                }, getRandomSecondBetween(randomPauseMin, randomPauseMax));

            });
            frameList = Phaser.Animation.generateFrameNames(frameName, frameListPerDirection[i][1][1], frameListPerDirection[i][1][0], ".png", 4);
            this.sprite.animations.add("shoot" + facingName + "_2", frameList, frameRate, false).onComplete.add(() => {
                this.controller.levelView.playScaledSpeed(this.sprite.animations, "idle" + this.controller.levelView.getDirectionName(this.facing));
            });
        }
        // initialize
        this.controller.levelView.playScaledSpeed(this.sprite.animations, "idle" + this.controller.levelView.getDirectionName(this.facing));
        this.sprite.x = this.offset[0] + 40 * this.position[0];
        this.sprite.y = this.offset[1] + 40 * this.position[1];
    }

  /**
   * @override
   */
  canMoveThrough() {
    return true;
  }

  tick() {
    super.tick();
    this.fly();
  }

  playRandomIdle(facing) {
    var facingName,
        animationName = "";
    facingName = this.controller.levelView.getDirectionName(facing);

    animationName += "idle";

    animationName += facingName;
    this.controller.levelView.playScaledSpeed(this.sprite.animations, animationName);

    if (this.audioDelay > 0) {
      --this.audioDelay;
    } else {
      this.audioDelay = 5;
      let chance = Math.floor(Math.random() * 5);
      if (chance === 0) {
        let soundNum = Math.floor(Math.random() * 4);
        this.playMoan(soundNum);
      }
    }
  }

  playMoan(number) {
    switch (number) {
      case 0:
        this.controller.audioPlayer.play("moan2");
        break;
      case 1:
        this.controller.audioPlayer.play("moan3");
        break;
      case 2:
        this.controller.audioPlayer.play("moan6");
        break;
      default:
        this.controller.audioPlayer.play("moan7");
        break;
    }
  }

// this.pattern = {type: <type>, specifics: <orientation or starting justification>};
  fly() {
    switch (this.details.pattern) {
      case "box":
        this.box(this.details.variant);
        break;
      case "sinusoidal":
        this.sinusoidal(this.details.variant);
        break;
      default:
        //do nothing
    }
  }

  sinusoidal(variant) {
    let mainAxis = null;
    let offAxis = null;
    if (variant === this.sinusoidalVariants.vertical) {
      mainAxis = 'y';
      offAxis = 'x';
    } else if (variant === this.sinusoidalVariants.horizontal) {
      mainAxis = 'x';
      offAxis = 'y';
    } else {
      return;
    }

    if (!this.movingUp) { // flying along the main axis, positive direction
      if (this.sprite.position[mainAxis] < this.flightAnchor[mainAxis] + (40 * this.primaryScalar)) {
        this.sprite.position[mainAxis] += this.speed;
      } else {
        this.pauseTime += 1;
        if (this.pauseTime > 0) {
          this.pauseTime = 0;
          this.movingUp = true;
        }
      }
    } else { // Flying along the main axis, negative direction
      if (this.sprite.position[mainAxis] > this.flightAnchor[mainAxis] - (40 * this.primaryScalar)) {
        this.sprite.position[mainAxis] -= this.speed;
      } else {
        this.pauseTime += 1;
        if (this.pauseTime > 0) {
          this.pauseTime = 0;
          this.movingUp = false;
        }
      }
    }


    this.sprite.position[offAxis] = this.flightAnchor[offAxis] + (Math.cos(this.trigCounter) * this.secondaryScalar);
    this.trigCounter += this.speed/60;
  }

  box(corner) {
    const vertices = this.getBoxVerts(corner);
    let origin = this.boxVertTracker;
    let destination = 0;
    if (origin !== 3) {
      destination = this.boxVertTracker + 1;
    }

    this.t += (this.speed / 60);
    if (this.t > 1) {
      this.t = 1;
    }
    let pos = this.lerp(vertices[origin], vertices[destination], this.t);


    if (pos[0] === vertices[destination][0] && pos[1] === vertices[destination][1]) {
      this.t = 0;
      if (this.boxVertTracker < 3) {
        ++this.boxVertTracker;
      } else {
        this.boxVertTracker = 0;
      }
    }


    this.sprite.position.x = pos[0];
    this.sprite.position.y = pos[1];
  }

  getBoxVerts(startingCorner) {
    const x = this.flightAnchor.x;
    const y = this.flightAnchor.y;
    switch (startingCorner) {
      case this.boxVariants.topLeft:
        return [[x,y], [x + (40 * this.primaryScalar), y], [x + (40 * this.primaryScalar), y + (40 * this.secondaryScalar)], [x, y + (40 * this.secondaryScalar)]];
      case this.boxVariants.topRight:
        return [[x,y], [x, y + (40 * this.secondaryScalar)], [x - (40 * this.primaryScalar), y + (40 * this.secondaryScalar)], [x - (40 * this.primaryScalar), y]];
      case this.boxVariants.bottomRight:
        return [[x,y], [x - (40 * this.primaryScalar), y], [x - (40 * this.primaryScalar), y - (40 * this.secondaryScalar)], [x, y - (40 * this.secondaryScalar)]];
      case this.boxVariants.bottomLeft:
        return [[x,y], [x, y - (40 * this.secondaryScalar)], [x + (40 * this.primaryScalar), y - (40 * this.secondaryScalar)], [x + (40 * this.primaryScalar), y]];
    }
  }

  lerp(a, b, t) {
    //HOW does js standard Math class not have a lerp function...
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }

};
