import { Moved, IMovedRegistry } from '@civ-clone/core-unit/Rules/Moved';
import {
  MovementCost,
  IMovementCostRegistry,
} from '@civ-clone/core-unit/Rules/MovementCost';
import BuildingIrrigation from './Rules/BuildingIrrigation';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import Irrigation from '@civ-clone/base-tile-improvement-irrigation/Irrigation';

export class BuildIrrigation extends DelayedAction {
  perform(): void {
    const [moveCost]: number[] = (this.ruleRegistry() as IMovementCostRegistry)
      .process(MovementCost, this.unit(), this)
      .sort((a: number, b: number): number => b - a);

    super.perform(
      moveCost || 0,
      (): void => {
        new Irrigation(this.unit().tile());
      },
      BuildingIrrigation
    );

    (this.ruleRegistry() as IMovedRegistry).process(Moved, this.unit(), this);
  }
}

export default BuildIrrigation;
