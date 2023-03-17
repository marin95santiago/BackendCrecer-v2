"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAlreadyExistException = void 0;
class UserAlreadyExistException extends Error {
    constructor() {
        super('User already exist');
    }
}
exports.UserAlreadyExistException = UserAlreadyExistException;
