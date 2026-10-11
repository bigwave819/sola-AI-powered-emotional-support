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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const journal_service_1 = require("./journal.service");
const update_journal_dto_1 = require("./dto/update-journal.dto");
let JournalController = class JournalController {
    journalService;
    constructor(journalService) {
        this.journalService = journalService;
    }
    create(req, moodEntryId) {
        return this.journalService.create(req.user.userId, moodEntryId);
    }
    list(req) {
        return this.journalService.list(req.user.userId);
    }
    getOne(req, id) {
        return this.journalService.getOne(req.user.userId, id);
    }
    update(req, id, dto) {
        return this.journalService.update(req.user.userId, id, dto.body);
    }
    finalize(req, id) {
        return this.journalService.finalize(req.user.userId, id);
    }
    delete(req, id) {
        return this.journalService.delete(req.user.userId, id);
    }
    reflect(req, id) {
        return this.journalService.reflect(req.user.userId, id);
    }
};
exports.JournalController = JournalController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new draft journal entry' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Draft entry created' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('moodEntryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all finalized (non-draft) journal entries for the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of journal entries' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single journal entry by id' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Journal entry id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The journal entry' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Entry belongs to a different user' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Entry not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "getOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update the text body of a draft journal entry' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Journal entry id' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_journal_dto_1.UpdateJournalDto]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/finalize'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a journal entry as finalized (no longer a draft)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Journal entry id' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "finalize", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete a journal entry' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Journal entry id' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/reflect'),
    (0, swagger_1.ApiOperation)({ summary: 'Request an AI reflection on this journal entry (counts against monthly AI quota)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Journal entry id' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reflection generated' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'AI_QUOTA_EXCEEDED — monthly reflection limit reached for this tier' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "reflect", null);
exports.JournalController = JournalController = __decorate([
    (0, swagger_1.ApiTags)('journal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('journal'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [journal_service_1.JournalService])
], JournalController);
//# sourceMappingURL=journal.controller.js.map