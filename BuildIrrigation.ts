import BuildingIrrigation from './Rules/BuildingIrrigation';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import Irrigation from '@civ-clone/base-tile-improvement-irrigation/Irrigation';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import MovementCost from '@civ-clone/core-unit/Rules/MovementCost';
import Unit from '@civ-clone/core-unit/Unit';
import registerDelayedAction from '@civ-clone/core-unit/registerDelayedAction';

export const COMPLETE = 'base-unit-action-build-irrigation:complete';

export class BuildIrrigation extends DelayedAction {
  perform(): void {
    const [moveCost]: number[] = this.ruleRegistry()
      .process(MovementCost, this.unit(), this)
      .sort((a: number, b: number): number => b - a);

    super.perform(moveCost || 0, COMPLETE, BuildingIrrigation);

    this.ruleRegistry().process(Moved, this.unit(), this);
  }
}

// The completion behaviour used to be a closure passed to `perform`, which is
// why a unit part-way through this could not be saved: `Unit._busy` held a rule
// built around it. It is registered here instead, against the identifier the
// save records, so the closure stays in this package and the file holds a name.
registerDelayedAction({
  BusyRule: BuildingIrrigation,
  handler: COMPLETE,
  action: (unit: Unit) => new BuildIrrigation(unit.tile(), unit.tile(), unit),
  complete: (unit: Unit) => {
    new Irrigation(unit.tile());
  },
});

export default BuildIrrigation;
