export interface FinancialEntry {
    institutionId: string;
    uuid: string;
    date: number;
    periodStart: number;
    periodoEnd: number;
    subject: string;
    description?: string;
    value: number;
    details?: string;
    isIncome: boolean;
    entryCategory?: string;
    wasDeleted: boolean;
}
