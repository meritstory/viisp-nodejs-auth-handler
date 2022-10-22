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
const xml_crypto_1 = require("xml-crypto");
const xmldom_1 = require("xmldom");
const xpath_1 = require("xpath");
const utils_1 = require("./utils");
class CustomKeyInfoProvider extends xml_crypto_1.FileKeyInfo {
    constructor(cert) {
        super();
        this.getKey = function () {
            return this.certBuffer;
        };
        this.certBuffer = cert;
    }
}
const getSigningStr = (cert = null) => __awaiter(void 0, void 0, void 0, function* () {
    let signingStr;
    if (!cert) {
        try {
            signingStr = yield utils_1.readFileAsync(`${__dirname}/certs/testKey.pem`);
        }
        catch (error) {
            throw new Error('Unable to read certificate');
        }
    }
    else {
        signingStr = cert;
    }
    return signingStr;
});
const getNodeByExpr = (expression, xml) => {
    const doc = new xmldom_1.DOMParser().parseFromString(xml);
    return xpath_1.select1(`${expression}`, doc);
};
exports.sign = (xml, nodeName, cert = null) => __awaiter(void 0, void 0, void 0, function* () {
    const noNewLinesXml = xml.replace(/(\r\n|\n|\r)/gm, '');
    const expression = `//*[local-name(.)='${nodeName}']`;
    const sig = new xml_crypto_1.SignedXml();
    sig.addReference(expression, [
        'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
        'http://www.w3.org/2001/10/xml-exc-c14n#',
    ], 'http://www.w3.org/2000/09/xmldsig#sha1');
    sig.signingKey = yield getSigningStr(cert);
    sig.computeSignature(noNewLinesXml);
    return sig.getSignedXml();
});
exports.validate = (xml, cert = null) => __awaiter(void 0, void 0, void 0, function* () {
    const expression = `//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']`;
    const signature = getNodeByExpr(expression, xml);
    const sig = new xml_crypto_1.SignedXml();
    if (!cert) {
        sig.keyInfoProvider = new xml_crypto_1.FileKeyInfo(`${__dirname}/certs/testCert.pem`);
    }
    else {
        sig.keyInfoProvider = new CustomKeyInfoProvider(cert);
    }
    sig.loadSignature(signature);
    const res = sig.checkSignature(xml);
    return !!res;
});
//# sourceMappingURL=signing.js.map