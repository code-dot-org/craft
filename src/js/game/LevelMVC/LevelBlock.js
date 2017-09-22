module.exports = class LevelBlock {
  constructor(blockType) {
    this.blockType = blockType;

    // Default values apply to simple, action-plane destroyable blocks
    this.isEntity = false;
    this.isWalkable = false;
    this.isPlacable = false; // whether another block can be placed in this block's spot
    this.isDestroyable = true;
    this.isUsable = true;
    this.isEmpty = false;
    this.isEmissive = false;
    this.isTransparent = false;
    this.isRedstone = false;
    this.isPowered = false;
    this.isConnectedToRedstone = false; // can this block connect to nearby redstone wire
    this.isRedstoneBattery = false;
    this.isOpen = false;

    if (blockType === "") {
      this.isWalkable = true;
      this.isDestroyable = false;
      this.isEmpty = true;
      this.isPlacable = true;
      this.isUsable = false;
    }

    if (this.getIsMiniblock()) {
      this.isEntity = true;
      this.isWalkable = true;
      this.isDestroyable = false;
      this.isPlacable = true;
      this.isUsable = false;
      this.isTransparent = true;
    }

    if (blockType.match('torch')) {
      this.isWalkable = true;
      this.isPlacable = true;
    }

    if (blockType.substring(0, 5) === "rails") {
      this.isEntity = true;
      this.isWalkable = true;
      this.isUsable = true;
      this.isDestroyable = true;
      this.isTransparent = true;
      this.isRail = blockType !== "railsRedstoneTorch";
      this.isConnectedToRedstone = /^rails(RedstoneTorch|Unpowered|Powered)/.test(blockType);
      this.isRedstoneBattery = blockType === "railsRedstoneTorch";
      this.connectionA = undefined;
      this.connectionB = undefined;
    }

    if (blockType === "sheep") {
      this.isEntity = true;
      this.isDestroyable = false;
      this.isUsable = true;
    }

    if (blockType === "creeper") {
      this.isEntity = true;
    }

    if (blockType === "glass") {
      this.isDestroyable = false;
    }

    if (blockType === "bedrock") {
      this.isDestroyable = false;
    }

    if (blockType === "lava") {
      this.isEmissive = true;
      this.isWalkable = true;
      this.isPlacable = true;
    }

    if (blockType === "water") {
      this.isPlacable = true;
    }

    if (blockType === "torch") {
      this.isEmissive = true;
      this.isEntity = true;
      this.isWalkable = true;
      this.isUsable = true;
      this.isDestroyable = false;
      this.isTransparent = true;
    }

    if (blockType === "cropWheat") {
      this.isEmissive = false;
      this.isEntity = true;
      this.isWalkable = true;
      this.isUsable = true;
      this.isDestroyable = false;
      this.isTransparent = true;
    }

    if (blockType === "tnt") {
      this.isUsable = true;
      this.isDestroyable = true;
    }

    if (blockType === "door") {
      this.isEntity = true;
      this.isWalkable = false;
      this.isUsable = true;
      this.isDestroyable = false;
      this.isTransparent = true;
    }

    if (blockType === "doorIron") {
      this.isEntity = true;
      this.isWalkable = false;
      this.isDestroyable = false;
      this.isTransparent = true;
      this.isConnectedToRedstone = true;
    }

    if (blockType.startsWith("redstoneWire")) {
      this.isEntity = true;
      this.isWalkable = true;
      this.isUsable = true;
      this.isDestroyable = true;
      this.isTransparent = true;
      this.isRedstone = true;
    }

    if (blockType.startsWith("pressurePlate")) {
      this.isEntity = true;
      this.isWalkable = true;
      this.isDestroyable = false;
      this.isTransparent = true;
      this.isConnectedToRedstone = true;
      this.isRedstoneBattery = blockType === 'pressurePlateUp' ? false : true;
    }

    if (blockType === "glowstone") {
      this.isEntity = true;
    }

    if (blockType.startsWith("piston")) {
      this.isDestroyable = false;
      this.isConnectedToRedstone = !blockType.startsWith("pistonArm");
      if (blockType.substring(blockType.length - 2, blockType.length) === "On" ||
      blockType.startsWith("pistonArm") ||
      blockType.substring(blockType.length - 8, blockType.length) === "OnSticky") {
        this.isEntity = true;
      }
    }
  }

  /**
   * @return {boolean}
   */
  getIsMiniblock() {
    return LevelBlock.isMiniblock(this.blockType);
  }

  getIsTree() {
    return !!this.blockType.match(/^tree/);
  }

  needToRefreshRedstone(){
    if (this.isRedstone || this.blockType === '' || (this.isConnectedToRedstone && !this.blockType.startsWith("piston"))) {
      return true;
    } else {
      return false;
    }
  }

  getIsEmptyOrEntity() {
    return this.isEmpty || this.isEntity;
  }

  /**
   * Does the given block type represent a miniblock?
   *
   * @param {String} blockType
   * @return {boolean}
   */
  static isMiniblock(blockType) {
    return blockType.endsWith("Miniblock");
  }

  /**
   * For any given block type, get the appropriate mini block frame (as defined
   * in LevelView.miniblocks) if it exists.
   *
   * For miniblock block types, this should be the miniblock itself, so this
   * means simply removing the "Miniblock" identifier, so a "diamondMiniblock"
   * block will produce a "diamond" frame.
   *
   * For regular block types, this should be the miniblock produced when
   * destroying the block type, so a "oreDiamond" block will produce a "diamond"
   * frame
   *
   * @param {String} blockType
   * @return {String} frame identifier
   */
  static getMiniblockFrame(blockType) {
    // We don't have rails miniblock assets yet.
    if (blockType.startsWith("rails")) {
      return;
    }

    // We use the same miniblock for -all- restoneWire
    if (blockType.substring(0,12) === "redstoneWire") {
      return "redstoneDust";
    }

    // Miniblock block types are suffixed with the string "Miniblock"
    if (LevelBlock.isMiniblock(blockType)) {
      return blockType.replace("Miniblock", "");
    }

    // For everything else, simply map the block type to the desired miniblock
    let frame = blockType;

    switch (frame) {
      case "treeAcacia":
      case "treeBirch":
      case "treeJungle":
      case "treeOak":
      case "treeSpruce":
      case "treeSpruceSnowy":
        frame = "log" + frame.substring(4);
        break;
      case "stone":
        frame = "cobblestone";
        break;
      case "oreCoal":
        frame = "coal";
        break;
      case "oreDiamond":
        frame = "diamond";
        break;
      case "oreIron":
        frame = "ingotIron";
        break;
      case "oreLapis":
        frame = "lapisLazuli";
        break;
      case "oreGold":
        frame = "ingotGold";
        break;
      case "oreEmerald":
        frame = "emerald";
        break;
      case "oreRedstone":
        frame = "redstoneDust";
        break;
      case "grass":
        frame = "dirt";
        break;
      case "wool_orange":
        frame = "wool";
        break;
      case "tnt":
        frame = "gunPowder";
        break;
    }

    return frame;
  }
};
