export interface TicketTemplateProps {
    uniqueId: string;
    pid: string;
    postbackUrl: string;
    correlationData: string;
}
export declare const ticketTemplate: ({ uniqueId, pid, postbackUrl, correlationData, }: TicketTemplateProps) => string;
