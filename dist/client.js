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
const path_1 = __importDefault(require("path"));
const soap_1 = require("soap");
const signing_1 = require("./signing");
const utils_1 = require("./utils");
const ticket_1 = require("./templates/ticket");
const identity_1 = require("./templates/identity");
class ViispAuthClient {
    constructor(client) {
        this.clientInfo = () => {
            return this.soapClient.describe();
        };
        this.getTicket = (postbackUrl, correlationData) => __awaiter(this, void 0, void 0, function* () {
            const req = ticket_1.ticketTemplate({
                uniqueId: ViispAuthClient.options.uniqueNodeId,
                pid: ViispAuthClient.options.pid,
                postbackUrl: postbackUrl || ViispAuthClient.options.postbackUrl,
                correlationData: correlationData || ViispAuthClient.options.correlationData,
            });
            const signedXmlRequest = yield signing_1.sign(req, 'authenticationRequest', ViispAuthClient.soapClientCertKey);
            return new Promise((resolve, reject) => {
                this.soapClient.ExternalAuthenticationServiceImplService.ExternalAuthenticationServiceImplPort.initAuthentication({
                    _xml: signedXmlRequest,
                }, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result.ticket);
                });
            });
        });
        this.getIdentity = (ticket) => __awaiter(this, void 0, void 0, function* () {
            const req = identity_1.identityTemplate({
                uniqueId: ViispAuthClient.options.uniqueNodeId,
                pid: ViispAuthClient.options.pid,
                ticket,
            });
            const signedXmlRequest = yield signing_1.sign(req, 'authenticationDataRequest', ViispAuthClient.soapClientCertKey);
            return new Promise((resolve, reject) => {
                this.soapClient.ExternalAuthenticationServiceImplService.ExternalAuthenticationServiceImplPort.getAuthenticationData({
                    _xml: signedXmlRequest,
                }, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(utils_1.getValidatedIdentity(result));
                });
            });
        });
        if (typeof client === 'undefined') {
            throw new Error('Cannot be initialized directly');
        }
        this.soapClient = client;
    }
    static init(authOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            this.options = Object.assign(Object.assign({}, this.options), authOptions);
            let client;
            try {
                yield this.storeCertificates();
                client = yield soap_1.createClientAsync(this.options.wsdlUrl);
                client.setEndpoint(this.options.wsdlUrl);
            }
            catch (error) {
                throw new Error('Unable to initialize soap client');
            }
            return new ViispAuthClient(client);
        });
    }
    static storeCertificates() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.soapClientCertKey = yield utils_1.readFileAsync(ViispAuthClient.options.cert.key);
                this.soapClientCert = yield utils_1.readFileAsync(ViispAuthClient.options.cert.key);
            }
            catch (e) {
                throw new Error(`Unable to store certificate and key ${e}`);
            }
        });
    }
}
exports.ViispAuthClient = ViispAuthClient;
ViispAuthClient.options = {
    uniqueNodeId: 'uniqueId',
    pid: 'VSID000000000113',
    wsdlUrl: 'https://www.epaslaugos.lt/portal-test/services/AuthenticationServiceProxy?wsdl',
    postbackUrl: 'http://localhost',
    correlationData: '',
    cert: {
        key: path_1.default.join(__dirname, '/certs/testKey.pem'),
        cert: path_1.default.join(__dirname, '/certs/testCert.pem'),
    },
};
//# sourceMappingURL=client.js.map