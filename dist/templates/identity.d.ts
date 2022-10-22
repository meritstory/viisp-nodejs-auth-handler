export interface IdentityTemplateProps {
    uniqueId: string;
    pid: string;
    ticket: string;
}
export declare const identityTemplate: ({ uniqueId, pid, ticket }: IdentityTemplateProps) => string;
