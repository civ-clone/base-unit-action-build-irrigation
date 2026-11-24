import BuildIrrigation, { COMPLETE } from '../BuildIrrigation';
import Built from '@civ-clone/core-tile-improvement/Rules/Built';
import Effect from '@civ-clone/core-rule/Effect';
import Irrigation from '@civ-clone/base-tile-improvement-irrigation/Irrigation';
import Generator from '@civ-clone/core-world-generator/Generator';
import PendingEffect from '@civ-clone/core-pending-effect/PendingEffect';
import PendingEffectRegistry from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry, {
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Unit from '@civ-clone/core-unit/Unit';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';
import { instance } from '@civ-clone/core-unit/BusyRegistry';

class Engineers extends Unit {}

// civ-clone/web-renderer#248: a save loaded into another game finishes the job into that game's registries.
describe('BuildIrrigation loaded into a game', (): void => {
  it("builds a `Irrigation` through the loading game's `Built` rules, not the module instance's", (): void => {
    const context = {
        pendingEffects: new PendingEffectRegistry(),
        rules: new RuleRegistry(),
        turn: new Turn(),
      },
      tile = new Tile(0, 0, new Terrain(), new World(new Generator(1, 1))),
      unit = new Engineers(null, new Player(), tile, new RuleRegistry()),
      inContext: [Tile, TileImprovement][] = [],
      inInstance: [Tile, TileImprovement][] = [],
      instanceRule = new Built(
        new Effect((builtTile: Tile, improvement: TileImprovement): void => {
          inInstance.push([builtTile, improvement]);
        })
      );

    context.rules.register(
      new Built(
        new Effect((builtTile: Tile, improvement: TileImprovement): void => {
          inContext.push([builtTile, improvement]);
        })
      )
    );
    ruleRegistryInstance.register(instanceRule);

    try {
      context.pendingEffects.register(
        new PendingEffect(COMPLETE, unit, { endTurn: '1' })
      );
      context.turn.set(1);

      instance.rebuild('BuildingIrrigation', unit, context).process();

      expect(inContext).to.have.length(1);
      expect(inContext[0][0]).to.equal(tile);
      expect(inContext[0][1]).to.instanceof(Irrigation);
      expect(inInstance).to.have.length(0);
    } finally {
      ruleRegistryInstance.unregister(instanceRule);
    }
  });
});
