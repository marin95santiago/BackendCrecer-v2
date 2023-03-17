"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.DynamoDBThirdRepository = void 0;
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
dotenv.config({
    path: path_1.default.resolve(__dirname, '../../../../../.env')
});
const ENVIRONMENT = process.env.ENVIRONMENT || '';
const PROJECT = process.env.PROJECT || '';
class DynamoDBThirdRepository {
    constructor() {
        this.client = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-1' });
        this._environment = ENVIRONMENT;
        this._project = PROJECT;
        this._table = 'Thirds';
    }
    save(third) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                Item: (0, util_dynamodb_1.marshall)({
                    entityId: (_a = third.entityId) !== null && _a !== void 0 ? _a : '',
                    document: (_b = third.document) !== null && _b !== void 0 ? _b : '',
                    dv: (_c = third.dv) !== null && _c !== void 0 ? _c : null,
                    documentType: (_d = third.documentType) !== null && _d !== void 0 ? _d : null,
                    organizationType: (_e = third.organizationType) !== null && _e !== void 0 ? _e : null,
                    liabilityType: (_f = third.liabilityType) !== null && _f !== void 0 ? _f : null,
                    regimeType: (_g = third.regimeType) !== null && _g !== void 0 ? _g : null,
                    name: (_h = third.name) !== null && _h !== void 0 ? _h : null,
                    lastname: (_j = third.lastname) !== null && _j !== void 0 ? _j : null,
                    businessName: (_k = third.businessName) !== null && _k !== void 0 ? _k : null,
                    phone: (_l = third.phone) !== null && _l !== void 0 ? _l : null,
                    address: (_m = third.address) !== null && _m !== void 0 ? _m : null,
                    email: (_o = third.email) !== null && _o !== void 0 ? _o : null
                })
            };
            yield this.client.send(new client_dynamodb_1.PutItemCommand(params));
            return third;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`
            };
            const response = yield this.client.send(new client_dynamodb_1.ScanCommand(params));
            const items = (response.Items !== undefined) ? response.Items : [];
            const third = items.map((item) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
                return {
                    entityId: (_a = item.entityId.S) !== null && _a !== void 0 ? _a : '',
                    document: (_b = item.document.S) !== null && _b !== void 0 ? _b : '',
                    dv: (_c = item.dv.S) !== null && _c !== void 0 ? _c : undefined,
                    documentType: item.documentType.M !== undefined
                        ?
                            {
                                code: (_d = item.documentType.M.code.S) !== null && _d !== void 0 ? _d : '',
                                description: (_e = item.documentType.M.description.S) !== null && _e !== void 0 ? _e : ''
                            }
                        : { code: '', description: '' },
                    organizationType: item.organizationType.M !== undefined
                        ?
                            {
                                code: (_f = item.organizationType.M.code.S) !== null && _f !== void 0 ? _f : '',
                                description: (_g = item.organizationType.M.description.S) !== null && _g !== void 0 ? _g : ''
                            }
                        : { code: '', description: '' },
                    liabilityType: item.liabilityType.M !== undefined
                        ?
                            {
                                code: (_h = item.liabilityType.M.code.S) !== null && _h !== void 0 ? _h : '',
                                description: (_j = item.liabilityType.M.description.S) !== null && _j !== void 0 ? _j : ''
                            }
                        : { code: '', description: '' },
                    regimeType: item.regimeType.M !== undefined
                        ?
                            {
                                code: (_k = item.regimeType.M.code.S) !== null && _k !== void 0 ? _k : '',
                                description: (_l = item.regimeType.M.description.S) !== null && _l !== void 0 ? _l : ''
                            }
                        : { code: '', description: '' },
                    name: (_m = item.name.S) !== null && _m !== void 0 ? _m : undefined,
                    lastname: (_o = item.lastname.S) !== null && _o !== void 0 ? _o : undefined,
                    businessName: (_p = item.businessName.S) !== null && _p !== void 0 ? _p : undefined,
                    phone: (_q = item.phone.S) !== null && _q !== void 0 ? _q : '',
                    address: (_r = item.address.S) !== null && _r !== void 0 ? _r : '',
                    email: (_s = item.email.S) !== null && _s !== void 0 ? _s : ''
                };
            });
            return third;
        });
    }
    getByDocument(document, entityId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                Key: (0, util_dynamodb_1.marshall)({
                    document,
                    entityId
                })
            };
            const response = yield this.client.send(new client_dynamodb_1.GetItemCommand(params));
            const item = (response.Item !== undefined) ? response.Item : null;
            if (item === null)
                return null;
            const third = {
                entityId: (_a = item.entityId.S) !== null && _a !== void 0 ? _a : '',
                document: (_b = item.document.S) !== null && _b !== void 0 ? _b : '',
                dv: (_c = item.dv.S) !== null && _c !== void 0 ? _c : undefined,
                documentType: item.documentType.M !== undefined
                    ?
                        {
                            code: (_d = item.documentType.M.code.S) !== null && _d !== void 0 ? _d : '',
                            description: (_e = item.documentType.M.description.S) !== null && _e !== void 0 ? _e : ''
                        }
                    : { code: '', description: '' },
                organizationType: item.organizationType.M !== undefined
                    ?
                        {
                            code: (_f = item.organizationType.M.code.S) !== null && _f !== void 0 ? _f : '',
                            description: (_g = item.organizationType.M.description.S) !== null && _g !== void 0 ? _g : ''
                        }
                    : { code: '', description: '' },
                liabilityType: item.liabilityType.M !== undefined
                    ?
                        {
                            code: (_h = item.liabilityType.M.code.S) !== null && _h !== void 0 ? _h : '',
                            description: (_j = item.liabilityType.M.description.S) !== null && _j !== void 0 ? _j : ''
                        }
                    : { code: '', description: '' },
                regimeType: item.regimeType.M !== undefined
                    ?
                        {
                            code: (_k = item.regimeType.M.code.S) !== null && _k !== void 0 ? _k : '',
                            description: (_l = item.regimeType.M.description.S) !== null && _l !== void 0 ? _l : ''
                        }
                    : { code: '', description: '' },
                name: (_m = item.name.S) !== null && _m !== void 0 ? _m : undefined,
                lastname: (_o = item.lastname.S) !== null && _o !== void 0 ? _o : undefined,
                businessName: (_p = item.businessName.S) !== null && _p !== void 0 ? _p : undefined,
                phone: (_q = item.phone.S) !== null && _q !== void 0 ? _q : '',
                address: (_r = item.address.S) !== null && _r !== void 0 ? _r : '',
                email: (_s = item.email.S) !== null && _s !== void 0 ? _s : ''
            };
            return third;
        });
    }
}
exports.DynamoDBThirdRepository = DynamoDBThirdRepository;
