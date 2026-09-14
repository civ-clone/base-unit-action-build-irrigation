"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildIrrigation = exports.COMPLETE = void 0;
const BuildingIrrigation_1 = require("./Rules/BuildingIrrigation");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Irrigation_1 = require("@civ-clone/base-tile-improvement-irrigation/Irrigation");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const registerDelayedAction_1 = require("@civ-clone/core-unit/registerDelayedAction");
exports.COMPLETE = 'base-unit-action-build-irrigation:complete';
class BuildIrrigation extends DelayedAction_1.default {
    perform() {
        const [moveCost] = this.ruleRegistry()
            .process(MovementCost_1.default, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost || 0, exports.COMPLETE, BuildingIrrigation_1.default);
        this.ruleRegistry().process(Moved_1.default, this.unit(), this);
    }
}
exports.BuildIrrigation = BuildIrrigation;
// The completion behaviour used to be a closure passed to `perform`, which is
// why a unit part-way through this could not be saved: `Unit._busy` held a rule
// built around it. It is registered here instead, against the identifier the
// save records, so the closure stays in this package and the file holds a name.
(0, registerDelayedAction_1.default)({
    BusyRule: BuildingIrrigation_1.default,
    handler: exports.COMPLETE,
    action: (unit) => new BuildIrrigation(unit.tile(), unit.tile(), unit),
    complete: (unit) => {
        new Irrigation_1.default(unit.tile());
    },
});
exports.default = BuildIrrigation;
//# sourceMappingURL=BuildIrrigation.js.map