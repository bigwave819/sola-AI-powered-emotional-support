"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const home_module_1 = require("./home/home.module");
const mood_module_1 = require("./mood/mood.module");
const exercises_module_1 = require("./exercises/exercises.module");
const insights_module_1 = require("./insights/insights.module");
const ai_module_1 = require("./ai/ai.module");
const journal_module_1 = require("./journal/journal.module");
const safety_module_1 = require("./safety/safety.module");
const privacy_module_1 = require("./privacy/privacy.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, users_module_1.UsersModule, home_module_1.HomeModule, mood_module_1.MoodModule, exercises_module_1.ExercisesModule, insights_module_1.InsightsModule, ai_module_1.AiModule, journal_module_1.JournalModule, safety_module_1.SafetyModule, privacy_module_1.PrivacyModule, subscriptions_module_1.SubscriptionsModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map