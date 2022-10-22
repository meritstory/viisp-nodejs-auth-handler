/// <reference types="node" />
import fs from 'fs';
import { IidentityResponse } from './types';
export declare const readFileAsync: typeof fs.readFile.__promisify__;
export declare const getValidatedIdentity: (identity: any) => IidentityResponse;
