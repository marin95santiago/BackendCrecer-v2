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
exports.DynamoDBElectronicBillRepository = void 0;
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
dotenv.config({
    path: path_1.default.resolve(__dirname, '../../../../../.env')
});
class DynamoDBElectronicBillRepository {
    constructor() {
        this.client = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-1' });
        this._environment = process.env.ENVIRONMENT || '';
        this._project = process.env.PROJECT || '';
        this._table = 'ElectronicBills';
    }
    save(bill) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                Item: (0, util_dynamodb_1.marshall)({
                    entityId: (_a = bill.entityId) !== null && _a !== void 0 ? _a : '',
                    userId: (_b = bill.userId) !== null && _b !== void 0 ? _b : '',
                    number: (_c = Number(bill.number)) !== null && _c !== void 0 ? _c : 0,
                    date: (_d = bill.date) !== null && _d !== void 0 ? _d : '',
                    orderReference: (_e = bill.orderReference) !== null && _e !== void 0 ? _e : undefined,
                    third: (_f = bill.third) !== null && _f !== void 0 ? _f : undefined,
                    wayToPay: (_g = bill.wayToPay) !== null && _g !== void 0 ? _g : undefined,
                    items: (_h = bill.items) !== null && _h !== void 0 ? _h : undefined,
                    note: (_j = bill.note) !== null && _j !== void 0 ? _j : '',
                    allTaxTotals: (_k = bill.taxes) !== null && _k !== void 0 ? _k : undefined,
                    total: (_l = bill.total) !== null && _l !== void 0 ? _l : 0,
                    totalTaxes: (_m = bill.totalTaxes) !== null && _m !== void 0 ? _m : 0,
                    totalToPay: (_o = bill.totalToPay) !== null && _o !== void 0 ? _o : 0
                })
            };
            yield this.client.send(new client_dynamodb_1.PutItemCommand(params));
            return bill;
        });
    }
}
exports.DynamoDBElectronicBillRepository = DynamoDBElectronicBillRepository;
