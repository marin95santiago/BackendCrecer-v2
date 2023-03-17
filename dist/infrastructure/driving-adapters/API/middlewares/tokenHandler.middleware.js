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
exports.validateToken = void 0;
const Unhandled_exception_1 = require("../../../../domain/exceptions/common/Unhandled.exception");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { authorization } = req.headers;
    const token = authorization === null || authorization === void 0 ? void 0 : authorization.slice(7);
    const secret = (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : '';
    try {
        if (token === undefined)
            return res.status(403).send({ message: 'Token is not supplied' });
        jsonwebtoken_1.default.verify(token !== null && token !== void 0 ? token : '', secret, (error, decoded) => {
            if (error !== null) {
                throw new Unhandled_exception_1.UnhandledException('Token');
            }
            // Set user information on params
            req.params.sessionUser = JSON.stringify(decoded);
            next();
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.validateToken = validateToken;
