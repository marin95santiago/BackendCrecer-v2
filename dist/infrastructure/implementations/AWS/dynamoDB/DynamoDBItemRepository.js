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
exports.DynamoDBItemRepository = void 0;
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
dotenv.config({
    path: path_1.default.resolve(__dirname, '../../../../../.env')
});
const ENVIRONMENT = process.env.ENVIRONMENT || '';
const PROJECT = process.env.PROJECT || '';
class DynamoDBItemRepository {
    constructor() {
        this.client = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-1' });
        this._environment = ENVIRONMENT;
        this._project = PROJECT;
        this._table = 'Items';
    }
    save(item) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                Item: (0, util_dynamodb_1.marshall)({
                    entityId: (_a = item.entityId) !== null && _a !== void 0 ? _a : '',
                    code: (_b = item.code) !== null && _b !== void 0 ? _b : '',
                    description: (_c = item.description) !== null && _c !== void 0 ? _c : '',
                    price: (_d = item.price) !== null && _d !== void 0 ? _d : null,
                    unitMeasure: (_e = item.unitMeasure) !== null && _e !== void 0 ? _e : null
                })
            };
            yield this.client.send(new client_dynamodb_1.PutItemCommand(params));
            return item;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`
            };
            const response = yield this.client.send(new client_dynamodb_1.ScanCommand(params));
            const itemsDB = (response.Items !== undefined) ? response.Items : [];
            const items = itemsDB.map((item) => {
                var _a, _b, _c, _d, _e, _f;
                return {
                    entityId: (_a = item.entityId.S) !== null && _a !== void 0 ? _a : '',
                    code: (_b = item.code.S) !== null && _b !== void 0 ? _b : '',
                    description: (_c = item.description.S) !== null && _c !== void 0 ? _c : '',
                    price: (_d = Number(item.price.N)) !== null && _d !== void 0 ? _d : undefined,
                    unitMeasure: item.unitMeasure.M !== undefined
                        ?
                            {
                                code: (_e = Number(item.unitMeasure.M.code.N)) !== null && _e !== void 0 ? _e : 0,
                                description: (_f = item.unitMeasure.M.description.S) !== null && _f !== void 0 ? _f : ''
                            }
                        : undefined
                };
            });
            return items;
        });
    }
    getByCode(code, entityId) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                Key: (0, util_dynamodb_1.marshall)({
                    code,
                    entityId
                })
            };
            const response = yield this.client.send(new client_dynamodb_1.GetItemCommand(params));
            const itemDB = (response.Item !== undefined) ? response.Item : null;
            if (itemDB === null)
                return null;
            const item = {
                entityId: (_a = itemDB.entityId.S) !== null && _a !== void 0 ? _a : '',
                code: (_b = itemDB.code.S) !== null && _b !== void 0 ? _b : '',
                description: (_c = itemDB.code.S) !== null && _c !== void 0 ? _c : '',
                price: (_d = Number(itemDB.price.N)) !== null && _d !== void 0 ? _d : undefined,
                unitMeasure: itemDB.unitMeasure.M !== undefined
                    ?
                        {
                            code: (_e = Number(itemDB.unitMeasure.M.code.N)) !== null && _e !== void 0 ? _e : 0,
                            description: (_f = itemDB.unitMeasure.M.description.S) !== null && _f !== void 0 ? _f : ''
                        }
                    : undefined
            };
            return item;
        });
    }
}
exports.DynamoDBItemRepository = DynamoDBItemRepository;
