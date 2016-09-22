import BaseEntity from "../Entities/BaseEntity.js";
import Sheep from "../Entities/Sheep.js";

/**
 * Handling non-player entities inside of the level
 */
export default class LevelEntity {
    constructor(controller) {
        this.controller = controller;
        this.game = controller.game;
        this.entityMap = new Map();
        this.sprite = null;
        this.id = 0;
    }

    loadData(levelData) {
        if (levelData.entities !== undefined) {
            for (var i = 0; i < levelData.entities.length; i++) {
                let data = levelData.entities[i];
                this.createEntity(data[0], this.id++, data[1], data[2], data[3]);
            }
        }
    }

    tick() {
        let updateEntity = function (value, key, map) {
            value.tick();
        }
        this.entityMap.forEach(updateEntity);
    }

    pushEntity(entity) {
        if (!this.entityMap.has(entity.identifier)) {
            this.entityMap.set(entity.identifier, entity);
        }
        else if (this.controller.DEBUG) {
            this.game.debug.text("Duplicate entity name : " + entity.identifier + "\n");
        }
    }

    createEntity(type, identifier, x, y, facing) {
        var entity = null;
        if (!this.entityMap.has(identifier)) {
            switch (type) {
                case 'sheep':
                    entity = new Sheep(this.controller, type, identifier, x, y, facing);
                    break;
                default:
                    entity = new BaseEntity(this.controller, type, identifier, x, y, facing);

            }
            this.entityMap.set(identifier, entity);
        }
        else if (this.controller.DEBUG) {
            this.game.debug.text("Duplicate entity name : " + identifier + "\n");
        }
        return entity;
    }

    spawnEntity(eventSenderIdentifier, type,spawnDirection, facing) {
        var entity = this.entityMap.get(eventSenderIdentifier);
        if (entity === undefined) {
            if (this.controller.DEBUG)
                this.game.debug.text("Not able to spawn entity since sender is not specified\n");
        }
        // can spawn entity if it's possible to move
        else if (this.controller.levelModel.canMoveDirection(entity, spawnDirection)[0]) {

            let position = this.controller.levelModel.getMoveDirectionPosition(entity,spawnDirection);
            return this.createEntity(type, this.id++, position[0], position[1], facing);
        }
        return null;
    }

    destroyEntity(identifier) {
        if (this.entityMap.has(identifier)) {
            this.entityMap.get(identifier).sprite.destroy();
            this.entityMap.delete(identifier);
        } else if (this.controller.DEBUG) {
            this.game.debug.text("It's impossible to delete since entity name : " + identifier + " is not existing\n");
        }
    }

    getEntityAt(position) {
        for (var value of this.entityMap) {
            let entity = value[1];
            if (entity.position[0] === position[0] && entity.position[1] === position[1])
                return entity;
        }
        return null;
    }

    getEntitiesOfType(type) {
        var entities = [];
        for (var value of this.entityMap) {
            let entity = value[1];
            if (entity.type === type)
                entities.push(entity);
        }
        return entities;
    }

    reset() {
        this.entityMap.clear();
    }
}