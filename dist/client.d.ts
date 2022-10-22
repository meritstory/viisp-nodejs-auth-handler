/// <reference types="node" />
import { Client as SoapClient } from 'soap';
import { IidentityResponse, ViispAuthClientOptions } from './types';
export declare class ViispAuthClient {
    static options: ViispAuthClientOptions;
    static soapClientCert: Buffer;
    static soapClientCertKey: Buffer;
    private soapClient;
    constructor(client?: SoapClient);
    static init(authOptions?: ViispAuthClientOptions): Promise<ViispAuthClient>;
    clientInfo: () => any;
    getTicket: (postbackUrl?: string, correlationData?: string) => Promise<string>;
    getIdentity: (ticket: string) => Promise<IidentityResponse>;
    static storeCertificates(): Promise<void>;
}
