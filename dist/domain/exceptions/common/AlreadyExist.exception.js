"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlreadyExistException = void 0;
class AlreadyExistException extends Error {
    constructor(entity) {
        super(`${entity} already exist`);
    }
}
exports.AlreadyExistException = AlreadyExistException;
