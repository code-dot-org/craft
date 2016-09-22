import BaseEntity from "./BaseEntity.js"
import AssetLoader from "../LevelMVC/AssetLoader.js";
import LevelView from "../LevelMVC/LevelView.js"
import FacingDirection from "../LevelMVC/FacingDirection.js";
export default class Sheep extends BaseEntity {
    constructor(controller, type, identifier, x, y, facing) {
        super(controller, type, identifier, x, y, facing);
        this.sprite = this.controller.levelView.createBlock(controller.levelView.actionPlane, x, y, type);
        var zOrderYIndex = this.position[1] - 5;
        this.sprite.sortOrder = this.controller.levelView.yToIndex(zOrderYIndex);
        this.Offset = [-22, -12];
    }
}