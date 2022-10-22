/// <reference types="node" />
export declare const sign: (xml: string, nodeName: "authenticationRequest" | "authenticationDataRequest", cert?: Buffer) => Promise<string>;
export declare const validate: (xml: string, cert?: Buffer) => Promise<boolean>;
