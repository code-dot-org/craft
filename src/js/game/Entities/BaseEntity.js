import CommandQueue from "../CommandQueue/CommandQueue.js";
import LevelView from "../LevelMVC/LevelView.js"
import LevelModel from "../LevelMVC/LevelModel.js";
import FacingDirection from "../LevelMVC/FacingDirection.js";
import EventType from "../Event/EventType.js";

export default class BaseEntity {
    constructor(controller, type, identifier, x, y, direction) {
        this.queue = new CommandQueue(controller);
        this.controller = controller;
        this.position = [x, y];
        this.type = type;
        // temp
        this.facing = direction;
        // offset for sprite position in grid
        this.offset = [-22, -12];
        this.identifier = identifier;
    }

    tick() {
        this.queue.tick();
    }

    addCommand(commandQueueItem) {
        this.queue.addCommand(commandQueueItem);
        // execute the command
        this.queue.begin();
    }

    playMoveForwardAnimation(position, facing, commandQueueItem) {
        var tween;
        var zOrderYIndex = position[1] + (facing === FacingDirection.Up ? 1 : 0);
        this.sprite.sortOrder = this.controller.levelView.yToIndex(zOrderYIndex) + 5;
        tween = this.controller.levelView.addResettableTween(this.sprite).to({
            x: (this.offset[0] + 40 * position[0]), y: (this.offset[1] + 40 * position[1])
        }, 200, Phaser.Easing.Linear.None);
        tween.onComplete.add(() => {
            commandQueueItem.succeeded();
        });

        tween.start();
    }

    doMoveForward(commandQueueItem, forwardPosition) {
        this.position = forwardPosition;
        // set selection indicator 
        this.controller.levelView.setSelectionIndicatorPosition(this.position[0], this.position[1]);
        this.playMoveForwardAnimation(forwardPosition, this.facing, commandQueueItem);
    }

    bump(commandQueueItem) {
        // TODO: bump animation
        this.controller.delayPlayerMoveBy(400, 800, () => {
            commandQueueItem.succeeded();
        });
    }

    callBumpEvents(forwardPositionInformation) {
        for (var i = 1; i < forwardPositionInformation.length; i++) {
            // no events for block this time
            /*if (forwardPositionInformation[i] === 'notEmpty')
                this.controller.events.forEach(e => e({ eventType: 'blockTouched', blockReference: this.controller.levelModel.getForwardBlock(), blockType: this.controller.levelModel.getForwardBlockType() }));
            else*/
            if (forwardPositionInformation[i] === 'frontEntity') {
                this.controller.events.forEach(e => e({ eventType: EventType.WhenTouched, targetType: forwardPositionInformation[i + 1].type, eventSenderIdentifier: this.identifier, targetIdentifier: forwardPositionInformation[i + 1].identifier }));
                i++;
            }
        }
    }

    moveDirection(commandQueueItem, direction) {
        // update entity's direction
        this.controller.levelModel.turnToDirection(this, direction);
        this.moveForward(commandQueueItem);
    }

    moveForward(commandQueueItem) {
        let forwardPosition = this.controller.levelModel.getMoveForwardPosition(this);
        var forwardPositionInformation = this.controller.levelModel.canMoveForward(this);
        if (forwardPositionInformation[0]) {
            this.doMoveForward(commandQueueItem, forwardPosition);
            // not entity moved event
            //this.controller.events.forEach(e => e({ eventType: 'entityMoved', entityIdentifier: this.identifier }));
        } else {
            this.bump(commandQueueItem);
            this.callBumpEvents(forwardPositionInformation);
        }
    }

    /**
     * check all the movable points and choose the farthest one
     * 
     * @param {any} commandQueueItem
     * @param {any} moveAwayFrom (entity)
     * 
     * @memberOf BaseEntity
     */
    moveAway(commandQueueItem, moveAwayFrom) {
        var moveAwayPosition = moveAwayFrom.position;
        var bestPosition = [];
        let absoluteDistanceSquare = function (position1, position2) {
            return Math.pow(position1[0] - position2[0], 2) + Math.pow(position1[1] - position2[1], 2);
        }
        let comparePositions = function (moveAwayPosition, position1, position2) {
            return absoluteDistanceSquare(position1[1], moveAwayPosition) < absoluteDistanceSquare(position2[1], moveAwayPosition) ? position2 : position1;
        }
        // this entity is on the right side and can move to right
        if (moveAwayPosition[0] <= this.position[0] && this.controller.levelModel.canMoveDirection(this, FacingDirection.Right)[0]) {
            bestPosition = [FacingDirection.Right, [this.position[0] + 1, this.position[1]]];
        }
        // this entity is on the left side and can move to left
        if (moveAwayPosition[0] >= this.position[0] && this.controller.levelModel.canMoveDirection(this, FacingDirection.Left)[0]) {
            if (bestPosition.length > 0)
                bestPosition = comparePositions(moveAwayPosition, bestPosition, [FacingDirection.Left, [this.position[0] - 1, this.position[1]]]);
            else
                bestPosition = [FacingDirection.Left, [this.position[0] - 1, this.position[1]]];
        }
        // this entity is on the up side and can move to up
        if (moveAwayPosition[1] >= this.position[1] && this.controller.levelModel.canMoveDirection(this, FacingDirection.Up)[0]) {
            if (bestPosition.length > 0)
                bestPosition = comparePositions(moveAwayPosition, bestPosition, [FacingDirection.Up, [this.position[0], this.position[1] - 1]]);
            else
                bestPosition = [FacingDirection.Up, [this.position[0], this.position[1] - 1]];
        }
        // this entity is on the down side and can move to down
        if (moveAwayPosition[1] <= this.position[1] && this.controller.levelModel.canMoveDirection(this, FacingDirection.Down)[0]) {
            if (bestPosition.length > 0)
                bestPosition = comparePositions(moveAwayPosition, bestPosition, [FacingDirection.Down, [this.position[0], this.position[1] + 1]]);
            else
                bestPosition = [FacingDirection.Down, [this.position[0], this.position[1] + 1]];
        }
        // terminate the action since it's impossible to move
        if (bestPosition.length === 0)
            commandQueueItem.succeeded();
        // execute the best result
        else
            this.moveDirection(commandQueueItem, bestPosition[0]);
    }

    /**
     * check all the movable points and choose the farthest one
     * 
     * @param {any} commandQueueItem
     * @param {any} moveTowardFrom (entity)
     * 
     * @memberOf BaseEntity
     */
    moveToward(commandQueueItem, moveTowardFrom) {
        var moveTowardPosition = moveTowardFrom.position;
        var bestPosition = [];
        let absoluteDistanceSquare = function (position1, position2) {
            return Math.pow(position1[0] - position2[0], 2) + Math.pow(position1[1] - position2[1], 2);
        }
        let comparePositions = function (moveTowardPosition, position1, position2) {
            return absoluteDistanceSquare(position1[1], moveTowardPosition) > absoluteDistanceSquare(position2[1], moveTowardPosition) ? position2 : position1;
        }
        // this entity is on the right side and can move to right
        if (moveTowardPosition[0] >= this.position[0] && this.controller.levelModel.canMoveDirection(this, FacingDirection.Right)[0]) {
            bestPosition = [FacingDirection.Right, [this.position[0] + 1, this.position[1]]];
        }
        // this entity is on the left side and can move to left
        if (moveTowardPosition[0] <= this.position[0] && this.controller.levelModel.canMoveDirection(this, FacingDirection.Left)[0]) {
            if (bestPosition.length > 0)
                bestPosition = comparePositions(moveTowardPosition, bestPosition, [FacingDirection.Left, [this.position[0] - 1, this.position[1]]]);
            else
                bestPosition = [FacingDirection.Left, [this.position[0] - 1, this.position[1]]];
        }
        // this entity is on the up side and can move to up
        if (moveTowardPosition[1] <= this.position[1] && this.controller.levelModel.canMoveDirection(this, FacingDirection.Up)[0]) {
            if (bestPosition.length > 0)
                bestPosition = comparePositions(moveTowardPosition, bestPosition, [FacingDirection.Up, [this.position[0], this.position[1] - 1]]);
            else
                bestPosition = [FacingDirection.Up, [this.position[0], this.position[1] - 1]];
        }
        // this entity is on the down side and can move to down
        if (moveTowardPosition[1] >= this.position[1] && this.controller.levelModel.canMoveDirection(this, FacingDirection.Down)[0]) {
            if (bestPosition.length > 0)
                bestPosition = comparePositions(moveTowardPosition, bestPosition, [FacingDirection.Down, [this.position[0], this.position[1] + 1]]);
            else
                bestPosition = [FacingDirection.Down, [this.position[0], this.position[1] + 1]];
        }
        // terminate the action since it's impossible to move
        if (bestPosition.length === 0)
            commandQueueItem.succeeded();
        // execute the best result
        else
            this.moveDirection(commandQueueItem, bestPosition[0]);
    }

    turn(commandQueueItem, direction) {
        if (direction === -1) {
            this.controller.levelModel.turnLeft(this);
        }

        if (direction === 1) {
            this.controller.levelModel.turnRight(this);
        }
        this.updateDirection(direction);
        this.controller.delayPlayerMoveBy(200, 800, () => {
            commandQueueItem.succeeded();
        });
    }

    use(commandQueueItem, userEntity) {
        // default behavior for use ?
        commandQueueItem.succeeded();
    }

    updateDirection(direction) {

    }
}

/*


        switch(frontEntity.type)
        {
          case "sheep":
            this.levelView.playShearSheepAnimationWithEntity(player.position, player.facing, frontEntity, () => {
                commandQueueItem.succeeded();
              });
              break;
            default:
              commandQueueItem.succeeded();
        }

*/