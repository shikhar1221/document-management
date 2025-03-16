export class TriggerIngestionDto {
    readonly source: string;
    readonly parameters?: Record<string, any>;
}