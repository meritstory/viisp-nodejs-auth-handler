"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const identityResponse = {
    attributes: {
        id: 'uniqueId',
    },
    authenticationAttribute: [
        {
            attribute: 'lt-personal-code',
            value: '51001091072',
        },
    ],
    authenticationProvider: 'auth.signatureProvider',
    sourceData: {
        parameter: [
            {
                $value: 'EE',
                attributes: {
                    name: 'C',
                },
            },
            {
                $value: 'OjpkGwvfJWGtkaBS_0tc69R9IwbNxpN86fGy_zaeVqNtz1mSBuEGj6yn-1wDWMoZCiYaUr9ThkRp9PVkKqAaSo-yXNKYfIToRrhwlugvNUWIcpH94cTxf70wQFnWDlfPZFb0-z8ESI0STcebfsUZFQfQE9PDmJMlc7Wjzy1ZmvI',
                attributes: {
                    name: 'data',
                },
            },
            {
                $value: 'TEST of EID-SK 2011',
                attributes: {
                    name: 'CN',
                },
            },
            {
                $value: 'pki@sk.ee',
                attributes: {
                    name: 'OID.1.2.840.113549.1.9.1',
                },
            },
            {
                $value: 'AS Sertifitseerimiskeskus',
                attributes: {
                    name: 'O',
                },
            },
        ],
        type: 'BANKLINK',
    },
    userInformation: [
        {
            information: 'firstName',
            value: {
                stringValue: 'Testas',
            },
        },
        {
            information: 'lastName',
            value: {
                stringValue: 'Testas',
            },
        },
        {
            information: 'companyName',
            value: null,
        },
    ],
};
describe('VIISP Auth Response validation', () => {
    it('should return valid identity', () => __awaiter(void 0, void 0, void 0, function* () {
        const identity = utils_1.getValidatedIdentity(identityResponse);
        expect(identity.firstName).toBe('Testas');
        expect(identity.lastName).toBe('Testas');
        expect(identity.birthdate).toBe('2010-01-09');
        expect(identity.sex).toBe('male');
        expect(identity.companyName).toBeUndefined();
    }));
    it('should return valid identity with some extra data in response', () => __awaiter(void 0, void 0, void 0, function* () {
        const diffResponse = Object.assign(Object.assign({}, identityResponse), {
            authenticationAttribute: [
                ...identityResponse.authenticationAttribute,
                ...[
                    {
                        attribute: 'lt-company-code',
                        value: '111111111',
                    },
                    {
                        attribute: 'lt-employee-code',
                        value: '23131',
                    },
                ],
            ],
            userInformation: [
                ...identityResponse.userInformation,
                ...[
                    {
                        information: 'companyName',
                        value: {
                            stringValue: 'company-name',
                        },
                    },
                ],
            ],
        });
        const identity = utils_1.getValidatedIdentity(diffResponse);
        expect(identity.firstName).toBe('Testas');
        expect(identity.lastName).toBe('Testas');
        expect(identity.birthdate).toBe('2010-01-09');
        expect(identity.sex).toBe('male');
        expect(identity.companyName).toBe('company-name');
    }));
    it('should return valid birthdate and sex value for XX century male', () => __awaiter(void 0, void 0, void 0, function* () {
        const diffResponse = Object.assign(Object.assign({}, identityResponse), {
            authenticationAttribute: [
                ...identityResponse.authenticationAttribute,
                ...[
                    {
                        attribute: 'lt-personal-code',
                        value: '31007190021',
                    },
                ],
            ],
        });
        const identity = utils_1.getValidatedIdentity(diffResponse);
        expect(identity.firstName).toBe('Testas');
        expect(identity.lastName).toBe('Testas');
        expect(identity.birthdate).toBe('1910-07-19');
        expect(identity.sex).toBe('male');
    }));
    it('should return valid birthdate and sex value for XX century female', () => __awaiter(void 0, void 0, void 0, function* () {
        const diffResponse = Object.assign(Object.assign({}, identityResponse), {
            authenticationAttribute: [
                ...identityResponse.authenticationAttribute,
                ...[
                    {
                        attribute: 'lt-personal-code',
                        value: '42307190066',
                    },
                ],
            ],
        });
        const identity = utils_1.getValidatedIdentity(diffResponse);
        expect(identity.firstName).toBe('Testas');
        expect(identity.lastName).toBe('Testas');
        expect(identity.birthdate).toBe('1923-07-19');
        expect(identity.sex).toBe('female');
    }));
    it('should return valid birthdate and sex value for XXI century female', () => __awaiter(void 0, void 0, void 0, function* () {
        const diffResponse = Object.assign(Object.assign({}, identityResponse), {
            authenticationAttribute: [
                ...identityResponse.authenticationAttribute,
                ...[
                    {
                        attribute: 'lt-personal-code',
                        value: '61207190052',
                    },
                ],
            ],
        });
        const identity = utils_1.getValidatedIdentity(diffResponse);
        expect(identity.firstName).toBe('Testas');
        expect(identity.lastName).toBe('Testas');
        expect(identity.birthdate).toBe('2012-07-19');
        expect(identity.sex).toBe('female');
    }));
    it('should return null as userInformation not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidResponse = Object.assign(Object.assign({}, identityResponse), { userInformation: [] });
        const identity = utils_1.getValidatedIdentity(invalidResponse);
        expect(identity).toBe(null);
    }));
    it('should return null as authAttributes not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidResponse = Object.assign(Object.assign({}, identityResponse), { authenticationAttribute: [] });
        const identity = utils_1.getValidatedIdentity(invalidResponse);
        expect(identity).toBe(null);
    }));
});
//# sourceMappingURL=utils.test.js.map