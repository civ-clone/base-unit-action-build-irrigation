"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildIrrigation = void 0;
const BuildingIrrigation_1 = require("./Rules/BuildingIrrigation");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Irrigation_1 = require("@civ-clone/base-tile-improvement-irrigation/Irrigation");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
class BuildIrrigation extends DelayedAction_1.default {
    perform() {
        const [moveCost] = this.ruleRegistry()
            .process(MovementCost_1.default, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost || 0, () => {
            new Irrigation_1.default(this.unit().tile());
        }, BuildingIrrigation_1.default);
        this.ruleRegistry().process(Moved_1.default, this.unit(), this);
    }
}
exports.BuildIrrigation = BuildIrrigation;
exports.default = BuildIrrigation;
//# sourceMappingURL=BuildIrrigation.js.map