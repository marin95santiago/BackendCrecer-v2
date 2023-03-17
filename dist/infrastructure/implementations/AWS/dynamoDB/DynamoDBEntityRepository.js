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
exports.DynamoDBEntityRepository = void 0;
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
dotenv.config({
    path: path_1.default.resolve(__dirname, '../../../../../.env')
});
class DynamoDBEntityRepository {
    constructor() {
        this.client = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-1' });
        this._environment = process.env.ENVIRONMENT || '';
        this._project = process.env.PROJECT || '';
        this._table = 'Entities';
        /*
        async delete(id: string): Promise<void> {
          const params = {
            TableName: `${this._project}-${this._environment}-Users`,
            Key: marshall({
              id
            })
          }
          await this.client.send(new DeleteItemCommand(params))
        }
        */
    }
    save(entity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                Item: (0, util_dynamodb_1.marshall)({
                    id: (_a = entity.id) !== null && _a !== void 0 ? _a : '',
                    name: (_b = entity.name) !== null && _b !== void 0 ? _b : '',
                    entityTypeCode: (_c = entity.entityTypeCode) !== null && _c !== void 0 ? _c : '',
                    document: (_d = entity.document) !== null && _d !== void 0 ? _d : '',
                    signatories: (_e = entity.signatories) !== null && _e !== void 0 ? _e : null,
                    address: (_f = entity.address) !== null && _f !== void 0 ? _f : null,
                    email: (_g = entity.email) !== null && _g !== void 0 ? _g : '',
                    phone: (_h = entity.phone) !== null && _h !== void 0 ? _h : null,
                    apiKeyPlemsi: (_j = entity.apiKeyPlemsi) !== null && _j !== void 0 ? _j : null,
                    state: (_k = entity.state) !== null && _k !== void 0 ? _k : '',
                    resolution: (_l = entity.resolution) !== null && _l !== void 0 ? _l : null,
                    resolutionText: (_m = entity.resolutionText) !== null && _m !== void 0 ? _m : null,
                    lastElectronicBillNumber: (_o = entity.lastElectronicBillNumber) !== null && _o !== void 0 ? _o : null
                })
            };
            yield this.client.send(new client_dynamodb_1.PutItemCommand(params));
            return entity;
        });
    }
    /*
    async getAll(): Promise<Entity[]> {
      const params = {
        TableName: `${this._project}-${this._environment}-Users`
      }
      const response = await this.client.send(new ScanCommand(params))
  
      const items = (response.Items !== undefined) ? response.Items : []
  
      const users = items.map((item: any) => {
        return {
          id: item.id.S ?? '',
          email: item.email.S ?? '',
          name: item.name.S ?? '',
          lastname: item.lastname.S ?? '',
          entityId: item.entityId.S ?? '',
          state: item.state.S ?? '',
          permissions: item.permissions.L !== undefined
            ? item.permissions.L.map((permission: { S: string | undefined }) => {
              if (permission.S !== undefined) {
                return permission.S
              } else {
                return ''
              }
            })
            : ['']
        }
      })
  
      return users
    }
    */
    getById(id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                Key: (0, util_dynamodb_1.marshall)({
                    id
                })
            };
            const response = yield this.client.send(new client_dynamodb_1.GetItemCommand(params));
            const item = (response.Item !== undefined) ? response.Item : null;
            if (item === null)
                return null;
            const entity = {
                id: (_a = item.id.S) !== null && _a !== void 0 ? _a : '',
                name: (_b = item.name.S) !== null && _b !== void 0 ? _b : '',
                entityTypeCode: (_c = item.entityTypeCode.S) !== null && _c !== void 0 ? _c : '',
                document: (_d = item.document.S) !== null && _d !== void 0 ? _d : '',
                address: item.address.M !== undefined
                    ?
                        {
                            street: (_e = item.address.M.street.S) !== null && _e !== void 0 ? _e : '',
                            number: (_f = item.address.M.number.S) !== null && _f !== void 0 ? _f : '',
                            province: item.address.M.province.M !== undefined
                                ?
                                    {
                                        code: (_g = item.address.M.province.M.code.S) !== null && _g !== void 0 ? _g : '',
                                        description: (_h = item.address.M.province.M.description.S) !== null && _h !== void 0 ? _h : ''
                                    }
                                : { code: '', description: '' },
                            country: item.address.M.country.M !== undefined
                                ?
                                    {
                                        code: (_j = item.address.M.country.M.code.S) !== null && _j !== void 0 ? _j : '',
                                        description: (_k = item.address.M.country.M.description.S) !== null && _k !== void 0 ? _k : ''
                                    }
                                : { code: '', description: '' },
                        }
                    : undefined,
                email: (_l = item.email.S) !== null && _l !== void 0 ? _l : '',
                phone: (_m = item.phone.S) !== null && _m !== void 0 ? _m : '',
                apiKeyPlemsi: (_o = item.apiKeyPlemsi.S) !== null && _o !== void 0 ? _o : undefined,
                state: (_p = item.state.S) !== null && _p !== void 0 ? _p : '',
                signatories: item.signatories.L !== undefined
                    ? item.signatories.L.map(signatory => {
                        var _a, _b, _c, _d;
                        if (signatory.M !== undefined) {
                            return {
                                name: (_a = signatory.M.name.S) !== null && _a !== void 0 ? _a : '',
                                lastname: (_b = signatory.M.lastname.S) !== null && _b !== void 0 ? _b : '',
                                document: (_c = signatory.M.document.S) !== null && _c !== void 0 ? _c : '',
                                documentType: (_d = signatory.M.documentType.S) !== null && _d !== void 0 ? _d : ''
                            };
                        }
                        else {
                            return {
                                name: '',
                                lastname: '',
                                document: '',
                                documentType: ''
                            };
                        }
                    })
                    : undefined,
                resolution: (_q = item.resolution.S) !== null && _q !== void 0 ? _q : undefined,
                resolutionText: (_r = item.resolutionText.S) !== null && _r !== void 0 ? _r : undefined,
                lastElectronicBillNumber: (_s = Number(item.lastElectronicBillNumber.N)) !== null && _s !== void 0 ? _s : undefined
            };
            return entity;
        });
    }
    getByDocument(document) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                FilterExpression: 'document = :document',
                ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                    ':document': document
                }, {
                    removeUndefinedValues: true
                })
            };
            const response = yield this.client.send(new client_dynamodb_1.ScanCommand(params));
            const item = (response.Items !== undefined && response.Items.length > 0) ? response.Items[0] : null;
            if (item === null)
                return null;
            const entity = {
                id: (_a = item.id.S) !== null && _a !== void 0 ? _a : '',
                name: (_b = item.name.S) !== null && _b !== void 0 ? _b : '',
                entityTypeCode: (_c = item.entityTypeCode.S) !== null && _c !== void 0 ? _c : '',
                document: (_d = item.document.S) !== null && _d !== void 0 ? _d : '',
                address: item.address.M !== undefined
                    ?
                        {
                            street: (_e = item.address.M.street.S) !== null && _e !== void 0 ? _e : '',
                            number: (_f = item.address.M.number.S) !== null && _f !== void 0 ? _f : '',
                            province: item.address.M.province.M !== undefined
                                ?
                                    {
                                        code: (_g = item.address.M.province.M.code.S) !== null && _g !== void 0 ? _g : '',
                                        description: (_h = item.address.M.province.M.description.S) !== null && _h !== void 0 ? _h : ''
                                    }
                                : { code: '', description: '' },
                            country: item.address.M.country.M !== undefined
                                ?
                                    {
                                        code: (_j = item.address.M.country.M.code.S) !== null && _j !== void 0 ? _j : '',
                                        description: (_k = item.address.M.country.M.description.S) !== null && _k !== void 0 ? _k : ''
                                    }
                                : { code: '', description: '' },
                        }
                    : undefined,
                email: (_l = item.email.S) !== null && _l !== void 0 ? _l : '',
                phone: (_m = item.phone.S) !== null && _m !== void 0 ? _m : '',
                apiKeyPlemsi: (_o = item.apiKeyPlemsi.S) !== null && _o !== void 0 ? _o : undefined,
                state: (_p = item.state.S) !== null && _p !== void 0 ? _p : '',
                signatories: item.signatories.L !== undefined
                    ? item.signatories.L.map(signatory => {
                        var _a, _b, _c, _d;
                        if (signatory.M !== undefined) {
                            return {
                                name: (_a = signatory.M.name.S) !== null && _a !== void 0 ? _a : '',
                                lastname: (_b = signatory.M.lastname.S) !== null && _b !== void 0 ? _b : '',
                                document: (_c = signatory.M.document.S) !== null && _c !== void 0 ? _c : '',
                                documentType: (_d = signatory.M.documentType.S) !== null && _d !== void 0 ? _d : ''
                            };
                        }
                        else {
                            return {
                                name: '',
                                lastname: '',
                                document: '',
                                documentType: ''
                            };
                        }
                    })
                    : undefined,
                resolution: (_q = item.resolution.S) !== null && _q !== void 0 ? _q : undefined,
                resolutionText: (_r = item.resolutionText.S) !== null && _r !== void 0 ? _r : undefined,
                lastElectronicBillNumber: (_s = Number(item.lastElectronicBillNumber.N)) !== null && _s !== void 0 ? _s : undefined
            };
            return entity;
        });
    }
    update(entity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                Item: (0, util_dynamodb_1.marshall)({
                    id: (_a = entity.id) !== null && _a !== void 0 ? _a : '',
                    name: (_b = entity.name) !== null && _b !== void 0 ? _b : '',
                    entityTypeCode: (_c = entity.entityTypeCode) !== null && _c !== void 0 ? _c : '',
                    document: (_d = entity.document) !== null && _d !== void 0 ? _d : '',
                    signatories: (_e = entity.signatories) !== null && _e !== void 0 ? _e : null,
                    address: (_f = entity.address) !== null && _f !== void 0 ? _f : null,
                    email: (_g = entity.email) !== null && _g !== void 0 ? _g : '',
                    phone: (_h = entity.phone) !== null && _h !== void 0 ? _h : null,
                    apiKeyPlemsi: (_j = entity.apiKeyPlemsi) !== null && _j !== void 0 ? _j : null,
                    state: (_k = entity.state) !== null && _k !== void 0 ? _k : '',
                    resolution: (_l = entity.resolution) !== null && _l !== void 0 ? _l : null,
                    resolutionText: (_m = entity.resolutionText) !== null && _m !== void 0 ? _m : null,
                    lastElectronicBillNumber: (_o = entity.lastElectronicBillNumber) !== null && _o !== void 0 ? _o : null
                })
            };
            yield this.client.send(new client_dynamodb_1.PutItemCommand(params));
            return entity;
        });
    }
}
exports.DynamoDBEntityRepository = DynamoDBEntityRepository;
