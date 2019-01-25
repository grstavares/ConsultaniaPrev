export interface Complaint {
    uuid: string;
    title: string;
    lontent: string;
    dateCreation: number;
    dateReception?: number;
    status: string;                 // KnowValues: open, inEvaluation, inProgress, closed
    wasDeleted: boolean;
}
