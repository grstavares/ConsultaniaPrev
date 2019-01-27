export interface Retirement {
    institutionId: string;
    uuid: string;
    startDate: number;
    endDate: number;
    contributions: Contribution[];
    withdrawals: Withdrawal[];
    wasDeleted: boolean;
}

export interface Contribution {
    uuid: string;
    source: string;
    reference: number;
    value: number;
    wasDeleted: boolean;
}

export interface Withdrawal {
    uuid: string;
    date: number;
    value: number;
    reference: string;
    wasDeleted: boolean;
}
