"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildIrrigation = void 0;
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Irrigation_1 = require("@civ-clone/base-tile-improvement-irrigation/Irrigation");
class BuildIrrigation extends DelayedAction_1.default {
    perform() {
        const [moveCost,] = this.ruleRegistry()
            .process(MovementCost_1.MovementCost, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost || 0, () => {
            new Irrigation_1.Irrigation(this.unit().tile());
        });
        this.ruleRegistry().process(Moved_1.Moved, this.unit(), this);
    }
}
exports.BuildIrrigation = BuildIrrigation;
exports.default = BuildIrrigation;
//# sourceMappingURL=BuildIrrigation.js.map