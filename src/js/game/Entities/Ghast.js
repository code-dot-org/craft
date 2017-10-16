const BaseEntity = require("./BaseEntity.js");
module.exports = class Ghast extends BaseEntity {
    constructor(controller, type, identifier, x, y, facing) {
        super(controller, type, identifier, x, y, facing);
        var zOrderYIndex = this.position[1];
        this.offset = [-50, -84];
        this.prepareSprite();
        this.sprite.sortOrder = this.controller.levelView.yToIndex(zOrderYIndex);
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
        let stillFrameName = ['Ghast0072.png', 'Ghast0048.png', 'Ghast0024.png', 'Ghast0000.png'];
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
            for (var j = 0; j < idleDelayFrame; j++) {
                frameList.push(stillFrameName[i]);
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

    playRandomIdle(facing) {
        var facingName,
            animationName = "";
        facingName = this.controller.levelView.getDirectionName(facing);

        animationName += "idle";

        animationName += facingName;
        this.controller.levelView.playScaledSpeed(this.sprite.animations, animationName);
    }

};
