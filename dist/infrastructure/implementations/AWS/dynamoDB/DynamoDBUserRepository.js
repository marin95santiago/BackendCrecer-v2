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
exports.DynamoDBUserRepository = void 0;
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
dotenv.config({
    path: path_1.default.resolve(__dirname, '../../../../../.env')
});
const ENVIRONMENT = process.env.ENVIRONMENT || '';
const PROJECT = process.env.PROJECT || '';
class DynamoDBUserRepository {
    constructor() {
        this.client = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-1' });
        this._environment = ENVIRONMENT;
        this._project = PROJECT;
        this._table = 'Users';
    }
    save(user) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                Item: (0, util_dynamodb_1.marshall)({
                    id: (_a = user.id) !== null && _a !== void 0 ? _a : '',
                    email: (_b = user.email) !== null && _b !== void 0 ? _b : '',
                    password: (_c = user.password) !== null && _c !== void 0 ? _c : '',
                    name: (_d = user.name) !== null && _d !== void 0 ? _d : '',
                    lastname: (_e = user.lastname) !== null && _e !== void 0 ? _e : '',
                    entityId: (_f = user.entityId) !== null && _f !== void 0 ? _f : '',
                    state: (_g = user.state) !== null && _g !== void 0 ? _g : '',
                    permissions: (_h = user.permissions) !== null && _h !== void 0 ? _h : ['']
                })
            };
            yield this.client.send(new client_dynamodb_1.PutItemCommand(params));
            return user;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`
            };
            const response = yield this.client.send(new client_dynamodb_1.ScanCommand(params));
            const items = (response.Items !== undefined) ? response.Items : [];
            const users = items.map((item) => {
                var _a, _b, _c, _d, _e, _f;
                return {
                    id: (_a = item.id.S) !== null && _a !== void 0 ? _a : '',
                    email: (_b = item.email.S) !== null && _b !== void 0 ? _b : '',
                    name: (_c = item.name.S) !== null && _c !== void 0 ? _c : '',
                    lastname: (_d = item.lastname.S) !== null && _d !== void 0 ? _d : '',
                    entityId: (_e = item.entityId.S) !== null && _e !== void 0 ? _e : '',
                    state: (_f = item.state.S) !== null && _f !== void 0 ? _f : '',
                    permissions: item.permissions.L !== undefined
                        ? item.permissions.L.map((permission) => {
                            if (permission.S !== undefined) {
                                return permission.S;
                            }
                            else {
                                return '';
                            }
                        })
                        : ['']
                };
            });
            return users;
        });
    }
    getById(id) {
        var _a, _b, _c, _d, _e, _f;
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
            const user = {
                id: (_a = item.id.S) !== null && _a !== void 0 ? _a : '',
                email: (_b = item.email.S) !== null && _b !== void 0 ? _b : '',
                name: (_c = item.name.S) !== null && _c !== void 0 ? _c : '',
                lastname: (_d = item.lastname.S) !== null && _d !== void 0 ? _d : '',
                entityId: (_e = item.entityId.S) !== null && _e !== void 0 ? _e : '',
                state: (_f = item.state.S) !== null && _f !== void 0 ? _f : '',
                permissions: item.permissions.L !== undefined
                    ? item.permissions.L.map(permission => {
                        if (permission.S !== undefined) {
                            return permission.S;
                        }
                        else {
                            return '';
                        }
                    })
                    : ['']
            };
            return user;
        });
    }
    getByEmail(email) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                FilterExpression: 'email = :email',
                ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                    ':email': email
                })
            };
            const response = yield this.client.send(new client_dynamodb_1.ScanCommand(params));
            const item = (response.Items !== undefined && response.Items.length > 0) ? response.Items[0] : null;
            if (item === null)
                return null;
            const user = {
                id: (_a = item.id.S) !== null && _a !== void 0 ? _a : '',
                email: (_b = item.email.S) !== null && _b !== void 0 ? _b : '',
                password: (_c = item.password.S) !== null && _c !== void 0 ? _c : '',
                name: (_d = item.name.S) !== null && _d !== void 0 ? _d : '',
                lastname: (_e = item.lastname.S) !== null && _e !== void 0 ? _e : '',
                entityId: (_f = item.entityId.S) !== null && _f !== void 0 ? _f : '',
                state: (_g = item.state.S) !== null && _g !== void 0 ? _g : '',
                permissions: item.permissions.L !== undefined
                    ? item.permissions.L.map(permission => {
                        if (permission.S !== undefined) {
                            return permission.S;
                        }
                        else {
                            return '';
                        }
                    })
                    : ['']
            };
            return user;
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                Item: (0, util_dynamodb_1.marshall)({
                    id: user.id,
                    email: user.email,
                    password: user.password,
                    name: user.name,
                    lastname: user.lastname,
                    entityId: user.entityId,
                    state: user.state,
                    permissions: user.permissions
                }, {
                    removeUndefinedValues: true
                })
            };
            yield this.client.send(new client_dynamodb_1.PutItemCommand(params));
            return user;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: `${this._project}-${this._environment}-${this._table}`,
                Key: (0, util_dynamodb_1.marshall)({
                    id
                })
            };
            yield this.client.send(new client_dynamodb_1.DeleteItemCommand(params));
        });
    }
}
exports.DynamoDBUserRepository = DynamoDBUserRepository;
