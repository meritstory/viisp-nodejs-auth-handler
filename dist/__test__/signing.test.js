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
const fs_1 = __importDefault(require("fs"));
const signing_1 = require("../signing");
const ticket_1 = require("../templates/ticket");
const identity_1 = require("../templates/identity");
describe('VIISP xml signing', () => {
    const options = {
        uniqueId: 'uniqueNodeId',
        pid: 'VSID000000000113',
        postbackUrl: 'http://localhost/test',
        correlationData: 'somedata',
    };
    let xml = null;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        xml = ticket_1.ticketTemplate(options);
    }));
    afterEach(() => {
        xml = null;
    });
    it('should successfully sign with default key & cert', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield signing_1.sign(xml, 'authenticationRequest');
        const validated = yield signing_1.validate(result);
        expect(validated).toBeTruthy();
    }));
    it('should successfully sign with default key & cert authenticationDataRequest', () => __awaiter(void 0, void 0, void 0, function* () {
        xml = identity_1.identityTemplate(Object.assign(Object.assign({}, options), { ticket: '1234' }));
        const result = yield signing_1.sign(xml, 'authenticationDataRequest');
        const validated = yield signing_1.validate(result);
        expect(validated).toBeTruthy();
    }));
    it('should successfully sign with provided key & cert', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield signing_1.sign(xml, 'authenticationRequest', fs_1.default.readFileSync(path_1.default.join(__dirname, '../certs/testKey.pem')));
        const validated = yield signing_1.validate(result, fs_1.default.readFileSync(path_1.default.join(__dirname, '../certs/testCert.pem')));
        expect(validated).toBeTruthy();
    }));
    it('should successfully sign with provided key & cert authenticationDataRequest', () => __awaiter(void 0, void 0, void 0, function* () {
        xml = identity_1.identityTemplate(Object.assign(Object.assign({}, options), { ticket: '1234' }));
        const result = yield signing_1.sign(xml, 'authenticationDataRequest', fs_1.default.readFileSync(path_1.default.join(__dirname, '../certs/testKey.pem')));
        const validated = yield signing_1.validate(result, fs_1.default.readFileSync(path_1.default.join(__dirname, '../certs/testCert.pem')));
        expect(validated).toBeTruthy();
    }));
    it('should fail sign with incorrect keys or cert', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield signing_1.sign(xml, 'authenticationRequest', fs_1.default.readFileSync(path_1.default.join(__dirname, '../certs/testKey.pem')));
        try {
            yield signing_1.validate(result, fs_1.default.readFileSync(path_1.default.join(__dirname, '../certs/testKey.pem')));
        }
        catch (e) {
            expect(e).toBeTruthy();
        }
    }));
});
//# sourceMappingURL=signing.test.js.map