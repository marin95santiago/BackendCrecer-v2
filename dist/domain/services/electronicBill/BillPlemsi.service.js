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
exports.BillPlemsiService = void 0;
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const axios_1 = __importStar(require("axios"));
dotenv.config({
    path: path_1.default.resolve(__dirname, '../../../../.env')
});
const URL_PLEMSI = process.env.URL_PLEMSI || '';
class BillPlemsiService {
    run(electronicBill, apiKey) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(URL_PLEMSI, electronicBill, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`
                    }
                });
                return response;
            }
            catch (error) {
                if ((0, axios_1.isAxiosError)(error)) {
                    throw JSON.stringify((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.data);
                }
                else {
                    throw 'Error en el facturador de Plemsi';
                }
            }
        });
    }
}
exports.BillPlemsiService = BillPlemsiService;
