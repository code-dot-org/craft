export default class LevelBlock {
  constructor(blockType, isWalkable, isDeadly, isPlacable, isUsable) {
    this.blockType = blockType;

    this.isEntity = blockType === "sheep";
    this.isWalkable = isWalkable || true;
    this.isDeadly = isDeadly || false;
    this.isPlacable = isPlacable || true;
    this.isDestroyable = blockType !== "";
    this.isUsable = isUsable || false;
    this.isEmpty = blockType === "";
  }

  getIsEmptyOrEntity() {
    return this.isEmpty || this.isEntity;
  }
}