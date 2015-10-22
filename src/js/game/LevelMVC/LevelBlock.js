export default class LevelBlock {
  constructor(blockType, isWalkable, isDeadly, isPlacable, isUsable) {
    this.blockType = blockType;

    this.isEntity = false;
    this.isWalkable = isWalkable || true;
    this.isDeadly = isDeadly || false;
    this.isPlacable = isPlacable || true;
    this.isDestroyable = blockType !== "";
    this.isUsable = isUsable || false;
    this.isEmpty = blockType === "";
    this.isEmissive = false;

    if(blockType.substring(0, 5) == "rails")
    {
      this.isEntity = true;
      this.isWalkable = true;
      this.isUsable = true;
      this.isDestroyable = false;
    }

    if (blockType == "sheep") {
      this.isEntity = true;
      this.isDestroyable = false;
      this.isUsable = true;
    }

    if (blockType == "creeper"){
      this.isEntity = true;
    }

    if (blockType == "lava") {
      this.isEmissive = true;
      this.isWalkable = true;
      this.isDeadly = true;
    }

    if (blockType == "torch") {
      this.isEmissive = true;
      this.isEntity = true;
      this.isWalkable = true;
      this.isUsable = true;
      this.isDestroyable = false;
    }

    if (blockType == "cropWheat") {
      this.isEmissive = false;
      this.isEntity = true;
      this.isWalkable = true;
      this.isUsable = true;
      this.isDestroyable = false;
    }

    if (blockType == "tnt") {
      this.isUsable = true;
      this.isDestroyable = true;
    }
  }

  getIsTree() {
    return !!this.blockType.match(/^tree/);
  }

  getIsEmptyOrEntity() {
    return this.isEmpty || this.isEntity;
  }
}
