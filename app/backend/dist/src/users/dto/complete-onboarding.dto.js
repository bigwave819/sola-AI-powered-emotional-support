"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteOnboardingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CompleteOnboardingDto {
    ageConfirmed;
    motivations;
    baselineMood;
    reflectionPreference;
    timeCommitment;
    notificationsEnabled;
    preferredName;
}
exports.CompleteOnboardingDto = CompleteOnboardingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Confirm the user is of required age' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CompleteOnboardingDto.prototype, "ageConfirmed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'What the user wants from Sola', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CompleteOnboardingDto.prototype, "motivations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Starting mood score', minimum: 1, maximum: 10 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CompleteOnboardingDto.prototype, "baselineMood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Preferred AI reflection style', enum: ['writing', 'talking', 'quick', 'guided'], example: 'writing' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['writing', 'talking', 'quick', 'guided']),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "reflectionPreference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'How much time the user commits', enum: ['2min', '5min', '10min', 'whenever'], example: '5min' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['2min', '5min', '10min', 'whenever']),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "timeCommitment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether notifications are enabled' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CompleteOnboardingDto.prototype, "notificationsEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'What Sola should call the user', required: false, maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "preferredName", void 0);
//# sourceMappingURL=complete-onboarding.dto.js.map