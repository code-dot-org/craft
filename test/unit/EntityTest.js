const test = require('tape');

const BaseEntity = require('../../src/js/game/Entities/BaseEntity');
const Player = require('../../src/js/game/Entities/Player');
const Agent = require('../../src/js/game/Entities/Agent');

const mockGameController = {
  getIsDirectPlayerControl: () => false,
  levelData: {},
};

test('canPlaceBlockOver', t => {
  const solidBlocks = ["dirt", "cobblestone"];
  const liquidBlocks = ["water", "lava"];

  const baseEntity = new BaseEntity(mockGameController, "Entity", "Entity", 1, 1, 1);
  const player = new Player(mockGameController, "Player", 1, 1, "Player", true, 1);
  const agent = new Agent(mockGameController, "PlayerAgent", 1, 1, "Agent", true, 1);

  // default entities can't place blocks at all
  solidBlocks.concat(liquidBlocks).forEach((block) => {
    t.false(baseEntity.canPlaceBlockOver("anything", block).canPlace);
  });

  // Player can only place on the ground plane if on top of water or lava
  solidBlocks.forEach((block) => {
    const result = player.canPlaceBlockOver("anything", block);
    t.true(result.canPlace);
    t.equal(result.plane, "actionPlane");
  });
  liquidBlocks.forEach((block) => {
    const result = player.canPlaceBlockOver("anything", block);
    t.true(result.canPlace);
    t.equal(result.plane, "groundPlane");
  });

  // Player can only place wheat on farmland
  solidBlocks.concat(liquidBlocks).forEach((block) => {
    t.false(player.canPlaceBlockOver("cropWheat", block).canPlace);
  });
  t.true(player.canPlaceBlockOver("cropWheat", "farmlandWet").canPlace);

  // Agents can only place solid blocks if they are standing on liquid
  solidBlocks.forEach((blockToPlace) => {
    solidBlocks.forEach((groundBlock) => {
      t.false(agent.canPlaceBlockOver(blockToPlace, groundBlock).canPlace);
    });
    liquidBlocks.forEach((groundBlock) => {
      t.true(agent.canPlaceBlockOver(blockToPlace, groundBlock).canPlace);
    });
  });

  // Agents cannot place redstone, pistons, or rails on liquid
  ["redstoneWire", "piston", "rails"].forEach((blockToPlace) => {
    liquidBlocks.forEach((groundBlock) => {
      t.false(agent.canPlaceBlockOver(blockToPlace, groundBlock).canPlace);
    });
  });

  // Agents will place redstone and rails on the action plane
  ["redstoneWire", "rails"].forEach((blockToPlace) => {
    solidBlocks.forEach((groundBlock) => {
      t.equal(agent.canPlaceBlockOver(blockToPlace, groundBlock).plane, "actionPlane");
    });
  });

  t.end();
});

