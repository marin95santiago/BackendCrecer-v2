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
exports.LoginUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GetUserByEmail_service_1 = require("../../../domain/services/user/GetUserByEmail.service");
const UserNotFound_exception_1 = require("../../../domain/exceptions/user/UserNotFound.exception");
const Unhandled_exception_1 = require("../../../domain/exceptions/common/Unhandled.exception");
const LoginWrongPassword_exception_1 = require("../../../domain/exceptions/user/LoginWrongPassword.exception");
class LoginUseCase {
    constructor(userRepository) {
        this._getUserByEmailService = new GetUserByEmail_service_1.GetUserByEmailService(userRepository);
    }
    run(email, password, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToLogin = yield this._getUserByEmailService.run(email);
            if (userToLogin === null)
                throw new UserNotFound_exception_1.UserNotFoundException();
            if (userToLogin.password === undefined)
                throw new Unhandled_exception_1.UnhandledException('Login 1');
            const match = yield bcrypt_1.default.compare(password, userToLogin.password);
            if (!match)
                throw new LoginWrongPassword_exception_1.LoginWrongPasswordException();
            // protect password
            delete userToLogin.password;
            // Generate token
            const token = jsonwebtoken_1.default.sign({
                exp: Math.floor(Date.now() / 1000) + (120 * 60),
                data: userToLogin
            }, secret);
            return {
                token
            };
        });
    }
}
exports.LoginUseCase = LoginUseCase;
