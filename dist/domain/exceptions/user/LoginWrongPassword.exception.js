"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginWrongPasswordException = void 0;
class LoginWrongPasswordException extends Error {
    constructor() {
        super('Invalid password, please verify your password or contact technical service');
    }
}
exports.LoginWrongPasswordException = LoginWrongPasswordException;
