export interface FinancialEntry {
    uuid: string;
    date: number;
    period: [number, number];       // Tuple with Start and End Date of Period of Reference;
    subject: string;
    description?: string;
    value: number;
    details?: string;
    isIncome: boolean;
    entryCategory?: string;
    wasDeleted: boolean;
}
