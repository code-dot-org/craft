const LevelBlock = require("./LevelBlock.js");
const FacingDirection = require("./FacingDirection.js");
const Position = require("./Position.js");
const createEvent = require("../../utils").createEvent;
const randomInt = require("./Utils").randomInt;

// Hack: `PIXI.canUseNewCanvasBlendModes()` sometimes erroneously returns false.
// It's supported in all browsers we support.
if (window.PIXI) {
  PIXI.canUseNewCanvasBlendModes = () => true;
}

module.exports = class LevelView {
  constructor(controller) {
    this.controller = controller;
    this.audioPlayer = controller.audioPlayer;
    this.game = controller.game;

    this.baseShading = null;

    this.player = null;
    this.agent = null;
    this.selectionIndicator = null;

    this.groundGroup = null;
    this.shadingGroup = null;
    this.actionGroup = null;
    this.fluffGroup = null;
    this.fowGroup = null;
    this.collectibleItems = [];
    //{sprite : sprite, type : blockType, position : Position}
    this.trees = [];

    this.miniBlocks = {};
    [
      "dirt",
      "dirtCoarse",
      "sand",
      "gravel",
      "bricks",
      "logAcacia",
      "logBirch",
      "logJungle",
      "logOak",
      "logSpruce",
      "planksAcacia",
      "planksBirch",
      "planksJungle",
      "planksOak",
      "planksSpruce",
      "cobblestone",
      "sandstone",
      "wool",
      "redstoneDust",
      "lapisLazuli",
      "ingotIron",
      "ingotGold",
      "emerald",
      "diamond",
      "coal",
      "bucketWater",
      "bucketLava",
      "gunPowder",
      "wheat",
      "potato",
      "carrots",
      "milk",
      "egg",
      "poppy",
      "daisy",
      "dandelion",
      "bed",
      "cactus",
      "clay",
      "deadbush",
      "doorIron",
      "doorOak",
      "glowstoneDust",
      "hardenedClay",
      "hardenedClayBlack",
      "hardenedClayBlue",
      "hardenedClayBrown",
      "hardenedClayCyan",
      "hardenedClayGray",
      "hardenedClayGreen",
      "hardenedClayLightBlue",
      "hardenedClayLime",
      "hardenedClayMagenta",
      "hardenedClayOrange",
      "hardenedClayPink",
      "hardenedClayPurple",
      "hardenedClayRed",
      "hardenedClaySilver",
      "hardenedClayWhite",
      "hardenedClayYellow",
      "netherbrick",
      "netherrack",
      "obsidian",
      "piston",
      "pressurePlateOak",
      "netherQuartz",
      "railGolden",
      "railNormal",
      "redstoneTorch",
      "reeds",
      "seedsWheat",
      "snow",
      "snowBall",
      "woolBlack",
      "woolBlue",
      "woolBrown",
      "woolCyan",
      "woolGray",
      "woolGreen",
      "woolLightBlue",
      "woolLime",
      "woolMagenta",
      "woolOrange",
      "woolPink",
      "woolLPurple",
      "woolRed",
      "woolSilver",
      "woolYellow",
      "bookEnchanted",
      "bucketEmpty",
      "chest",
      "compass",
      "axeDiamond",
      "pickaxeDiamond",
      "shovelDiamond",
      "flintAndSteel",
      "flint",
      "mapEmpty",
      "minecart",
      "potionBottleDrinkable",
      "yellowCoral",
      "yellowCoralFan",
      "blackConcrete",
      "blueConcretePowder",
      "blueConcrete",
      "blueCoralFan",
      "blueCoral",
      "brownConcretePowder",
      "brownConcrete",
      "cyanConcretePowder",
      "cyanConcrete",
      "deadBlueCoralBlock",
      "deadBlueCoralFan",
      "deadMagentaCoralBlock",
      "deadMagentaCoralFan",
      "deadPinkCoralBlock",
      "deadPinkCoralFan",
      "deadRedCoralBlock",
      "deadRedCoralFan",
      "deadYellowCoralBlock",
      "deadYellowCoralFan",
      "granite",
      "grayConcretePowder",
      "grayConcrete",
      "greenConcretePowder",
      "greenConcrete",
      "lightBlueConcretePowder",
      "lightBlueConcrete",
      "lightGrayConcretePowder",
      "lightGrayConcrete",
      "limeConcretePowder",
      "limeConcrete",
      "magentaConcretePowder",
      "magentaConcrete",
      "magentaCoralBlock",
      "magentaCoralFan",
      "magentaCoral",
      "orangeConcretePowder",
      "orangeConcrete",
      "pinkConcretePowder",
      "pinkConcrete",
      "pinkCoralBlock",
      "pinkCoralFan",
      "pinkCoral",
      "polishedGranite",
      "purpleConcretePowder",
      "purpleConcrete",
      "redConcretePowder",
      "redConcrete",
      "redCoralBlock",
      "redCoralFan",
      "redCoral",
      "seaPickle",
      "strippedAcacia",
      "strippedBirch",
      "strippedDarkOak",
      "strippedJungle",
      "strippedOak",
      "strippedSpruce",
      "whiteConcretePowder",
      "whiteConcrete",
      "yellowConcretePowder",
      "yellowConcrete",
      "yellowCoralBlock",
      "blackConcretePowder",
      "nautilus",
      "heartOfTheSea",
      "stoneBricks",
      "mossyStoneBricks",
      "crackedStoneBricks",
      "chisledStoneBricks",
      "magmaBlock",
      "prismarine",
      "darkPrismarine",
      "seaLantern",
      "packedIce",
      "blueIce",
    ].forEach((miniBlock, n) => {
      this.miniBlocks[miniBlock] = ["Miniblocks", n * 6, n * 6 + 5];
    });

    this.blocks = {
      "bedrock": ["blocks", "Bedrock", -13, 0],
      "bricks": ["blocks", "Bricks", -13, 0],
      "oreCoal": ["blocks", "Coal_Ore", -13, 0],
      "dirtCoarse": ["blocks", "Coarse_Dirt", -13, 0],
      "cobblestone": ["blocks", "Cobblestone", -13, 0],
      "oreDiamond": ["blocks", "Diamond_Ore", -13, 0],
      "dirt": ["blocks", "Dirt", -13, 0],
      "oreEmerald": ["blocks", "Emerald_Ore", -13, 0],
      "farmlandWet": ["blocks", "Farmland_Wet", -13, 0],
      "flowerDandelion": ["blocks", "Flower_Dandelion", -13, 0],
      "flowerOxeeye": ["blocks", "Flower_Oxeeye", -13, 0],
      "flowerRose": ["blocks", "Flower_Rose", -13, 0],
      "glass": ["blocks", "Glass", -13, 0],
      "oreGold": ["blocks", "Gold_Ore", -13, 0],
      "grass": ["blocks", "Grass", -13, 0],
      "gravel": ["blocks", "Gravel", -13, 0],
      "oreIron": ["blocks", "Iron_Ore", -13, 0],
      "oreLapis": ["blocks", "Lapis_Ore", -13, 0],
      "lava": ["blocks", "Lava_0", -13, 0],
      "logAcacia": ["blocks", "Log_Acacia", -13, 0],
      "logBirch": ["blocks", "Log_Birch", -13, 0],
      "logJungle": ["blocks", "Log_Jungle", -13, 0],
      "logOak": ["blocks", "Log_Oak", -13, 0],
      "logSpruce": ["blocks", "Log_Spruce", -13, 0],
      "logSpruceSnowy": ["blocks", "Log_Spruce", -13, 0],
      "obsidian": ["blocks", "Obsidian", -13, 0],
      "planksAcacia": ["blocks", "Planks_Acacia", -13, 0],
      "planksBirch": ["blocks", "Planks_Birch", -13, 0],
      "planksJungle": ["blocks", "Planks_Jungle", -13, 0],
      "planksOak": ["blocks", "Planks_Oak", -13, 0],
      "planksSpruce": ["blocks", "Planks_Spruce", -13, 0],
      "oreRedstone": ["blocks", "Redstone_Ore", -13, 0],
      "sand": ["blocks", "Sand", -13, 0],
      "sandstone": ["blocks", "Sandstone", -13, 0],
      "stone": ["blocks", "Stone", -13, 0],
      "tnt": ["tnt", "TNTexplosion0", -80, -58],
      "water": ["blocks", "Water_0", -13, 0],
      "wool": ["blocks", "Wool_White", -13, 0],
      "wool_orange": ["blocks", "Wool_Orange", -13, 0],
      "wool_black": ["blocks", "Wool_Black", -13, 0],
      "wool_blue": ["blocks", "Wool_Blue", -13, 0],
      "wool_brown": ["blocks", "Wool_Brown", -13, 0],
      "wool_cyan": ["blocks", "Wool_Cyan", -13, 0],
      "wool_gray": ["blocks", "Wool_Gray", -13, 0],
      "wool_green": ["blocks", "Wool_Green", -13, 0],
      "wool_light_blue": ["blocks", "Wool_LightBlue", -13, 0],
      "wool_lime": ["blocks", "Wool_Lime", -13, 0],
      "wool_magenta": ["blocks", "Wool_Magenta", -13, 0],
      "wool_pink": ["blocks", "Wool_Pink", -13, 0],
      "wool_purple": ["blocks", "Wool_Purple", -13, 0],
      "wool_red": ["blocks", "Wool_Red", -13, 0],
      "wool_silver": ["blocks", "Wool_Silver", -13, 0],
      "wool_yellow": ["blocks", "Wool_Yellow", -13, 0],

      "leavesAcacia": ["leavesAcacia", "Leaves_Acacia0.png", -100, 0],
      "leavesBirch": ["leavesBirch", "Leaves_Birch0.png", -100, 0],
      "leavesJungle": ["leavesJungle", "Leaves_Jungle0.png", -100, 0],
      "leavesOak": ["leavesOak", "Leaves_Oak0.png", -100, 0],
      "leavesSpruce": ["leavesSpruce", "Leaves_Spruce0.png", -100, 0],
      "leavesSpruceSnowy": ["leavesSpruceSnowy", "Leaves_SpruceSnowy0.png", -100, 36],

      "watering": ["blocks", "Water_0", -13, 0],
      "cropWheat": ["blocks", "Wheat0", -13, 0],
      "torch": ["torch", "Torch0", -13, 0],

      "tallGrass": ["tallGrass", "", -13, 0],

      "lavaPop": ["lavaPop", "LavaPop01", -13, 0],
      "redstoneSparkle": ["redstoneSparkle", "redstone_sparkle1.png", 7, 23],
      "fire": ["fire", "", -11, 135],
      "bubbles": ["bubbles", "", -11, 135],
      "explosion": ["explosion", "", -70, 60],

      "door": ["door", "", -12, -15],
      "doorIron": ["doorIron", "", -12, -15],

      "rails": ["blocks", "Rails_Vertical", -13, -0],
      "railsNorthEast": ["blocks", "Rails_BottomLeft", -13, 0],
      "railsNorthWest": ["blocks", "Rails_BottomRight", -13, 0],
      "railsEast": ["blocks", "Rails_Horizontal", -13, 0],
      "railsWest": ["blocks", "Rails_Horizontal", -13, 0],
      "railsEastWest": ["blocks", "Rails_Horizontal", -13, 0],
      "railsSouthEast": ["blocks", "Rails_TopLeft", -13, 0],
      "railsSouthWest": ["blocks", "Rails_TopRight", -13, 0],
      "railsNorth": ["blocks", "Rails_Vertical", -13, -0],
      "railsSouth": ["blocks", "Rails_Vertical", -13, -0],
      "railsNorthSouth": ["blocks", "Rails_Vertical", -13, -0],

      "railsUnpowered": ["blocks", "Rails_UnpoweredVertical", -13, 0],
      "railsUnpoweredNorth": ["blocks", "Rails_UnpoweredVertical", -13, 0],
      "railsUnpoweredSouth": ["blocks", "Rails_UnpoweredVertical", -13, 0],
      "railsUnpoweredNorthSouth": ["blocks", "Rails_UnpoweredVertical", -13, 0],
      "railsUnpoweredEast": ["blocks", "Rails_UnpoweredHorizontal", -13, 0],
      "railsUnpoweredWest": ["blocks", "Rails_UnpoweredHorizontal", -13, 0],
      "railsUnpoweredEastWest": ["blocks", "Rails_UnpoweredHorizontal", -13, 0],

      "railsPowered": ["blocks", "Rails_PoweredVertical", -13, 0],
      "railsPoweredNorth": ["blocks", "Rails_PoweredVertical", -13, 0],
      "railsPoweredSouth": ["blocks", "Rails_PoweredVertical", -13, 0],
      "railsPoweredNorthSouth": ["blocks", "Rails_PoweredVertical", -13, 0],
      "railsPoweredEast": ["blocks", "Rails_PoweredHorizontal", -13, 0],
      "railsPoweredWest": ["blocks", "Rails_PoweredHorizontal", -13, 0],
      "railsPoweredEastWest": ["blocks", "Rails_PoweredHorizontal", -13, 0],

      "railsRedstoneTorch": ["blocks", "Rails_RedstoneTorch", -12, 9],

      "redstoneWire": ["blocks", "redstone_dust_dot_off", -13, 0],
      "redstoneWireHorizontal": ["blocks", "redstone_dust_line_h_off", -13, 0],
      "redstoneWireVertical": ["blocks", "redstone_dust_line_v_off", -13, 0],
      "redstoneWireUpRight": ["blocks", "redstone_dust_corner_BottomLeft_off", -13, 0],
      "redstoneWireUpLeft": ["blocks", "redstone_dust_corner_BottomRight_off", -13, 0],
      "redstoneWireDownRight": ["blocks", "redstone_dust_corner_TopLeft_off", -13, 0],
      "redstoneWireDownLeft": ["blocks", "redstone_dust_corner_TopRight_off", -13, 0],
      "redstoneWireTUp": ["blocks", "redstone_dust_cross_up_off", -13, 0],
      "redstoneWireTDown": ["blocks", "redstone_dust_cross_down_off", -13, 0],
      "redstoneWireTLeft": ["blocks", "redstone_dust_cross_left_off", -13, 0],
      "redstoneWireTRight": ["blocks", "redstone_dust_cross_right_off", -13, 0],
      "redstoneWireCross": ["blocks", "redstone_dust_cross_off", -13, 0],

      "redstoneWireOn": ["blocks", "redstone_dust_dot", -13, 0],
      "redstoneWireHorizontalOn": ["blocks", "redstone_dust_line_h", -13, 0],
      "redstoneWireVerticalOn": ["blocks", "redstone_dust_line_v", -13, 0],
      "redstoneWireUpRightOn": ["blocks", "redstone_dust_corner_BottomLeft", -13, 0],
      "redstoneWireUpLeftOn": ["blocks", "redstone_dust_corner_BottomRight", -13, 0],
      "redstoneWireDownRightOn": ["blocks", "redstone_dust_corner_TopLeft", -13, 0],
      "redstoneWireDownLeftOn": ["blocks", "redstone_dust_corner_TopRight", -13, 0],
      "redstoneWireTUpOn": ["blocks", "redstone_dust_cross_up", -13, 0],
      "redstoneWireTDownOn": ["blocks", "redstone_dust_cross_down", -13, 0],
      "redstoneWireTLeftOn": ["blocks", "redstone_dust_cross_left", -13, 0],
      "redstoneWireTRightOn": ["blocks", "redstone_dust_cross_right", -13, 0],
      "redstoneWireCrossOn": ["blocks", "redstone_dust_cross", -13, 0],

      "pressurePlateUp": ["blocks", "PressurePlate_Up", -13, 0],
      "pressurePlateDown": ["blocks", "PressurePlate_Down", -13, 0],

      "pistonUp": ["blocks", "piston_up", -13, 0],
      "pistonDown": ["blocks", "piston_down", -13, 0],
      "pistonLeft": ["blocks", "piston_left", -13, 0],
      "pistonRight": ["blocks", "piston_right", -13, 0],
      "pistonUpOn": ["blocks", "piston_base_up", -26, -13],
      "pistonDownOn": ["blocks", "piston_base_down", -26, -13],
      "pistonLeftOn": ["blocks", "piston_base_left", -26, -13],
      "pistonRightOn": ["blocks", "piston_base_right", -26, -13],

      "pistonArmLeft": ["blocks", "piston_arm_left", -26, -13],
      "pistonArmRight": ["blocks", "piston_arm_right", -26, -13],
      "pistonArmUp": ["blocks", "piston_arm_up", -26, -13],
      "pistonArmDown": ["blocks", "piston_arm_down", -26, -13],

      "pistonUpSticky": ["blocks", "piston_up", -13, 0],
      "pistonDownSticky": ["blocks", "piston_down_sticky", -13, 0],
      "pistonLeftSticky": ["blocks", "piston_left", -13, 0],
      "pistonRightSticky": ["blocks", "piston_right", -13, 0],
      "pistonUpOnSticky": ["blocks", "piston_base_up", -26, -13],
      "pistonDownOnSticky": ["blocks", "piston_base_down_sticky", -26, -13],
      "pistonLeftOnSticky": ["blocks", "piston_base_left", -26, -13],
      "pistonRightOnSticky": ["blocks", "piston_base_right", -26, -13],

      "pistonArmLeftSticky": ["blocks", "piston_arm_left", -26, -13],
      "pistonArmRightSticky": ["blocks", "piston_arm_right", -26, -13],
      "pistonArmUpSticky": ["blocks", "piston_arm_up", -26, -13],
      "pistonArmDownSticky": ["blocks", "piston_arm_down_sticky", -26, -13],

      "cactus": ["blocks", "cactus", -13, 0],
      "deadBush": ["blocks", "dead_bush", -13, 0],
      "glowstone": ["blocks", "glowstone", -13, 0],
      "grassPath": ["blocks", "grass_path", -13, 0],
      "ice": ["blocks", "ice", -13, 0],
      "netherrack": ["blocks", "netherrack", -13, 0],
      "netherBrick": ["blocks", "nether_brick", -13, 0],
      "quartzOre": ["blocks", "quartz_ore", -13, 0],
      "snow": ["blocks", "snow", -13, 0],
      "snowyGrass": ["blocks", "snowy_grass", -13, 0],
      "topSnow": ["blocks", "top_snow", -13, 0],

      "Nether_Portal": ["blocks", "NetherPortal1", 0, -58],

      //hooking up all old blocks that we had assets for but never used in previous years
      "bedFoot": ["blocks", "Bed_Foot", -13, 0],
      "bedHead": ["blocks", "Bed_Head", -13, 10],
      "clay": ["blocks", "Clay", -13, 0],
      "glassBlack": ["blocks", "Glass_Black", -13, 0],
      "glassBlue": ["blocks", "Glass_Blue", -13, 0],
      "glassBrown": ["blocks", "Glass_Brown", -13, 0],
      "glassCyan": ["blocks", "Glass_Cyan", -13, 0],
      "glassGray": ["blocks", "Glass_Gray", -13, 0],
      "glassGreen": ["blocks", "Glass_Green", -13, 0],
      "glassLightBlue": ["blocks", "Glass_LightBlue", -13, 0],
      "glassLime": ["blocks", "Glass_Lime", -13, 0],
      "glassMagenta": ["blocks", "Glass_Magenta", -13, 0],
      "glassOrange": ["blocks", "Glass_Orange", -13, 0],
      "glassPink": ["blocks", "Glass_Pink", -13, 0],
      "glassPurple": ["blocks", "Glass_Purple", -13, 0],
      "glassRed": ["blocks", "Glass_Red", -13, 0],
      "glassSilver": ["blocks", "Glass_Silver", -13, 0],
      "glassWhite": ["blocks", "Glass_White", -13, 0],
      "glassYellow": ["blocks", "Glass_Yellow", -13, 0],
      "terracotta": ["blocks", "Terracotta", -13, 0],
      "terracottaBlack": ["blocks", "Terracotta_Black", -13, 0],
      "terracottaBlue": ["blocks", "Terracotta_Blue", -13, 0],
      "terracottaBrown": ["blocks", "Terracotta_Brown", -13, 0],
      "terracottaCyan": ["blocks", "Terracotta_Cyan", -13, 0],
      "terracottaGray": ["blocks", "Terracotta_Gray", -13, 0],
      "terracottaGreen": ["blocks", "Terracotta_Green", -13, 0],
      "terracottaLightBlue": ["blocks", "Terracotta_LightBlue", -13, 0],
      "terracottaLime": ["blocks", "Terracotta_Lime", -13, 0],
      "terracottaMagenta": ["blocks", "Terracotta_Magenta", -13, 0],
      "terracottaOrange": ["blocks", "Terracotta_Orange", -13, 0],
      "terracottaPink": ["blocks", "Terracotta_Pink", -13, 0],
      "terracottaPurple": ["blocks", "Terracotta_Purple", -13, 0],
      "terracottaRed": ["blocks", "Terracotta_Red", -13, 0],
      "terracottaSilver": ["blocks", "Terracotta_Silver", -13, 0],
      "terracottaWhite": ["blocks", "Terracotta_White", -13, 0],
      "terracottaYellow": ["blocks", "Terracotta_Yellow", -13, 0],

      // 2018 blocks.
      "strippedOak": ["blocks", "Stripped_Oak", -12, 0],
      "strippedDarkOak": ["blocks", "Stripped_Dark_Oak", -12, 0],
      "stoneBricks": ["blocks", "Stone_Bricks", -12, 0],
      "mossyStoneBricks": ["blocks", "Mossy_Stone_Bricks", -12, 0],
      "crackedStoneBricks": ["blocks", "Cracked_Stone_Bricks", -12, 0],
      "decorativeStoneBricks": ["blocks", "Decorative_Stone_Bricks", -12, 0],
      "magmaBlock": ["blocks", "Magma_Block0", -12, 0],
      "blueCoralBlock": ["blocks", "Coral_Block_Blue", -12, 0],
      "pinkCoralBlock": ["blocks", "Coral_Block_Pink", -12, 0],
      "magentaCoralBlock": ["blocks", "Coral_Block_Magenta", -12, 0],
      "redCoralBlock": ["blocks", "Coral_Block_Red", -12, 0],
      "yellowCoralBlock": ["blocks", "Coral_Block_Yellow", -12, 0],
      "deadCoralBlock": ["blocks", "Coral_Block_Dead_Blue", -12, 0],
      "blueDeadCoralBlock": ["blocks", "Coral_Block_Dead_Blue", -12, 0],
      "pinkDeadCoralBlock": ["blocks", "Coral_Block_Dead_Pink", -12, 0],
      "magentaDeadCoralBlock": ["blocks", "Coral_Block_Dead_Magenta", -12, 0],
      "readDeadCoralBlock": ["blocks", "Coral_Block_Dead_Red", -12, 0],
      "yellowDeadCoralBlock": ["blocks", "Coral_Block_Dead_Yellow", -12, 0],
      "prismarine": ["blocks", "Prismarine0", -12, 0],
      "darkPrismarine": ["blocks", "Prismarine_Dark", -12, 0],
      "seaLantern": ["blocks", "Sea_Lantern0", -12, 0],
      "packedIce": ["blocks", "Ice_Packed", -12, 0],
      "blueIce": ["blocks", "Ice_Blue", -12, 0],
      "blackConcrete": ["blocks", "Concrete_Black", -12, 0],
      "blueCoral": ["blocks", "Coral_Blue", -12, 0],
      "pinkCoral": ["blocks", "Coral_Pink", -12, 0],
      "magentaCoral": ["blocks", "Coral_Magenta", -12, 0],
      "redCoral": ["blocks", "Coral_Red", -12, 0],
      "yellowCoral": ["blocks", "Coral_Yellow", -12, 0],
      "seaGrass": ["blocks", "Seagrass0", -12, 0],
      "kelp": ["blocks", "KelpSingle_0", -12, 0],
      "polishedGranite": ["blocks", "Polished_Granite", -12, 0],
      "blueCoralFan": ["blocks", "Coral_Fan_Blue_Bottom", -12, 0],
      "pinkCoralFan": ["blocks", "Coral_Fan_Pink_Bottom", -12, 0],
      "magentaCoralFan": ["blocks", "Coral_Fan_Magenta_Bottom", -12, 0],
      "redCoralFan": ["blocks", "Coral_Fan_Red_Bottom", -12, 0],
      "yellowCoralFan": ["blocks", "Coral_Fan_Yellow_Bottom", -12, 0],
      "blueCoralFanTop": ["blocks", "Coral_Fan_Blue_Top", -12, 0],
      "pinkCoralFanTop": ["blocks", "Coral_Fan_Pink_Top", -12, 0],
      "magentaCoralFanTop": ["blocks", "Coral_Fan_Magenta_Top", -12, 0],
      "redCoralFanTop": ["blocks", "Coral_Fan_Red_Top", -12, 0],
      "yellowCoralFanTop": ["blocks", "Coral_Fan_Yellow_Top", -12, 0],
      "blueCoralFanLeft": ["blocks", "Coral_Fan_Blue_Left", -12, 0],
      "pinkCoralFanLeft": ["blocks", "Coral_Fan_Pink_Left", -12, 0],
      "magentaCoralFanLeft": ["blocks", "Coral_Fan_Magenta_Left", -12, 0],
      "redCoralFanLeft": ["blocks", "Coral_Fan_Red_Left", -12, 0],
      "yellowCoralFanLeft": ["blocks", "Coral_Fan_Yellow_Left", -12, 0],
      "blueCoralFanRight": ["blocks", "Coral_Fan_Blue_Right", -12, 0],
      "pinkCoralFanRight": ["blocks", "Coral_Fan_Pink_Right", -12, 0],
      "magentaCoralFanRight": ["blocks", "Coral_Fan_Magenta_Right", -12, 0],
      "redCoralFanRight": ["blocks", "Coral_Fan_Red_Right", -12, 0],
      "yellowCoralFanRight": ["blocks", "Coral_Fan_Yellow_Right", -12, 0],
      "seaPickles": ["blocks", "SeaPickle", -12, 0],

      "invisible": ["blocks", "Invisible", 0, 0],
    };
    this.actionPlaneBlocks = [];
    this.toDestroy = [];
    this.resettableTweens = [];
    this.treeFluffTypes = {

      "treeAcacia": [[0, 0], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1], [-1, -2], [0, -2], [1, -2]],
      "treeBirch": [[0, 0], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1], [-1, -2], [0, -2], [1, -2], [0, -3]],
      "treeJungle": [[0, 0], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1], [-1, -2], [0, -2], [1, -2], [0, -3], [1, -3]],
      "treeOak": [[0, 0], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1], [-1, -2], [0, -2], [0, -3]],
      "treeSpruce": [[0, 0], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1], [-1, -2], [0, -2], [1, -2], [0, -3]],
      "treeSpruceSnowy": [[0, 0], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1], [-1, -2], [0, -2], [1, -2], [0, -3]]
    };
  }

  yToIndex(y) {
    return this.controller.levelModel.yToIndex(y);
  }

  create(levelModel) {
    this.createGroups();
    this.reset(levelModel);
  }

  resetEntity(entity) {
    this.preparePlayerSprite(entity.name, entity);
    entity.sprite.animations.stop();
    this.setPlayerPosition(entity.position, entity.isOnBlock, entity);
    if (entity.shouldUpdateSelectionIndicator()) {
      this.setSelectionIndicatorPosition(entity.position.x, entity.position.y);
      this.selectionIndicator.visible = true;
    }
    this.playIdleAnimation(entity.position, entity.facing, entity.isOnBlock, entity);
  }

  reset(levelModel) {
    this.player = levelModel.player;
    this.agent = levelModel.agent;

    this.resettableTweens.forEach((tween) => {
      tween.stop(false);
    });
    this.resettableTweens.length = 0;
    this.collectibleItems = [];
    this.trees = [];

    this.resetGroups(levelModel);

    if (levelModel.usePlayer) {
      this.resetEntity(this.player);

      if (levelModel.usingAgent) {
        this.resetEntity(this.agent);
      }
    }

    if (levelModel.isUnderwater()) {
      this.addOceanOverlay(levelModel.getOceanType() === 'warm' ? 0x43d5ee : 0x3938c9);
    }

    this.updateShadingGroup(levelModel.shadingPlane);
    this.updateFowGroup(levelModel.fowPlane);

    if (this.controller.followingPlayer()) {
      this.game.world.setBounds(0, 0, levelModel.planeWidth * 40, levelModel.planeHeight * 40);
      this.game.camera.follow(this.player.sprite);
      this.game.world.scale.x = 1;
      this.game.world.scale.y = 1;
    } else {
      this.game.world.setBounds(0, 0, 400, 400);
    }
  }

  update() {
    for (let i = 0; i < this.toDestroy.length; ++i) {
      this.toDestroy[i].destroy();
    }
    this.toDestroy = [];
  }

  render() {
    this.actionGroup.sort('sortOrder');
    this.fluffGroup.sort('z');
  }

  scaleShowWholeWorld(completionHandler) {
    var [scaleX, scaleY] = this.controller.scaleFromOriginal();
    var scaleTween = this.addResettableTween(this.game.world.scale).to({
      x: 1 / scaleX,
      y: 1 / scaleY
    }, 1000, Phaser.Easing.Exponential.Out);

    this.game.camera.unfollow();

    var positionTween = this.addResettableTween(this.game.camera).to({
      x: 0,
      y: 0
    }, 1000, Phaser.Easing.Exponential.Out);

    scaleTween.onComplete.addOnce(() => {
      completionHandler();
    });

    positionTween.start();
    scaleTween.start();
  }

  getDirectionName(facing) {
    return "_" + FacingDirection.directionToRelative(facing).toLowerCase();
  }

  updatePlayerDirection(position, facing) {
    let direction = this.getDirectionName(facing);

    this.setSelectionIndicatorPosition(position.x, position.y);
    this.playScaledSpeed(this.player.sprite.animations, "idle" + direction);
  }
  // animations

  playDoorAnimation(position, open, completionHandler) {
    let blockIndex = (this.yToIndex(position.y)) + position.x;
    let block = this.actionPlaneBlocks[blockIndex];
    let animationName = open ? "open" : "close";
    const animation = this.playScaledSpeed(block.animations, animationName);
    this.onAnimationEnd(animation, () => {
      animation.updateCurrentFrame();
      completionHandler();
    });
  }

  playPlayerAnimation(animationName, position, facing, isOnBlock = false, entity = this.player) {
    let direction = this.getDirectionName(facing);
    entity.sprite.sortOrder = this.yToIndex(position.y) + entity.getSortOrderOffset();

    let animName = animationName + direction;
    return this.playScaledSpeed(entity.sprite.animations, animName);
  }

  playIdleAnimation(position, facing, isOnBlock, entity = this.player) {
    this.playPlayerAnimation("idle", position, facing, isOnBlock, entity);
  }

  playSuccessAnimation(position, facing, isOnBlock, completionHandler, entity = this.player) {
    this.controller.delayBy(250, () => {
      this.audioPlayer.play("success");
      this.onAnimationEnd(this.playPlayerAnimation("celebrate", position, facing, isOnBlock, entity), () => {
        completionHandler();
      });
    });
  }

  playFailureAnimation(position, facing, isOnBlock, completionHandler, entity = this.player) {
    this.controller.delayBy(500, () => {
      this.audioPlayer.play("failure");
      this.onAnimationEnd(this.playPlayerAnimation("fail", position, facing, isOnBlock, entity), () => {
        this.controller.delayBy(800, completionHandler);
      });
    });
  }

  playBumpAnimation(position, facing, isOnBlock, entity = this.player) {
    var animation = this.playPlayerAnimation("bump", position, facing, isOnBlock, entity);
    animation.onComplete.add(() => {
      this.playIdleAnimation(position, facing, isOnBlock, entity);
    });
    return animation;
  }

  addOceanOverlay(tint) {
    const surface = this.fluffGroup.create(0, 0, "underwaterOverlay");
    [surface.scale.x, surface.scale.y] = this.controller.scaleFromOriginal();
    surface.alpha = 0.6;
    surface.blendMode = PIXI.blendModes.OVERLAY;

    const sprite = this.fluffGroup.create(0, 0, "finishOverlay");
    [sprite.scale.x, sprite.scale.y] = this.controller.scaleFromOriginal();
    sprite.alpha = 0.3;
    sprite.tint = tint;
  }

  playDrownFailureAnimation(position, facing, isOnBlock, completionHandler) {
    var sprite,
      tween;

    this.playPlayerAnimation("fail", position, facing, isOnBlock);
    this.createBlock(this.fluffGroup, position.x, position.y, "bubbles");

    sprite = this.fluffGroup.create(0, 0, "finishOverlay");
    var [scaleX, scaleY] = this.controller.scaleFromOriginal();
    sprite.scale.x = scaleX;
    sprite.scale.y = scaleY;
    sprite.alpha = 0;
    sprite.tint = 0x324bff;

    tween = this.addResettableTween(sprite).to({
      alpha: 0.5,
    }, 200, Phaser.Easing.Linear.None);

    tween.onComplete.add(() => {
      completionHandler();
    });

    tween.start();
  }

  playBurnInLavaAnimation(position, facing, isOnBlock, completionHandler) {
    var sprite,
      tween;

    this.playPlayerAnimation("jumpUp", position, facing, isOnBlock);
    this.createBlock(this.fluffGroup, position.x, position.y, "fire");

    sprite = this.fluffGroup.create(0, 0, "finishOverlay");
    var [scaleX, scaleY] = this.controller.scaleFromOriginal();
    sprite.scale.x = scaleX;
    sprite.scale.y = scaleY;
    sprite.alpha = 0;
    sprite.tint = 0xd1580d;

    tween = this.addResettableTween(sprite).to({
      alpha: 0.5,
    }, 200, Phaser.Easing.Linear.None);

    tween.onComplete.add(() => {
      completionHandler();
    });

    tween.start();
  }

  playDestroyTntAnimation(position, facing, isOnBlock, tntArray, newShadingPlaneData, completionHandler) {
    var block,
      lastAnimation;
    if (tntArray.length === 0) {
      completionHandler();
      return;
    }

    this.audioPlayer.play("fuse");
    for (var tnt in tntArray) {
      block = this.actionPlaneBlocks[this.coordinatesToIndex(tntArray[tnt])];
      lastAnimation = this.playScaledSpeed(block.animations, "explode");
    }

    this.onAnimationEnd(lastAnimation, () => {
      this.audioPlayer.play("explode");
      completionHandler();
    });
  }

  playCreeperExplodeAnimation(position, facing, destroyPosition, isOnBlock, completionHandler) {
    this.controller.delayBy(180, () => {
      //this.onAnimationLoopOnce(
      this.playPlayerAnimation("bump", position, facing, false).onComplete.add(() => {
        //add creeper windup sound
        this.audioPlayer.play("fuse");
        this.playExplodingCreeperAnimation(position, facing, destroyPosition, isOnBlock, completionHandler, this);

        this.controller.delayBy(200, () => {
          this.onAnimationLoopOnce(this.playPlayerAnimation("jumpUp", position, facing, false), () => {
            this.playIdleAnimation(position, facing, isOnBlock);
          });
        });
      });
    });
  }
  // flash
  flashEntity(entity) {
    return this.flashSpriteToWhite(entity.sprite);
  }

  flashBlock(position) {
    let blockIndex = (this.yToIndex(position.y)) + position.x;
    let block = this.actionPlaneBlocks[blockIndex];
    return this.flashSpriteToWhite(block);
  }

  flashSpriteToWhite(sprite) {
    var fillBmd = this.game.add.bitmapData(sprite.width, sprite.height);
    fillBmd.fill(0xFF, 0xFF, 0xFF, 0xFF);
    var maskedBmd = this.game.add.bitmapData(sprite.width, sprite.height);

    var srcRect = { x: 0, y: 0, width: sprite.width, height: sprite.height };
    var dstRect = { x: 0, y: 0, width: sprite.texture.crop.width, height: sprite.texture.crop.height };
    maskedBmd.alphaMask(fillBmd, sprite, srcRect, dstRect);

    var flashSprite = sprite.addChild(this.game.make.sprite(0, 0, maskedBmd.texture));
    flashSprite.alpha = 0;
    var fadeMs = 60;
    var pauseMs = fadeMs * 4;
    var totalIterations = 3;
    var totalDuration = 0;
    var aIn = { alpha: 1.0 };
    var aOut = { alpha: 0.0 };
    var fadeIn = this.game.add.tween(flashSprite).to(aIn, fadeMs, Phaser.Easing.Linear.None);
    var fadeOut = this.game.add.tween(flashSprite).to(aOut, fadeMs, Phaser.Easing.Linear.None);
    totalDuration = fadeMs * 2;
    fadeIn.chain(fadeOut);
    var lastStep = fadeOut;

    for (var i = 0; i < totalIterations - 1; i++) {
      var innerPause = this.game.add.tween(flashSprite).to(aOut, pauseMs, Phaser.Easing.Linear.None);
      var innerFadeIn = this.game.add.tween(flashSprite).to(aIn, fadeMs, Phaser.Easing.Linear.None);
      var innerFadeOut = this.game.add.tween(flashSprite).to(aOut, fadeMs, Phaser.Easing.Linear.None);
      totalDuration += pauseMs + fadeMs * 2;
      lastStep.chain(innerPause);
      innerPause.chain(innerFadeIn);
      innerFadeIn.chain(innerFadeOut);
      lastStep = innerFadeOut;
    }

    lastStep.onComplete.add(() => {
      flashSprite.destroy();
    });

    fadeIn.start();

    return totalDuration * 2;
  }

  playExplodingCreeperAnimation(position, facing, destroyPosition, isOnBlock, completionHandler) {
    let blockIndex = (this.yToIndex(destroyPosition.y)) + destroyPosition.x;
    let blockToExplode = this.actionPlaneBlocks[blockIndex];

    var creeperExplodeAnimation = blockToExplode.animations.getAnimation("explode");
    creeperExplodeAnimation.onComplete.add(() => {
      blockToExplode.kill();
      this.playExplosionAnimation(position, facing, destroyPosition, isOnBlock, () => {
        this.controller.delayBy(100, () => {
          this.playFailureAnimation(position, facing, false, completionHandler);
        });
      }, false);
      this.audioPlayer.play("explode");
      this.playExplosionCloudAnimation(destroyPosition);
    });

    creeperExplodeAnimation.play();
  }

  playExplosionCloudAnimation(position) {
    this.createBlock(this.fluffGroup, position.x, position.y, "explosion");
  }

  coordinatesToIndex(coordinates) {
    return (this.yToIndex(coordinates.y)) + coordinates.x;
  }

  playMinecartTurnAnimation(position, isUp, isOnBlock, completionHandler, turnDirection) {
    const facing = isUp ? FacingDirection.North : FacingDirection.South;
    var animation = this.playPlayerAnimation("mineCart_turn" + turnDirection, position, facing, false);
    return animation;
  }

  playMinecartMoveForwardAnimation(position, facing, isOnBlock, completionHandler, nextPosition, speed) {
    var tween;

    //if we loop the sfx that might be better?
    this.audioPlayer.play("minecart");
    this.playPlayerAnimation("mineCart", position, facing, false);
    tween = this.addResettableTween(this.player.sprite).to(
      this.positionToScreen(nextPosition), speed, Phaser.Easing.Linear.None);
    tween.start();
    this.player.sprite.sortOrder = this.yToIndex(nextPosition.y) + 10;

    return tween;
  }

  playMinecartAnimation(isOnBlock, completionHandler) {
    //start at 3,2
    const position = new Position(3, 2);
    this.setPlayerPosition(position, isOnBlock);
    this.player.facing = 2;

    const animation = this.playLevelEndAnimation(position, this.player.facing, isOnBlock, completionHandler, false);
    this.game.world.setBounds(0, 0, 440, 400);
    this.game.camera.follow(this.player.sprite);

    animation.onComplete.add(() => {
      this.playTrack(position, this.player.facing, isOnBlock, this.player, completionHandler);
    });
  }

  playTrack(position, facing, isOnBlock, entity = this.player, completionHandler) {
    entity.onTracks = true;

    // Need to get track on current position to avoid mishandling immediate turns
    let track = this.controller.levelModel.actionPlane.getMinecartTrack(position, facing);

    let nextPos = Position.forward(entity.position, facing);

    if (entity.getOffTrack || (!track && !this.isFirstTimeOnRails(position, nextPos))) {
      entity.getOffTrack = false;
      entity.onTracks = false;
      if (completionHandler) {
        completionHandler();
      }
      return;
    }

    // If track is undefined, it means the player was not on a rail
    // but if we reached this, that means we're trying to get on a rail for the first time
    // and we need to grab that track -in front of us-
    if (track === undefined) {
      track = this.controller.levelModel.actionPlane.getMinecartTrack(nextPos, facing);
      // Having a weird bug on publish where rail destruction while riding causes a destructure of
      // non-iterable instance error. If getTrack fails with currPos and nextPos, just call the whole thing off.
      // so that we don't reach the const assignment below.
      if (track === undefined) {
        entity.getOffTrack = false;
        entity.onTracks = false;
        if (completionHandler) {
          completionHandler();
        }
        return;
      }
    }

    let direction;
    const [arraydirection, nextPosition, nextFacing, speed] = track;
    this.player.position = nextPosition;

    //turn
    if (arraydirection.substring(0, 4) === "turn") {
      direction = arraydirection.substring(5);
      const isUp = facing === FacingDirection.North || nextFacing === FacingDirection.North;
      this.onAnimationEnd(this.playMinecartTurnAnimation(position, isUp, isOnBlock, completionHandler, direction), () => {
        this.playTrack(nextPosition, nextFacing, isOnBlock, entity, completionHandler);
      });
    } else {
      this.onAnimationEnd(this.playMinecartMoveForwardAnimation(position, facing, isOnBlock, completionHandler, nextPosition, speed), () => {
        this.playTrack(nextPosition, nextFacing, isOnBlock, entity, completionHandler);
      });
    }
  }

  /**
  * Handling the first case of walking onto a track while not currently on one
  */
  isFirstTimeOnRails(currPos, nextPos) {
    let nextBlock = this.controller.levelModel.actionPlane.getBlockAt(nextPos);
    let currBlock = this.controller.levelModel.actionPlane.getBlockAt(currPos);
    if ((nextBlock && currBlock) && (!currBlock.isRail && nextBlock.isRail)) {
      return true;
    }
    return false;
  }

  addHouseBed(bottomCoordinates) {
    //Temporary, will be replaced by bed blocks
    var bedTopCoordinate = (bottomCoordinates[1] - 1);
    var sprite = this.actionGroup.create(38 * bottomCoordinates[0], 35 * bedTopCoordinate, "bed");
    sprite.sortOrder = this.yToIndex(bottomCoordinates[1]);
  }

  addDoor(coordinates) {
    var sprite;
    let toDestroy = this.actionPlaneBlocks[this.coordinatesToIndex(coordinates)];
    this.createActionPlaneBlock(coordinates, "door");
    //Need to grab the correct blocktype from the action layer
    //And use that type block to create the ground block under the door
    sprite = this.createBlock(this.groundGroup, coordinates[0], coordinates[1], "wool_orange");
    toDestroy.kill();
    sprite.sortOrder = this.yToIndex(6);
  }

  playSuccessHouseBuiltAnimation(position, facing, isOnBlock, createFloor, houseObjectPositions, completionHandler, updateScreen) {
    //fade screen to white
    //Add house blocks
    //fade out of white
    //Play success animation on player.
    var tweenToW = this.playLevelEndAnimation(position, facing, isOnBlock, () => {
      this.controller.delayBy(4000, completionHandler);
    }, true);
    tweenToW.onComplete.add(() => {
      this.audioPlayer.play("houseSuccess");
      //Change house ground to floor
      var xCoord;
      var yCoord;
      var sprite;

      for (var i = 0; i < createFloor.length; ++i) {
        xCoord = createFloor[i][1];
        yCoord = createFloor[i][2];
        /*this.groundGroup._data[this.coordinatesToIndex([xCoord,yCoord])].kill();*/
        sprite = this.createBlock(this.groundGroup, xCoord, yCoord, "wool_orange");
        sprite.sortOrder = this.yToIndex(yCoord);
      }

      this.addHouseBed(houseObjectPositions[0]);
      this.addDoor(houseObjectPositions[1]);
      this.groundGroup.sort('sortOrder');
      updateScreen();
    });
  }

  //Tweens in and then out of white. returns the tween to white for adding callbacks
  playLevelEndAnimation(position, facing, isOnBlock, completionHandler, playSuccessAnimation) {
    var sprite,
      tweenToW,
      tweenWToC;

    sprite = this.fluffGroup.create(0, 0, "finishOverlay");
    var [scaleX, scaleY] = this.controller.scaleFromOriginal();
    sprite.scale.x = scaleX;
    sprite.scale.y = scaleY;
    sprite.alpha = 0;

    tweenToW = this.tweenToWhite(sprite);
    tweenWToC = this.tweenFromWhiteToClear(sprite);

    tweenToW.onComplete.add(() => {
      this.selectionIndicator.visible = false;
      this.setPlayerPosition(position, isOnBlock);
      tweenWToC.start();
    });
    if (playSuccessAnimation) {
      tweenWToC.onComplete.add(() => {
        this.playSuccessAnimation(position, facing, isOnBlock, completionHandler);
      });
    }
    tweenToW.start();

    return tweenToW;
  }

  tweenFromWhiteToClear(sprite) {
    var tweenWhiteToClear;

    tweenWhiteToClear = this.addResettableTween(sprite).to({
      alpha: 0.0,
    }, 700, Phaser.Easing.Linear.None);
    return tweenWhiteToClear;
  }

  tweenToWhite(sprite) {
    var tweenToWhite;

    tweenToWhite = this.addResettableTween(sprite).to({
      alpha: 1.0,
    }, 300, Phaser.Easing.Linear.None);
    return tweenToWhite;
  }

  playBlockSound(groundType) {
    var oreString = groundType.substring(0, 3);
    if (groundType === "water" || groundType === "lava") {
      return;
    }
    if (groundType === "stone" || groundType === "cobblestone" || groundType === "bedrock" ||
      oreString === "ore" || groundType === "bricks") {
      this.audioPlayer.play("stepStone");
    } else if (groundType === "grass" || groundType === "dirt" || groundType === "dirtCoarse" ||
      groundType === "wool_orange" || groundType === "wool") {
      this.audioPlayer.play("stepGrass");
    } else if (groundType === "gravel") {
      this.audioPlayer.play("stepGravel");
    } else if (groundType === "farmlandWet") {
      this.audioPlayer.play("stepFarmland");
    } else {
      this.audioPlayer.play("stepWood");
    }
  }

  /**
   * Play the MoveForward animation for the given entity. Note that both
   * MoveForward and MoveBackward are implemented using the same walk
   * animations, and the only difference between the two is the logic they use
   * for moving north after placing a block
   *
   * @see LevelView.playWalkAnimation
   */
  playMoveForwardAnimation(entity, oldPosition, facing, shouldJumpDown, isOnBlock, groundType, completionHandler) {
    // make sure to render high for when moving north after placing a block
    const targetYIndex = entity.position.y + (facing === FacingDirection.North ? 1 : 0);
    this.playWalkAnimation(entity, oldPosition, facing, shouldJumpDown, isOnBlock, groundType, targetYIndex, completionHandler);
  }

  /**
   * @see LevelView.playMoveForwardAnimation
   */
  playMoveBackwardAnimation(entity, oldPosition, facing, shouldJumpDown, isOnBlock, groundType, completionHandler) {
    // make sure to render high for when moving north after placing a block
    const targetYIndex = entity.position.y + (facing === FacingDirection.South ? 1 : 0);
    this.playWalkAnimation(entity, oldPosition, facing, shouldJumpDown, isOnBlock, groundType, targetYIndex, completionHandler);
  }

  playWalkAnimation(entity, oldPosition, facing, shouldJumpDown, isOnBlock, groundType, targetYIndex, completionHandler) {
    let tween;
    let position = entity.position;

    //stepping on stone sfx
    this.playBlockSound(groundType);

    if (entity.shouldUpdateSelectionIndicator()) {
      this.setSelectionIndicatorPosition(position.x, position.y);
    }

    if (!shouldJumpDown) {
      const animName = 'walk' + this.getDirectionName(facing);
      this.playScaledSpeed(entity.sprite.animations, animName);
      tween = this.addResettableTween(entity.sprite).to(
        this.positionToScreen(position, isOnBlock, entity), 180, Phaser.Easing.Linear.None);
    } else {
      tween = this.playPlayerJumpDownVerticalAnimation(facing, position, oldPosition);
    }

    // Update the sort order 3/4 of the way through the animation
    tween.onUpdateCallback((tween, percent) => {
      if (percent >= 0.75) {
        entity.sprite.sortOrder = this.yToIndex(targetYIndex) + entity.getSortOrderOffset();
        tween.onUpdateCallback(null);
      }
    });

    tween.onComplete.add(() => {
      completionHandler();
    });

    tween.start();
  }

  /**
   * Animate the player jumping down from on top of a block to ground level.
   * @param {FacingDirection} facing
   * @param {Array<int>}position
   * @param {?Array<int>} oldPosition
   * @return {Phaser.Tween}
   */
  playPlayerJumpDownVerticalAnimation(facing, position, oldPosition = position) {
    var animName = "jumpDown" + this.getDirectionName(facing);
    this.playScaledSpeed(this.player.sprite.animations, animName);

    const start = this.positionToScreen(oldPosition);
    const end = this.positionToScreen(position);
    const tween = this.addResettableTween(this.player.sprite).to({
      x: [start.x, end.x, end.x],
      y: [start.y, end.y - 50, end.y],
    }, 300, Phaser.Easing.Linear.None).interpolation((v, k) => {
      return Phaser.Math.bezierInterpolation(v, k);
    });
    tween.onComplete.addOnce(() => {
      this.audioPlayer.play("fall");
    });
    tween.start();

    return tween;
  }

  playPlaceBlockAnimation(position, facing, blockType, blockTypeAtPosition, entity, completionHandler) {
    var jumpAnimName;
    let blockIndex = this.yToIndex(position.y) + position.x;

    if (entity.shouldUpdateSelectionIndicator()) {
      this.setSelectionIndicatorPosition(position.x, position.y);
    }

    if (entity === this.agent || LevelBlock.isWalkable(blockType)) {
      var signalDetacher = this.playPlayerAnimation("punch", position, facing, false, entity).onComplete.add(() => {
        signalDetacher.detach();
        completionHandler();
      });
    } else {
      this.audioPlayer.play("placeBlock");

      let direction = this.getDirectionName(facing);

      jumpAnimName = "jumpUp" + direction;

      if (blockTypeAtPosition !== "") {
        this.playExplosionAnimation(position, facing, position, blockTypeAtPosition, (() => {
        }), false);
      }

      this.playScaledSpeed(this.player.sprite.animations, jumpAnimName);
      var placementTween = this.addResettableTween(this.player.sprite).to({
        y: (-55 + 40 * position.y)
      }, 125, Phaser.Easing.Cubic.EaseOut);

      placementTween.onComplete.addOnce(() => {
        placementTween = null;

        if (blockTypeAtPosition !== "") {
          this.actionPlaneBlocks[blockIndex].kill();
        }
        completionHandler();
      });
      placementTween.start();
    }
  }

  playPlaceBlockInFrontAnimation(entity = this.player, playerPosition, facing, blockPosition, completionHandler) {
    this.setSelectionIndicatorPosition(blockPosition.x, blockPosition.y);

    this.playPlayerAnimation("punch", playerPosition, facing, false, entity).onComplete.addOnce(() => {
      completionHandler();
    });
  }

  correctForShadowOverlay(blockType, sprite) {
    if (blockType.startsWith("piston")) {
      sprite.sortOrder -= 0.1;
    }
  }

  createActionPlaneBlock(position, blockType) {
    const block = new LevelBlock(blockType);
    const blockIndex = (this.yToIndex(position.y)) + position.x;

    // Remove the old sprite at this position, if there is one.
    this.actionGroup.remove(this.actionPlaneBlocks[blockIndex]);
    this.groundGroup.remove(this.actionPlaneBlocks[blockIndex]);

    if (block.isEmpty) {
      this.actionPlaneBlocks[blockIndex] = null;
      return;
    }

    // Create a new sprite.
    let sprite;
    if (block.getIsMiniblock()) {
      // miniblocks defined on the action plane like this should have a
      // closer collectible range and a narrower drop offset than normal
      sprite = this.createMiniBlock(position.x, position.y, blockType, {
        collectibleDistance: 1,
        xOffsetRange: 10,
        yOffsetRange: 10
      });
    } else {
      const group = block.shouldRenderOnGroundPlane() ? this.groundGroup : this.actionGroup;
      const offset = block.shouldRenderOnGroundPlane() ? -0.5 : 0;
      sprite = this.createBlock(group, position.x, position.y + offset, blockType);
    }

    if (sprite) {
      sprite.sortOrder = this.yToIndex(position.y);
      this.correctForShadowOverlay(blockType, sprite);
    }

    this.actionPlaneBlocks[blockIndex] = sprite;
  }

  playShearAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler) {
    let blockIndex = this.yToIndex(destroyPosition.y) + destroyPosition.x;
    let blockToShear = this.actionPlaneBlocks[blockIndex];

    blockToShear.animations.stop(null, true);
    this.onAnimationLoopOnce(this.playScaledSpeed(blockToShear.animations, "used"), () => {
      this.playScaledSpeed(blockToShear.animations, "face");
    });

    this.playExplosionAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler, true);
  }

  playShearSheepAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler) {
    this.setSelectionIndicatorPosition(destroyPosition.x, destroyPosition.y);

    this.onAnimationEnd(this.playPlayerAnimation("punch", playerPosition, facing, false), () => {
      let blockIndex = (this.yToIndex(destroyPosition.y)) + destroyPosition.x;
      let blockToShear = this.actionPlaneBlocks[blockIndex];

      blockToShear.animations.stop(null, true);
      this.onAnimationLoopOnce(this.playScaledSpeed(blockToShear.animations, "used"), () => {
        this.playScaledSpeed(blockToShear.animations, "face");
      });

      this.playExplosionAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler, true);
    });
  }

  destroyBlockWithoutPlayerInteraction(destroyPosition) {
    let blockIndex = (this.yToIndex(destroyPosition.y)) + destroyPosition.x;
    let blockToDestroy = this.actionPlaneBlocks[blockIndex];

    let destroyOverlay = this.actionGroup.create(-12 + 40 * destroyPosition.x, -22 + 40 * destroyPosition.y, "destroyOverlay", "destroy1");
    destroyOverlay.sortOrder = this.yToIndex(destroyPosition.y) + 2;
    this.onAnimationEnd(destroyOverlay.animations.add("destroy", Phaser.Animation.generateFrameNames("destroy", 1, 12, "", 0), 30, false), () => {
      this.actionPlaneBlocks[blockIndex] = null;

      if (blockToDestroy.hasOwnProperty("onBlockDestroy")) {
        blockToDestroy.onBlockDestroy(blockToDestroy);
      }

      blockToDestroy.kill();
      destroyOverlay.kill();
      this.toDestroy.push(blockToDestroy);
      this.toDestroy.push(destroyOverlay);
      this.audioPlayer.play('dig_wood1');
    });

    this.playScaledSpeed(destroyOverlay.animations, "destroy");
  }

  playDestroyBlockAnimation(playerPosition, facing, destroyPosition, blockType, entity, completionHandler) {
    if (entity.shouldUpdateSelectionIndicator()) {
      this.setSelectionIndicatorPosition(destroyPosition.x, destroyPosition.y);
    }

    var playerAnimation = undefined;
    if (entity === this.agent) {
      playerAnimation = "punchDestroy";
    } else {
      playerAnimation = blockType.match(/(ore|stone|clay|bricks|bedrock)/) ? "mine" : "punchDestroy";
    }
    this.playPlayerAnimation(playerAnimation, playerPosition, facing, false, entity);
    this.playMiningParticlesAnimation(facing, destroyPosition);
    this.playBlockDestroyOverlayAnimation(playerPosition, facing, destroyPosition, blockType, entity, completionHandler);
  }

  playPunchDestroyAirAnimation(playerPosition, facing, destroyPosition, completionHandler, entity = this.player) {
    this.playPunchAnimation(playerPosition, facing, destroyPosition, "punchDestroy", completionHandler, entity);
  }

  playPunchAirAnimation(playerPosition, facing, destroyPosition, completionHandler, entity = this.player) {
    this.playPunchAnimation(playerPosition, facing, destroyPosition, "punch", completionHandler, entity);
  }

  playPunchAnimation(playerPosition, facing, destroyPosition, animationType, completionHandler, entity = this.player) {
    if (entity.shouldUpdateSelectionIndicator()) {
      this.setSelectionIndicatorPosition(destroyPosition.x, destroyPosition.y);
    }
    this.onAnimationEnd(this.playPlayerAnimation(animationType, playerPosition, facing, false, entity), () => {
      completionHandler();
    });
  }

  /**
   * Play the block Destroy Overlay animation. As a side effect, also actually
   * destroy the block in the level model, update the visualization, and play
   * the block Explision animation.
   *
   * Note that if the block is of a type that does not require an overlay
   * animation, this method (confusingly) simply calls the side effects
   * immediately.
   */
  playBlockDestroyOverlayAnimation(playerPosition, facing, destroyPosition, blockType, entity, completionHandler) {
    const blockIndex = (this.yToIndex(destroyPosition.y)) + destroyPosition.x;
    const blockToDestroy = this.actionPlaneBlocks[blockIndex];

    const afterDestroy = () => {
      if (blockToDestroy.hasOwnProperty("onBlockDestroy")) {
        blockToDestroy.onBlockDestroy(blockToDestroy);
      }

      this.controller.levelModel.destroyBlockForward(entity);
      this.controller.updateShadingPlane();
      this.controller.updateFowPlane();

      if (entity.shouldUpdateSelectionIndicator()) {
        this.setSelectionIndicatorPosition(playerPosition.x, playerPosition.y);
      }

      this.audioPlayer.play('dig_wood1');
      this.playExplosionAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler, true, entity);
    };

    if (LevelBlock.skipsDestructionOverlay(blockType)) {
      // "flat" blocks are by definition not cube shaped and so shouldn't accept
      // the cube-shaped destroy overlay animation. In this case, destroy the
      // block immediately without waiting for the animation.
      afterDestroy();
    } else {
      const destroyOverlay = this.actionGroup.create(-12 + 40 * destroyPosition.x, -22 + 40 * destroyPosition.y, "destroyOverlay", "destroy1");
      if (LevelBlock.isFlat(blockType)) {
        const cropRect = new Phaser.Rectangle(0, 0, 60, 40);
        destroyOverlay.position.y += 20;
        destroyOverlay.crop(cropRect);
      }
      destroyOverlay.sortOrder = this.yToIndex(destroyPosition.y) + 2;
      this.onAnimationEnd(destroyOverlay.animations.add("destroy", Phaser.Animation.generateFrameNames("destroy", 1, 12, "", 0), 30, false), () => {
        destroyOverlay.kill();
        this.toDestroy.push(destroyOverlay);

        afterDestroy();
      });
      this.playScaledSpeed(destroyOverlay.animations, "destroy");
    }
  }

  playMiningParticlesAnimation(facing, destroyPosition) {
    let miningParticlesData = [
      [24, -100, -80],   // left
      [12, -120, -80],   // bottom
      [0, -60, -80],   // right
      [36, -80, -60],   // top
    ];

    let direction = this.getDirectionName(facing);
    let miningParticlesIndex = (direction === "_left" ? 0 : direction === "_bottom" ? 1 : direction === "_right" ? 2 : 3);
    let miningParticlesFirstFrame = miningParticlesData[miningParticlesIndex][0];
    let miningParticlesOffsetX = miningParticlesData[miningParticlesIndex][1];
    let miningParticlesOffsetY = miningParticlesData[miningParticlesIndex][2];
    let miningParticles = this.actionGroup.create(miningParticlesOffsetX + 40 * destroyPosition.x, miningParticlesOffsetY + 40 * destroyPosition.y, "miningParticles", "MiningParticles" + miningParticlesFirstFrame);
    miningParticles.sortOrder = this.yToIndex(destroyPosition.y) + 2;
    this.onAnimationEnd(miningParticles.animations.add("miningParticles", Phaser.Animation.generateFrameNames("MiningParticles", miningParticlesFirstFrame, miningParticlesFirstFrame + 11, "", 0), 30, false), () => {
      miningParticles.kill();
      this.toDestroy.push(miningParticles);
    });
    this.playScaledSpeed(miningParticles.animations, "miningParticles");
  }

  playExplosionAnimation(playerPosition, facing, destroyPosition, blockType, completionHandler, placeBlock, entity = this.player) {
    var explodeAnim = this.actionGroup.create(-36 + 40 * destroyPosition.x, -30 + 40 * destroyPosition.y, "blockExplode", "BlockBreakParticle0");

    switch (blockType) {
      case "treeAcacia":
      case "logAcacia":
        explodeAnim.tint = 0x6c655a;
        break;
      case "treeBirch":
      case "logBirch":
        explodeAnim.tint = 0xdad6cc;
        break;
      case "treeJungle":
      case "logJungle":
        explodeAnim.tint = 0x6a4f31;
        break;
      case "treeOak":
      case "logOak":
        explodeAnim.tint = 0x675231;
        break;
      case "treeSpruce":
      case "logSpruce":
        explodeAnim.tint = 0x4b3923;
        break;
      case "planksAcacia":
        explodeAnim.tint = 0xba6337;
        break;
      case "planksBirch":
        explodeAnim.tint = 0xd7cb8d;
        break;
      case "planksJungle":
        explodeAnim.tint = 0xb88764;
        break;
      case "planksOak":
        explodeAnim.tint = 0xb4905a;
        break;
      case "planksSpruce":
        explodeAnim.tint = 0x805e36;
        break;
      case "stone":
      case "oreCoal":
      case "oreDiamond":
      case "oreIron":
      case "oreGold":
      case "oreEmerald":
      case "oreRedstone":
        explodeAnim.tint = 0xC6C6C6;
        break;
      case "grass":
      case "cropWheat":
        explodeAnim.tint = 0x5d8f23;
        break;
      case "dirt":
        explodeAnim.tint = 0x8a5e33;
        break;

      case "redstoneWireOn":
      case "redstoneWireHorizontalOn":
      case "redstoneWireVerticalOn":
      case "redstoneWireUpRightOn":
      case "redstoneWireUpLeftOn":
      case "redstoneWireDownRightOn":
      case "redstoneWireDownLeftOn":
      case "redstoneWireTUpOn":
      case "redstoneWireTDownOn":
      case "redstoneWireTLeftOn":
      case "redstoneWireTRightOn":
      case "redstoneWireCrossOn":
        explodeAnim.tint = 0x990707;
        break;

      case "redstoneWire":
      case "redstoneWireHorizontal":
      case "redstoneWireVertical":
      case "redstoneWireUpRight":
      case "redstoneWireUpLeft":
      case "redstoneWireDownRight":
      case "redstoneWireDownLeft":
      case "redstoneWireTUp":
      case "redstoneWireTDown":
      case "redstoneWireTLeft":
      case "redstoneWireTRight":
      case "redstoneWireCross":
        explodeAnim.tint = 0x290202;
        break;

      default:
        break;
    }

    explodeAnim.sortOrder = this.yToIndex(destroyPosition.y) + 2;
    this.onAnimationEnd(explodeAnim.animations.add("explode", Phaser.Animation.generateFrameNames("BlockBreakParticle", 0, 7, "", 0), 30, false), () => {
      explodeAnim.kill();
      this.toDestroy.push(explodeAnim);

      if (placeBlock) {
        if (!this.controller.getIsDirectPlayerControl()) {
          this.playPlayerAnimation("idle", playerPosition, facing, false, entity);
        }
        if (completionHandler !== null) {
          this.playItemDropAnimation(destroyPosition, blockType, completionHandler);
        }
      }
    });
    this.playScaledSpeed(explodeAnim.animations, "explode");
    if (this.controller.getIsDirectPlayerControl() ^ !placeBlock) {
      if (completionHandler) {
        completionHandler();
      }
    }
  }

  playItemDropAnimation(destroyPosition, blockType, completionHandler) {
    var sprite = this.createMiniBlock(destroyPosition.x, destroyPosition.y, blockType);

    if (sprite) {
      sprite.sortOrder = this.yToIndex(destroyPosition.y) + 2;
    }

    if (this.controller.getIsDirectPlayerControl()) {
      if (completionHandler) {
        completionHandler();
      }
    } else {
      this.onAnimationEnd(this.playScaledSpeed(sprite.animations, "animate"), () => {
        const player = this.controller.levelModel.player;
        this.playItemAcquireAnimation(player.position, player.facing, sprite, completionHandler, blockType);
      });
    }
  }

  playScaledSpeed(animationManager, name) {
    var animation = animationManager.getAnimation(name);
    if (animation === null) {
      console.log("can't find animation name : " + name);
    } else {
      if (!animation.originalFps) {
        animation.originalFps = 1000 / animation.delay;
      }
      var fps = this.controller.originalFpsToScaled(animation.originalFps);
      return animationManager.play(name, fps);
    }
  }

  playItemAcquireAnimation(playerPosition, facing, sprite, completionHandler, blockType) {
    var tween;

    tween = this.addResettableTween(sprite).to(
      this.positionToScreen(playerPosition), 200, Phaser.Easing.Linear.None);

    tween.onComplete.add(() => {
      const caughtUpToPlayer = Position.equals(this.player.position, playerPosition);
      if (sprite.alive && caughtUpToPlayer) {
        this.audioPlayer.play("collectedBlock");
        this.player.inventory[blockType] =
          (this.player.inventory[blockType] || 0) + 1;
        sprite.kill();
        this.toDestroy.push(sprite);
        const event = createEvent('craftCollectibleCollected');
        event.blockType = blockType;
        window.dispatchEvent(event);
        if (completionHandler) {
          completionHandler();
        }
      } else {
        this.playItemAcquireAnimation(this.player.position, this.player.facing, sprite, completionHandler, blockType);
      }
    });

    tween.start();
  }

  /**
   * Convert a grid coordinate position to a screen X/Y location.
   * @param {Array<int>} position
   * @param {?boolean} isOnBlock
   * @return {{x: number, y: number}}
   */
  positionToScreen(position, isOnBlock = false, entity = this.player) {
    const x = position.x;
    const y = position.y;
    const xOffset = entity.offset[0];
    const yOffset = entity.offset[1];
    return {
      x: xOffset + 40 * x,
      y: yOffset + (isOnBlock ? -23 : 0) + 40 * y,
    };
  }

  /**
   * @param {Position} position
   * @param {boolean} isOnBlock
   * @param {Entity} entity
   */
  setPlayerPosition(position, isOnBlock, entity = this.player) {
    const screen = this.positionToScreen(position, isOnBlock, entity);
    entity.sprite.x = screen.x;
    entity.sprite.y = screen.y;
    entity.sprite.sortOrder = this.yToIndex(screen.y) + entity.getSortOrderOffset();
  }

  setSelectionIndicatorPosition(x, y) {
    this.selectionIndicator.x = -35 + 23 + 40 * x;
    this.selectionIndicator.y = -55 + 43 + 40 * y;
  }

  /**
   * @param {Array<Array<int>>} gridSpaces An array of x and y grid coordinates.
   */
  drawHintPath(gridSpaces) {
    this.hintGroup.removeAll(true);

    const bounds = this.game.world.bounds;
    const hintPath = this.game.add.bitmapData(bounds.width, bounds.height);

    const context = hintPath.context;
    context.setLineDash([10, 10]);
    context.lineDashOffset = 5;
    context.lineWidth = 2;
    context.strokeStyle = '#fff';
    context.shadowColor = '#000';
    context.shadowOffsetY = 7;
    context.shadowBlur = 4;

    context.beginPath();
    gridSpaces.forEach(([x, y]) => {
      context.lineTo(40 * x + 19, 40 * y + 19);
    });
    context.stroke();

    const sprite = this.hintGroup.create(0, 0, hintPath);
    sprite.alpha = 0;

    this.addResettableTween(sprite)
      .to({alpha: 1}, 830, Phaser.Easing.Quadratic.Out)
      .to({alpha: 0.4}, 500, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
  }

  createGroups() {
    this.groundGroup = this.game.add.group();
    this.groundGroup.yOffset = -2;
    this.shadingGroup = this.game.add.group();
    this.shadingGroup.yOffset = -2;
    this.hintGroup = this.game.add.group();
    this.actionGroup = this.game.add.group();
    this.actionGroup.yOffset = -22;
    this.fluffGroup = this.game.add.group();
    this.fluffGroup.yOffset = -160;
    this.fowGroup = this.game.add.group();
    this.fowGroup.yOffset = 0;
  }

  resetGroups(levelData) {
    var sprite,
      x,
      y;

    this.groundGroup.removeAll(true);
    this.actionGroup.removeAll(true);
    this.hintGroup.removeAll(true);
    this.fluffGroup.removeAll(true);
    this.shadingGroup.removeAll(true);
    this.fowGroup.removeAll(true);

    this.baseShading = this.game.add.group();

    this.actionPlaneBlocks = [];
    this.refreshGroundGroup();

    for (y = 0; y < this.controller.levelModel.planeHeight; ++y) {
      for (x = 0; x < this.controller.levelModel.planeWidth; ++x) {
        let position = new Position(x, y);
        sprite = null;

        const groundBlock = levelData.groundDecorationPlane.getBlockAt(position);
        if (!groundBlock.isEmpty) {
          sprite = this.createBlock(this.actionGroup, x, y, groundBlock.blockType);
          if (sprite) {
            sprite.sortOrder = this.yToIndex(y);
          }
        }

        const actionBlock = levelData.actionPlane.getBlockAt(position);
        if (!actionBlock.shouldRenderOnGroundPlane()) {
          this.createActionPlaneBlock(position, actionBlock.blockType);
        }
      }
    }

    for (y = 0; y < this.controller.levelModel.planeHeight; ++y) {
      for (x = 0; x < this.controller.levelModel.planeWidth; ++x) {
        let position = new Position(x, y);
        if (!levelData.fluffPlane.getBlockAt(position).isEmpty) {
          sprite = this.createBlock(this.fluffGroup, x, y, levelData.fluffPlane.getBlockAt(position).blockType);
        }
      }
    }
  }

  refreshGroundGroup() {
    this.groundGroup.removeAll(true);
    for (var y = 0; y < this.controller.levelModel.planeHeight; ++y) {
      for (var x = 0; x < this.controller.levelModel.planeWidth; ++x) {
        let position = new Position(x, y);
        const groundBlock = this.controller.levelModel.groundPlane.getBlockAt(position);
        var sprite = this.createBlock(this.groundGroup, x, y, groundBlock.blockType);

        if (sprite) {
          sprite.sortOrder = this.yToIndex(y);
        }

        const actionBlock = this.controller.levelModel.actionPlane.getBlockAt(position);
        if (actionBlock && actionBlock.shouldRenderOnGroundPlane()) {
          this.createActionPlaneBlock(position, actionBlock.blockType);
        }
      }
    }
  }

  refreshActionGroup(positions) {
    // We need to add indices to refresh if there are other blocks in the action plane that might
    // conflict with the drawing of refreshed blocks.
    for (let i = 0; i < positions.length; ++i) {
      const positionBelow = Position.south(positions[i]);
      const indexIsValid = this.controller.levelModel.actionPlane.inBounds(positionBelow);
      if (indexIsValid) {
        let blockToCheck = this.controller.levelModel.actionPlane.getBlockAt(positionBelow);
        const indexIsEmpty = blockToCheck.blockType === "";
        if (!indexIsEmpty) {
          positions.push(positionBelow);
        }
      }
    }

    // Once all blocks that need to be refreshed are accounted for, go in and actually refresh.
    positions.forEach(position => {
      if (position) {
        const newBlock = this.controller.levelModel.actionPlane.getBlockAt(position);

        // we don't want to refresh doors. They're not destroyable, and
        // refreshing will lead to bad animation states
        if (newBlock && newBlock.getIsDoor()) {
          return;
        }

        if ((newBlock && newBlock.getIsMiniblock())
        || newBlock && newBlock.getIsTree()) {
          return;
        }

        if (newBlock && newBlock.blockType) {
          this.createActionPlaneBlock(position, newBlock.blockType);
        } else if (newBlock) {
          // Remove the old sprite at this position, if there is one.
          const index = this.coordinatesToIndex(position);
          this.actionGroup.remove(this.actionPlaneBlocks[index]);
          this.groundGroup.remove(this.actionPlaneBlocks[index]);
        }
      }
    });
  }

  updateShadingGroup(shadingData) {
    var index, shadowItem, sx, sy, atlas;

    this.shadingGroup.removeAll();

    this.shadingGroup.add(this.baseShading);
    if (this.selectionIndicator) {
      this.shadingGroup.add(this.selectionIndicator);
    }

    for (index = 0; index < shadingData.length; ++index) {
      shadowItem = shadingData[index];

      atlas = shadowItem.atlas;
      sx = 40 * shadowItem.x;
      sy = 40 * shadowItem.y;

      const sprite = this.shadingGroup.create(sx, sy, atlas, shadowItem.type);
      if (atlas === 'WaterAO') {
        sprite.tint = 0x555555;
      }
    }
  }

  updateFowGroup(fowData) {
    var index, fx, fy, atlas;

    this.fowGroup.removeAll();

    for (index = 0; index < fowData.length; ++index) {
      let fowItem = fowData[index];

      if (fowItem !== "") {
        atlas = "undergroundFow";
        fx = -40 + 40 * fowItem.x;
        fy = -40 + 40 * fowItem.y;

        switch (fowItem.type) {
          case "FogOfWar_Center":
            break;

          default:
            break;
        }

        var sprite = this.fowGroup.create(fx, fy, atlas, fowItem.type);
        sprite.alpha = 0.8;
      }
    }
  }

  playRandomPlayerIdle(facing, entity = this.player) {
    var facingName,
      rand,
      animationName;

    facingName = this.getDirectionName(facing);
    rand = Math.trunc(Math.random() * 4) + 1;

    switch (rand) {
      case 1:
        animationName = "idle";
        break;
      case 2:
        animationName = "lookLeft";
        break;
      case 3:
        animationName = "lookRight";
        break;
      case 4:
        animationName = "lookAtCam";
        break;
      default:
    }

    animationName += facingName;
    this.playScaledSpeed(entity.sprite.animations, animationName);
  }

  generatePlayerCelebrateFrames() {
    let frameList = [];

    //Face Down
    for (let i = 0; i < 6; ++i) {
      frameList.push("Player_001");
    }
    //Crouch Left
    frameList = frameList.concat("Player_259");
    frameList = frameList.concat("Player_260");
    //Jump
    frameList.push("Player_261");
    frameList.push("Player_297");
    frameList.push("Player_298");
    frameList.push("Player_297");
    frameList.push("Player_261");
    //Jump
    frameList.push("Player_261");
    frameList.push("Player_297");
    frameList.push("Player_298");
    frameList.push("Player_297");
    frameList.push("Player_261");
    //Pause
    frameList.push("Player_001");
    frameList.push("Player_001");
    frameList.push("Player_001");
    frameList.push("Player_001");
    frameList.push("Player_001");
    //Jump
    frameList.push("Player_261");
    frameList.push("Player_297");
    frameList.push("Player_298");
    frameList.push("Player_297");
    frameList.push("Player_261");
    //Jump
    frameList.push("Player_261");
    frameList.push("Player_297");
    frameList.push("Player_298");
    frameList.push("Player_297");
    frameList.push("Player_261");

    return frameList;
  }

  generateFramesWithEndDelay(frameName, startFrame, endFrame, endFrameFullName, buffer, frameDelay) {
    var frameList = Phaser.Animation.generateFrameNames(frameName, startFrame, endFrame, "", buffer);
    for (var i = 0; i < frameDelay; ++i) {
      frameList.push(endFrameFullName);
    }
    return frameList;
  }

  generateReverseFrames(frameName, startFrame, endFrame, suffix, buffer) {
    var frameList = Phaser.Animation.generateFrameNames(frameName, startFrame, endFrame, suffix, buffer);
    return frameList.concat(Phaser.Animation.generateFrameNames(frameName, endFrame - 1, startFrame, suffix, buffer));
  }

  preparePlayerSprite(playerName, entity = this.player) {

    entity.sprite = this.actionGroup.create(0, 0, `player${playerName}`, 'Player_121');
    if (this.controller.followingPlayer() && entity === this.player) {
      this.game.camera.follow(entity.sprite);
    }

    if (entity.shouldUpdateSelectionIndicator()) {
      this.selectionIndicator = this.shadingGroup.create(24, 44, 'selectionIndicator');
    }

    this.generateAnimations(FacingDirection.South, 0, entity);
    this.generateAnimations(FacingDirection.East, 60, entity);
    this.generateAnimations(FacingDirection.North, 120, entity);
    this.generateAnimations(FacingDirection.West, 180, entity);

    const frameRate = 20;
    const idleFrameRate = 10;
    let frameList;

    frameList = this.generateFramesWithEndDelay("Player_", 263, 262, "Player_262", 3, 5);
    frameList.push("Player_263");
    entity.sprite.animations.add('lookAtCam_down', frameList, idleFrameRate, false).onComplete.add(() => {
      this.playScaledSpeed(entity.sprite.animations, "idlePause_down");
    });

    frameList = this.generateFramesWithEndDelay("Player_", 270, 269, "Player_269", 3, 5);
    frameList.push("Player_270");
    entity.sprite.animations.add('lookAtCam_right', frameList, idleFrameRate, false).onComplete.add(() => {
      this.playScaledSpeed(entity.sprite.animations, "idlePause_right");
    });

    frameList = this.generateFramesWithEndDelay("Player_", 277, 276, "Player_276", 3, 5);
    frameList.push("Player_277");
    entity.sprite.animations.add('lookAtCam_up', frameList, idleFrameRate, false).onComplete.add(() => {
      this.playScaledSpeed(entity.sprite.animations, "idlePause_up");
    });

    frameList = this.generateFramesWithEndDelay("Player_", 284, 283, "Player_283", 3, 5);
    frameList.push("Player_284");
    entity.sprite.animations.add('lookAtCam_left', frameList, idleFrameRate, false).onComplete.add(() => {
      this.playScaledSpeed(entity.sprite.animations, "idlePause_left");
    });

    entity.sprite.animations.add('mine_down', Phaser.Animation.generateFrameNames("Player_", 241, 244, "", 3), frameRate, true);
    entity.sprite.animations.add('mine_right', Phaser.Animation.generateFrameNames("Player_", 245, 248, "", 3), frameRate, true);
    entity.sprite.animations.add('mine_up', Phaser.Animation.generateFrameNames("Player_", 249, 252, "", 3), frameRate, true);
    entity.sprite.animations.add('mine_left', Phaser.Animation.generateFrameNames("Player_", 253, 256, "", 3), frameRate, true);

    entity.sprite.animations.add('mineCart_down', Phaser.Animation.generateFrameNames("Minecart_", 5, 5, "", 2), frameRate, false);
    entity.sprite.animations.add('mineCart_turnleft_down', Phaser.Animation.generateFrameNames("Minecart_", 6, 6, "", 2), frameRate, false);
    entity.sprite.animations.add('mineCart_turnright_down', Phaser.Animation.generateFrameNames("Minecart_", 12, 12, "", 2), frameRate, false);

    entity.sprite.animations.add('mineCart_right', Phaser.Animation.generateFrameNames("Minecart_", 7, 7, "", 2), frameRate, false);
    entity.sprite.animations.add('mineCart_left', Phaser.Animation.generateFrameNames("Minecart_", 11, 11, "", 2), frameRate, false);

    entity.sprite.animations.add('mineCart_up', Phaser.Animation.generateFrameNames("Minecart_", 9, 9, "", 2), frameRate, false);
    entity.sprite.animations.add('mineCart_turnleft_up', Phaser.Animation.generateFrameNames("Minecart_", 10, 10, "", 2), frameRate, false);
    entity.sprite.animations.add('mineCart_turnright_up', Phaser.Animation.generateFrameNames("Minecart_", 8, 8, "", 2), frameRate, false);
  }

  playerFrameName(n) {
    return Phaser.Animation.generateFrameNames("Player_", n, n, "", 3);
  }

  /**
   * Create action animations for Alex, Steve and the Agent from the sprite
   * sheet and JSON map.
   * @param {FacingDirection} facing
   * @param {int} offset
   */
  generateAnimations(facing, offset, entity = this.player) {
    const direction = this.getDirectionName(facing);
    const idleFrameRate = 10;
    let frameRate = 20;

    let frameList = [];

    frameList.push(this.playerFrameName(offset + 1));
    frameList.push(this.playerFrameName(offset + 3));
    frameList.push(this.playerFrameName(offset + 1));
    frameList.push(this.playerFrameName(offset + 7));
    frameList.push(this.playerFrameName(offset + 9));
    frameList.push(this.playerFrameName(offset + 7));
    for (let i = 0; i < 5; ++i) {
      frameList.push(this.playerFrameName(offset + 1));
    }

    entity.sprite.animations.add('idle' + direction, frameList, frameRate / 3, false).onComplete.add(() => {
      this.playRandomPlayerIdle(facing, entity);
    });
    frameList = this.generateFramesWithEndDelay("Player_", offset + 6, offset + 5, this.playerFrameName(offset + 5), 3, 5);
    frameList.push(this.playerFrameName(offset + 6));
    entity.sprite.animations.add('lookLeft' + direction, frameList, idleFrameRate, false).onComplete.add(() => {
      this.playScaledSpeed(entity.sprite.animations, "idlePause" + direction);
    });
    frameList = this.generateFramesWithEndDelay("Player_", offset + 12, offset + 11, this.playerFrameName(offset + 11), 3, 5);
    frameList.push(this.playerFrameName(offset + 12));
    entity.sprite.animations.add('lookRight' + direction, frameList, idleFrameRate, false).onComplete.add(() => {
      this.playScaledSpeed(entity.sprite.animations, "idlePause" + direction);
    });
    frameList = [];
    for (let i = 0; i < 13; ++i) {
      frameList.push(this.playerFrameName(offset + 1));
    }
    entity.sprite.animations.add('idlePause' + direction, frameList, frameRate / 3, false).onComplete.add(() => {
      this.playRandomPlayerIdle(facing, entity);
    });

    entity.sprite.animations.add('walk' + direction, Phaser.Animation.generateFrameNames("Player_", offset + 13, offset + 20, "", 3), frameRate, true);
    let singlePunch = Phaser.Animation.generateFrameNames("Player_", offset + 21, offset + 24, "", 3);
    entity.sprite.animations.add('punch' + direction, singlePunch, frameRate, false).onComplete.add(() => {
      this.audioPlayer.play("punch");
    });
    entity.sprite.animations.add('punchDestroy' + direction, singlePunch.concat(singlePunch).concat(singlePunch), frameRate, false);
    entity.sprite.animations.add('hurt' + direction, Phaser.Animation.generateFrameNames("Player_", offset + 25, offset + 28, "", 3), frameRate, false).onComplete.add(() => {
      this.playScaledSpeed(entity.sprite.animations, "idlePause" + direction);
    });
    entity.sprite.animations.add('crouch' + direction, Phaser.Animation.generateFrameNames("Player_", offset + 29, offset + 32, "", 3), frameRate, true);
    entity.sprite.animations.add('jumpUp' + direction, Phaser.Animation.generateFrameNames("Player_", offset + 33, offset + 36, "", 3), frameRate / 2, true);
    entity.sprite.animations.add('fail' + direction, Phaser.Animation.generateFrameNames("Player_", offset + 45, offset + 48, "", 3), frameRate, false);
    entity.sprite.animations.add('celebrate' + direction, this.generatePlayerCelebrateFrames(), frameRate / 2, false);
    entity.sprite.animations.add('bump' + direction, Phaser.Animation.generateFrameNames("Player_", offset + 49, offset + 54, "", 3), frameRate, false).onStart.add(() => {
      this.audioPlayer.play("bump");
    });
    entity.sprite.animations.add('jumpDown' + direction, Phaser.Animation.generateFrameNames("Player_", offset + 55, offset + 60, "", 3), frameRate, true);
  }

  /**
   * Create a "miniblock" asset (representing a floating collectable) based on
   * the given block at the given coordinates
   *
   * @param {Number} x
   * @param {Number} y
   * @param {String} blockType
   * @param {Object} [overrides] optional overrides for various defaults
   * @param {Number} [overrides.collectibleDistance=2] distance at which the
   *        miniblock can be collected
   * @param {Number} [overrides.xOffsetRange=40]
   * @param {Number} [overrides.yOffsetRange=40]
   */
  createMiniBlock(x, y, blockType, overrides = {}) {
    let sprite = null,
      frameList;

    const collectibleDistance = overrides.collectibleDistance || 2;
    const xOffsetRange = overrides.xOffsetRange || 40;
    const yOffsetRange = overrides.yOffsetRange || 40;

    const frame = LevelBlock.getMiniblockFrame(blockType);
    if (!(frame && this.miniBlocks[frame])) {
      return sprite;
    }

    const atlas = "miniBlocks";
    const framePrefix = this.miniBlocks[frame][0];
    const frameStart = this.miniBlocks[frame][1];
    const frameEnd = this.miniBlocks[frame][2];
    const xOffset = -10 - (xOffsetRange / 2) + (Math.random() * xOffsetRange);
    const yOffset = 0 - (yOffsetRange / 2) + (Math.random() * yOffsetRange) + this.actionGroup.yOffset;
    const offset = new Position(xOffset, yOffset);

    frameList = Phaser.Animation.generateFrameNames(framePrefix, frameStart, frameEnd, ".png", 3);
    sprite = this.actionGroup.create(xOffset + 40 * x, yOffset + 40 * y, atlas, "");
    const anim = sprite.animations.add("animate", frameList, 10, false);

    // If direct player control, we have stuff to do to manage miniblock pick up
    if (this.controller.getIsDirectPlayerControl()) {
      const distanceBetween = function (position, position2) {
        return Math.sqrt(Math.pow(position.x - position2.x, 2) + Math.pow(position.y - position2.y, 2));
      };

      const collectiblePosition = this.controller.levelModel.spritePositionToIndex(offset, new Position(sprite.x, sprite.y));
      this.collectibleItems.push([sprite, offset, blockType, collectibleDistance]);
      anim.onComplete.add(() => {
        if (this.controller.levelModel.usePlayer) {
          if (distanceBetween(this.player.position, collectiblePosition) < collectibleDistance) {
            this.player.collectItems(new Position(x, y));
          }
        }
      });
    }

    this.playScaledSpeed(sprite.animations, "animate");
    return sprite;
  }

  playAnimationWithOffset(sprite, animationName, animationFrameTotal, startFrame) {
    var rand = Math.trunc(Math.random() * animationFrameTotal) + startFrame;
    this.playScaledSpeed(sprite.animations, animationName).setFrame(rand, true);
  }

  psuedoRandomTint(group, sprite, x, y) {
    const psuedoRandom = Math.pow((x * 10) + y, 5) % 251;
    let darkness = psuedoRandom / 12;
    if (group === this.groundGroup) {
      darkness += 24;
    } else {
      darkness *= 0.75;
    }
    const brightness = Math.floor(0xff - darkness).toString(16);
    sprite.tint = '0x' + brightness + brightness + brightness;
  }

  createBlock(group, x, y, blockType) {
    const position = new Position(x, y);

    var i,
      sprite = null,
      frameList,
      atlas,
      frame,
      xOffset,
      yOffset;


    var buildTree = function (levelView, frame) {
      let type = blockType.substring(4);
      sprite = levelView.createBlock(group, x, y, "log" + type);
      sprite.fluff = levelView.createBlock(levelView.fluffGroup, x, y, "leaves" + type);
      sprite.onBlockDestroy = (logSprite) => {
        logSprite.fluff.animations.add("despawn", Phaser.Animation.generateFrameNames("Leaves_" + type, frame[0], frame[1], ".png", 0), 10, false).onComplete.add(() => {
          levelView.toDestroy.push(logSprite.fluff);
          logSprite.fluff.kill();
        });

        levelView.playScaledSpeed(logSprite.fluff.animations, "despawn");
      };
      levelView.trees.push({ sprite: sprite, type: blockType, position: position });
    };

    const buildDoor = (levelView, type) => {
      atlas = this.blocks[blockType][0];
      frame = this.blocks[blockType][1];
      xOffset = this.blocks[blockType][2];
      yOffset = this.blocks[blockType][3];
      sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);

      frameList = [];
      var animationFramesIron = Phaser.Animation.generateFrameNames(type, 0, 3, "", 1);
      for (let j = 0; j < 5; ++j) {
        frameList.push(`${type}0`);
      }
      frameList = frameList.concat(animationFramesIron);

      sprite.animations.add("open", frameList);

      frameList = [];
      animationFramesIron = Phaser.Animation.generateFrameNames(type, 3, 0, "", 1);
      for (let j = 0; j < 5; ++j) {
        frameList.push(`${type}3`);
      }
      frameList = frameList.concat(animationFramesIron);
      sprite.animations.add("close", frameList);

      return sprite;
    };

    switch (blockType) {
      case "treeAcacia": //0,7
        buildTree(this, [0, 7]);
        break;
      case "treeBirch":  //0,8
        buildTree(this, [0, 8]);
        break;
      case "treeJungle": //0,9
        buildTree(this, [0, 9]);
        break;
      case "treeOak":
        buildTree(this, [0, 6]);
        break;
      case "treeSpruce": //0,8
        buildTree(this, [0, 8]);
        break;
      case "treeSpruceSnowy": //1,9
        buildTree(this, [0, 8]);
        break;
      case "cropWheat":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Wheat", 0, 2, "", 0);
        sprite.animations.add("idle", frameList, 0.4, false);
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      case "torch":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Torch", 0, 23, "", 0);
        sprite.animations.add("idle", frameList, 15, true);
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      case "water":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Water_", 0, 5, "", 0);
        sprite.animations.add("idle", frameList, 5, true);
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      //for placing wetland for crops in free play
      case "watering":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        sprite.kill();
        this.toDestroy.push(sprite);
        this.createBlock(this.groundGroup, x, y, "farmlandWet");
        this.refreshGroundGroup();
        break;

      case "lava":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Lava_", 0, 5, "", 0);
        sprite.animations.add("idle", frameList, 5, true);
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      case "magmaBlock":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Magma_Block", 0, 5, "", 0);
        sprite.animations.add("idle", frameList, 5, true);
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      case "prismarine":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Prismarine", 0, 5, "", 0);
        sprite.animations.add("idle", frameList, 5, true);
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      case "seaLantern":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Sea_Lantern", 0, 4, "", 0);
        sprite.animations.add("idle", frameList, 5, true);
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      case "seaGrass":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Seagrass", 0, 5, "", 0);
        sprite.animations.add("idle", frameList, 5, true);
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      case "kelp":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("KelpSingle_", 0, 5, "", 0);
        sprite.animations.add("idle", frameList, 5, true);
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      case "NetherPortal":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("NetherPortal", 1, 6, "", 0);
        sprite.animations.add("idle", frameList, 5, true);
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      case "lavaPop":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("LavaPop", 1, 7, "", 2);
        for (i = 0; i < 4; ++i) {
          frameList.push("LavaPop07");
        }
        frameList = frameList.concat(Phaser.Animation.generateFrameNames("LavaPop", 8, 13, "", 2));
        for (i = 0; i < 3; ++i) {
          frameList.push("LavaPop13");
        }
        frameList = frameList.concat(Phaser.Animation.generateFrameNames("LavaPop", 14, 30, "", 2));
        for (i = 0; i < 8; ++i) {
          frameList.push("LavaPop01");
        }
        sprite.animations.add("idle", frameList, 5, true);
        this.playAnimationWithOffset(sprite, "idle", 29, 1);
        break;

      case "fire":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Fire", 0, 14, "", 2);
        sprite.animations.add("idle", frameList, 5, true);
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      case "bubbles":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Bubbles", 0, 14, "", 2);
        sprite.animations.add("idle", frameList, 5, true);
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      case "explosion":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("Explosion", 0, 16, "", 1);
        sprite.animations.add("idle", frameList, 15, false).onComplete.add(() => {
          this.toDestroy.push(sprite);
          sprite.kill();
        });
        this.playScaledSpeed(sprite.animations, "idle");
        break;

      case "door":
        sprite = buildDoor(this, "Door");
        break;

      case "doorIron":
        sprite = buildDoor(this, "DoorIron");
        if (this.blockReceivesCornerShadow(x, y)) {
          sprite.addChild(this.game.make.sprite(-40, 55, "blockShadows", "Shadow_Parts_Fade_overlap.png"));
        }
        break;

      case "tnt":
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        frameList = Phaser.Animation.generateFrameNames("TNTexplosion", 0, 8, "", 0);
        sprite.animations.add("explode", frameList, 7, false).onComplete.add(() => {
          this.playExplosionCloudAnimation(position);
          sprite.kill();
          this.toDestroy.push(sprite);
          this.actionPlaneBlocks[this.coordinatesToIndex(position)] = null;
        });
        break;

      default:
        atlas = this.blocks[blockType][0];
        frame = this.blocks[blockType][1];
        xOffset = this.blocks[blockType][2];
        yOffset = this.blocks[blockType][3];
        sprite = group.create(xOffset + 40 * x, yOffset + group.yOffset + 40 * y, atlas, frame);
        if (group === this.actionGroup || group === this.groundGroup) {
          if (!LevelBlock.isWalkable(blockType)) {
            this.psuedoRandomTint(group, sprite, x, y);
          }
        }
        if (group === this.actionGroup && !LevelBlock.isWalkable(blockType) && this.blockReceivesCornerShadow(x, y)) {
          let xShadow = -39;
          let yShadow = 40;
          if (blockType.startsWith("pistonArm")) {
            xShadow = -26;
            yShadow = 53;
          }
          sprite.addChild(this.game.make.sprite(xShadow, yShadow, "blockShadows", "Shadow_Parts_Fade_overlap.png"));
        }
        if (blockType.startsWith('redstoneWire') && blockType.endsWith('On')) {
          sprite.addChild(this.addRedstoneSparkle());
        }
        break;
    }

    return sprite;
  }

  addRedstoneSparkle() {
    const blank = "redstone_sparkle99.png";
    const sprite = this.game.make.sprite(20, 25, "redstoneSparkle", blank);

    // Establish the three different animations.
    for (let i = 0; i < 3; i++) {
      const n = i * 8;
      const frames = [blank].concat(Phaser.Animation.generateFrameNames("redstone_sparkle", n, n + 7, ".png"), blank);
      sprite.animations.add(`fizz_${i}`, frames, 7);
    }

    const playRandomSparkle = () => {
      setTimeout(() => {
        if (!sprite.alive) {
          return;
        }

        // Pick one of the animations to play.
        let whichAnim = Math.floor(Math.random() * 3);
        this.onAnimationEnd(this.playScaledSpeed(sprite.animations, `fizz_${whichAnim}`), playRandomSparkle);

        // Randomize which corner of the index the animation manifests in.
        sprite.position.x = (Math.random() > 0.5) ? 20 : 40;
        sprite.position.y = (Math.random() > 0.5) ? 25 : 45;
      }, randomInt(500, 7000) / this.controller.tweenTimeScale);
    };

    playRandomSparkle();

    return sprite;
  }

  blockReceivesCornerShadow(x, y) {
    const southBlock = this.controller.levelModel.actionPlane.getBlockAt([x, y + 1]);
    if (!southBlock || (southBlock.blockType && !southBlock.isWalkable)) {
      return false;
    }

    const southWestBlock = this.controller.levelModel.actionPlane.getBlockAt([x - 1, y + 1]);
    return southWestBlock && southWestBlock.blockType && !southWestBlock.isWalkable;
  }

  isUnderTree(treeIndex, position) {
    // invalid index
    if (treeIndex >= this.trees.length || treeIndex < 0) {
      return false;
    }
    var fluffPositions = this.treeFluffTypes[this.trees[treeIndex].type];
    for (var i = 0; i < fluffPositions.length; i++) {
      if (this.trees[treeIndex].position.x + fluffPositions[i][0] === position.x && this.trees[treeIndex].position.y + fluffPositions[i][1] === position.y) {
        return true;
      }
    }
    return false;
  }

  changeTreeAlpha(treeIndex, alpha) {
    var tween = this.controller.levelView.addResettableTween(this.trees[treeIndex].sprite.fluff).to({
      alpha: alpha
    }, 300, Phaser.Easing.Linear.None);

    tween.start();
  }

  onAnimationEnd(animation, completionHandler) {
    var signalBinding = animation.onComplete.add(() => {
      signalBinding.detach();
      completionHandler();
    });
  }

  onAnimationStart(animation, completionHandler) {
    var signalBinding = animation.onStart.add(() => {
      signalBinding.detach();
      completionHandler();
    });
  }

  onAnimationLoopOnce(animation, completionHandler) {
    var signalBinding = animation.onLoop.add(() => {
      signalBinding.detach();
      completionHandler();
    });
  }

  addResettableTween(sprite) {
    var tween = this.game.add.tween(sprite);
    tween.timeScale = this.controller.tweenTimeScale;
    this.resettableTweens.push(tween);
    return tween;
  }

  /**
  * Animate Door and set the status
  */
  animateDoor(index, open) {
    let player = this.controller.levelModel.player;
    this.setSelectionIndicatorPosition(this.controller.levelModel.actionPlane.indexToCoordinates(index)[0], this.controller.levelModel.actionPlane.indexToCoordinates(index)[1]);
    this.controller.audioPlayer.play("doorOpen");
    // If it's not walable, then open otherwise, close.
    const position = this.controller.levelModel.actionPlane.indexToCoordinates(index);
    this.playDoorAnimation(position, open, () => {
      const block = this.controller.levelModel.actionPlane.getBlockAt(position);
      block.isWalkable = block.isOpen;
      if (block.blockType !== "doorIron") {
        // Iron doors don't need to set the player animation to Idle, because they're not opened with 'use'.
        this.playIdleAnimation(player.position, player.facing, player.isOnBlock, player);
      }
      this.setSelectionIndicatorPosition(player.position.x, player.position.y);
    });
  }

};
