import { SafetyService } from './safety.service';
export declare class SafetyController {
    private safetyService;
    constructor(safetyService: SafetyService);
    getResources(): {
        label: string;
        description: string;
    }[];
}
