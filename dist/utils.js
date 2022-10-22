"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const moment_1 = __importDefault(require("moment"));
exports.readFileAsync = util_1.promisify(fs_1.default.readFile);
const SEX_AND_SENTURY_MAP = {
    3: {
        key: 3,
        sex: 'male',
        century: 'XX',
    },
    4: {
        key: 4,
        sex: 'female',
        century: 'XX',
    },
    5: {
        key: 5,
        sex: 'male',
        century: 'XXI',
    },
    6: {
        key: 6,
        sex: 'female',
        century: 'XXI',
    },
};
const getSexFromId = (personalId) => {
    const sexStr = personalId.substr(0, 1);
    const sexObject = SEX_AND_SENTURY_MAP[sexStr];
    return sexObject.sex;
};
const getDateFromId = (personalId) => {
    const sexStr = personalId.substr(0, 1);
    const sexObject = SEX_AND_SENTURY_MAP[sexStr];
    const dateStr = personalId.substr(1, 7);
    moment_1.default.parseTwoDigitYear = function (year) {
        return sexObject.key < 5 ? parseInt(year, 10) + 1900 : parseInt(year, 10) + 2000;
    };
    return moment_1.default(dateStr, 'YYMMDD').format('YYYY-MM-DD');
};
exports.getValidatedIdentity = (identity) => {
    if (!identity.authenticationAttribute || !identity.userInformation) {
        return null;
    }
    const userInfo = identity.userInformation.reduce((acc, curr) => (Object.assign(Object.assign({}, acc), {
        [curr.information]: curr.value && curr.value.stringValue ? curr.value.stringValue : null,
    })), {});
    const identityData = identity.authenticationAttribute.reduce((acc, curr) => {
        let attribute;
        if (curr.attribute === 'lt-personal-code') {
            attribute = 'personalIdentityCode';
        }
        else if (curr.attribute === 'lt-company-code') {
            attribute = 'companyIdentityCode';
        }
        else if (curr.attribute === 'lt-employee-code') {
            attribute = 'governmentEmployeeCode';
        }
        else {
            attribute = 'unknownPropery';
        }
        return Object.assign(Object.assign({}, acc), {
            [attribute]: curr.value,
        });
    }, {});
    if (!userInfo.firstName || !userInfo.lastName || !identityData.personalIdentityCode) {
        return null;
    }
    const birthdate = getDateFromId(identityData.personalIdentityCode);
    const sex = getSexFromId(identityData.personalIdentityCode);
    if (!birthdate || !getSexFromId) {
        return null;
    }
    let extraData = {
        birthdate,
        sex,
    };
    if (userInfo.companyName) {
        extraData = Object.assign(Object.assign({}, extraData), { companyName: userInfo.companyName });
    }
    return Object.assign({ firstName: userInfo.firstName, lastName: userInfo.lastName, personalIdentityCode: identityData.personalIdentityCode }, extraData);
};
//# sourceMappingURL=utils.js.map