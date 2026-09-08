"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAFETY_TRIGGER_PHRASE = exports.FakeAiProvider = void 0;
const common_1 = require("@nestjs/common");
const SAFETY_TRIGGER_PHRASE = 'TRIGGER_SAFETY_TEST';
exports.SAFETY_TRIGGER_PHRASE = SAFETY_TRIGGER_PHRASE;
let FakeAiProvider = class FakeAiProvider {
    async generateReflection(req) {
        return {
            reflectionText: `[fake reflection for: ${req.journalText.slice(0, 20)}]`,
            flaggedForSafety: req.journalText.includes(SAFETY_TRIGGER_PHRASE),
        };
    }
    async detectSafetyRisk(text) {
        return text.includes(SAFETY_TRIGGER_PHRASE);
    }
};
exports.FakeAiProvider = FakeAiProvider;
exports.FakeAiProvider = FakeAiProvider = __decorate([
    (0, common_1.Injectable)()
], FakeAiProvider);
//# sourceMappingURL=fake.provider.js.map