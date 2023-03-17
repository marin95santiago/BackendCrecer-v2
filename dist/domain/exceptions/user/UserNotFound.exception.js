"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFoundException = void 0;
class UserNotFoundException extends Error {
    constructor() {
        super('User not found');
    }
}
exports.UserNotFoundException = UserNotFoundException;
