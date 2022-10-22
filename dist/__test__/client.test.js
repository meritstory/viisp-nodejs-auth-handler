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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../client");
const sinon_1 = __importDefault(require("sinon"));
const utils_1 = require("../utils");
const soapStub = require('soap/soap-stub');
const urlMyApplicationWillUseWithCreateClient = 'http://path-to-my-wsdl';
const clientStub = {
    ExternalAuthenticationServiceImplService: {
        ExternalAuthenticationServiceImplPort: {
            initAuthentication: sinon_1.default.stub(),
            getAuthenticationData: sinon_1.default.stub(),
        },
    },
};
const identityData = {
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
const validatedIdentityResponse = utils_1.getValidatedIdentity(identityData);
const ticketData = { ticket: '1234' };
clientStub.ExternalAuthenticationServiceImplService.ExternalAuthenticationServiceImplPort
    .initAuthentication.respondWithSuccess = soapStub.createRespondingStub(ticketData);
clientStub.ExternalAuthenticationServiceImplService.ExternalAuthenticationServiceImplPort
    .getAuthenticationData.respondWithSuccess = soapStub.createRespondingStub(identityData);
soapStub.registerClient('my client alias', urlMyApplicationWillUseWithCreateClient, clientStub);
describe('VIISP auth', () => {
    let clientStub;
    let instance;
    beforeEach(() => {
        clientStub = soapStub.getStub('my client alias');
        soapStub.reset();
        instance = new client_1.ViispAuthClient(clientStub);
    });
    describe('client', function () {
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            clientStub.ExternalAuthenticationServiceImplService.ExternalAuthenticationServiceImplPort.initAuthentication.respondWithSuccess();
            clientStub.ExternalAuthenticationServiceImplService.ExternalAuthenticationServiceImplPort.getAuthenticationData.respondWithSuccess();
        }));
        it('should get a ticket', () => __awaiter(this, void 0, void 0, function* () {
            const ticket = yield instance.getTicket();
            expect(ticket).toBe(ticketData.ticket);
        }));
        it('should init instance and then do remote calls with provided certs', () => __awaiter(this, void 0, void 0, function* () {
            yield client_1.ViispAuthClient.storeCertificates();
            expect(client_1.ViispAuthClient.soapClientCert).toBeDefined();
            expect(client_1.ViispAuthClient.soapClientCertKey).toBeDefined();
        }));
        it('should get an identity', () => __awaiter(this, void 0, void 0, function* () {
            const ticket = yield instance.getTicket();
            const identity = yield instance.getIdentity(ticket);
            expect(identity.toString()).toBe(validatedIdentityResponse.toString());
        }));
    });
});
//# sourceMappingURL=client.test.js.map